package relay

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
	appconstant "github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/logger"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	relayconstant "github.com/QuantumNous/new-api/relay/constant"
	"github.com/QuantumNous/new-api/relay/helper"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/setting/model_setting"
	"github.com/QuantumNous/new-api/types"

	"github.com/gin-gonic/gin"
)

func ResponsesHelper(c *gin.Context, info *relaycommon.RelayInfo) (newAPIError *types.NewAPIError) {
	info.InitChannelMeta(c)
	if info.RelayMode == relayconstant.RelayModeResponsesCompact {
		switch info.ApiType {
		case appconstant.APITypeOpenAI, appconstant.APITypeCodex:
		default:
			return types.NewErrorWithStatusCode(
				fmt.Errorf("unsupported endpoint %q for api type %d", "/v1/responses/compact", info.ApiType),
				types.ErrorCodeInvalidRequest,
				http.StatusBadRequest,
				types.ErrOptionWithSkipRetry(),
			)
		}
	}

	var responsesReq *dto.OpenAIResponsesRequest
	switch req := info.Request.(type) {
	case *dto.OpenAIResponsesRequest:
		responsesReq = req
	case *dto.OpenAIResponsesCompactionRequest:
		responsesReq = &dto.OpenAIResponsesRequest{
			Model:              req.Model,
			Input:              req.Input,
			Instructions:       req.Instructions,
			PreviousResponseID: req.PreviousResponseID,
		}
	default:
		return types.NewErrorWithStatusCode(
			fmt.Errorf("invalid request type, expected dto.OpenAIResponsesRequest or dto.OpenAIResponsesCompactionRequest, got %T", info.Request),
			types.ErrorCodeInvalidRequest,
			http.StatusBadRequest,
			types.ErrOptionWithSkipRetry(),
		)
	}

	if ShouldUseChatCompletionsFallbackForResponses(info) {
		return responsesViaChatCompletions(c, info, responsesReq)
	}

	request, err := common.DeepCopy(responsesReq)
	if err != nil {
		return types.NewError(fmt.Errorf("failed to copy request to GeneralOpenAIRequest: %w", err), types.ErrorCodeInvalidRequest, types.ErrOptionWithSkipRetry())
	}

	err = helper.ModelMappedHelper(c, info, request)
	if err != nil {
		return types.NewError(err, types.ErrorCodeChannelModelMappedError, types.ErrOptionWithSkipRetry())
	}

	adaptor := GetAdaptor(info.ApiType)
	if adaptor == nil {
		return types.NewError(fmt.Errorf("invalid api type: %d", info.ApiType), types.ErrorCodeInvalidApiType, types.ErrOptionWithSkipRetry())
	}
	adaptor.Init(info)
	var requestBody io.Reader
	if model_setting.GetGlobalSettings().PassThroughRequestEnabled || info.ChannelSetting.PassThroughBodyEnabled {
		storage, err := common.GetBodyStorage(c)
		if err != nil {
			return types.NewError(err, types.ErrorCodeReadRequestBodyFailed, types.ErrOptionWithSkipRetry())
		}
		requestBody = common.ReaderOnly(storage)
	} else {
		convertedRequest, err := adaptor.ConvertOpenAIResponsesRequest(c, info, *request)
		if err != nil {
			return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
		}
		relaycommon.AppendRequestConversionFromRequest(info, convertedRequest)
		jsonData, err := common.Marshal(convertedRequest)
		if err != nil {
			return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
		}

		// remove disabled fields for OpenAI Responses API
		jsonData, err = relaycommon.RemoveDisabledFields(jsonData, info.ChannelOtherSettings, info.ChannelSetting.PassThroughBodyEnabled)
		if err != nil {
			return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
		}

		// apply param override
		if len(info.ParamOverride) > 0 {
			jsonData, err = relaycommon.ApplyParamOverrideWithRelayInfo(jsonData, info)
			if err != nil {
				return newAPIErrorFromParamOverride(err)
			}
		}

		logger.LogDebug(c, "requestBody: %s", jsonData)
		body, size, closer, err := relaycommon.NewOutboundJSONBody(jsonData)
		if err != nil {
			return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
		}
		defer closer.Close()
		jsonData = nil
		info.UpstreamRequestBodySize = size
		requestBody = body
	}

	var httpResp *http.Response
	resp, err := adaptor.DoRequest(c, info, requestBody)
	if err != nil {
		return types.NewOpenAIError(err, types.ErrorCodeDoRequestFailed, http.StatusInternalServerError)
	}

	statusCodeMappingStr := c.GetString("status_code_mapping")

	if resp != nil {
		httpResp = resp.(*http.Response)

		if httpResp.StatusCode != http.StatusOK {
			newAPIError = service.RelayErrorHandler(c.Request.Context(), httpResp, false)
			// reset status code 重置状态码
			service.ResetStatusCode(newAPIError, statusCodeMappingStr)
			return newAPIError
		}
	}

	usage, newAPIError := adaptor.DoResponse(c, httpResp, info)
	if newAPIError != nil {
		// reset status code 重置状态码
		service.ResetStatusCode(newAPIError, statusCodeMappingStr)
		return newAPIError
	}

	usageDto := usage.(*dto.Usage)
	if info.RelayMode == relayconstant.RelayModeResponsesCompact {
		originModelName := info.OriginModelName
		originPriceData := info.PriceData

		_, err := helper.ModelPriceHelper(c, info, info.GetEstimatePromptTokens(), &types.TokenCountMeta{})
		if err != nil {
			info.OriginModelName = originModelName
			info.PriceData = originPriceData
			return types.NewError(err, types.ErrorCodeModelPriceError, types.ErrOptionWithSkipRetry(), types.ErrOptionWithStatusCode(http.StatusBadRequest))
		}
		service.PostTextConsumeQuota(c, info, usageDto, nil)

		info.OriginModelName = originModelName
		info.PriceData = originPriceData
		return nil
	}

	if strings.HasPrefix(info.OriginModelName, "gpt-4o-audio") {
		service.PostAudioConsumeQuota(c, info, usageDto, "")
	} else {
		service.PostTextConsumeQuota(c, info, usageDto, nil)
	}
	return nil
}

func ShouldUseChatCompletionsFallbackForResponses(info *relaycommon.RelayInfo) bool {
	if info.ApiType == appconstant.APITypeOpenAI {
		if info.ChannelBaseUrl == "" || strings.Contains(info.ChannelBaseUrl, "api.openai.com") {
			return false
		}
	}
	return true
}

func responsesViaChatCompletions(c *gin.Context, info *relaycommon.RelayInfo, responsesReq *dto.OpenAIResponsesRequest) *types.NewAPIError {
	chatReq, err := service.ResponsesRequestToChatCompletionsRequest(responsesReq)
	if err != nil {
		return types.NewErrorWithStatusCode(err, types.ErrorCodeInvalidRequest, http.StatusBadRequest, types.ErrOptionWithSkipRetry())
	}

	savedRelayMode := info.RelayMode
	savedRequestURLPath := info.RequestURLPath
	savedRelayFormat := info.RelayFormat
	defer func() {
		info.RelayMode = savedRelayMode
		info.RequestURLPath = savedRequestURLPath
		info.RelayFormat = savedRelayFormat
	}()

	info.RelayMode = relayconstant.RelayModeChatCompletions
	info.RequestURLPath = "/v1/chat/completions"
	info.RelayFormat = types.RelayFormatOpenAI

	err = helper.ModelMappedHelper(c, info, chatReq)
	if err != nil {
		return types.NewError(err, types.ErrorCodeChannelModelMappedError, types.ErrOptionWithSkipRetry())
	}

	adaptor := GetAdaptor(info.ApiType)
	if adaptor == nil {
		return types.NewError(fmt.Errorf("invalid api type: %d", info.ApiType), types.ErrorCodeInvalidApiType, types.ErrOptionWithSkipRetry())
	}
	adaptor.Init(info)

	convertedRequest, err := adaptor.ConvertOpenAIRequest(c, info, chatReq)
	if err != nil {
		return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
	}
	relaycommon.AppendRequestConversionFromRequest(info, convertedRequest)

	jsonData, err := common.Marshal(convertedRequest)
	if err != nil {
		return types.NewError(err, types.ErrorCodeJsonMarshalFailed, types.ErrOptionWithSkipRetry())
	}

	jsonData, err = relaycommon.RemoveDisabledFields(jsonData, info.ChannelOtherSettings, info.ChannelSetting.PassThroughBodyEnabled)
	if err != nil {
		return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
	}

	if len(info.ParamOverride) > 0 {
		jsonData, err = relaycommon.ApplyParamOverrideWithRelayInfo(jsonData, info)
		if err != nil {
			return newAPIErrorFromParamOverride(err)
		}
	}

	logger.LogInfo(c, fmt.Sprintf("Fallback Request JSON: %s", string(jsonData)))

	body, size, closer, err := relaycommon.NewOutboundJSONBody(jsonData)
	if err != nil {
		return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
	}
	defer closer.Close()
	jsonData = nil
	info.UpstreamRequestBodySize = size
	var requestBody io.Reader = body

	var httpResp *http.Response
	resp, err := adaptor.DoRequest(c, info, requestBody)
	if err != nil {
		return types.NewOpenAIError(err, types.ErrorCodeDoRequestFailed, http.StatusInternalServerError)
	}
	if resp == nil {
		return types.NewOpenAIError(nil, types.ErrorCodeBadResponse, http.StatusInternalServerError)
	}

	statusCodeMappingStr := c.GetString("status_code_mapping")

	httpResp = resp.(*http.Response)
	info.IsStream = info.IsStream || strings.HasPrefix(httpResp.Header.Get("Content-Type"), "text/event-stream")
	if httpResp.StatusCode != http.StatusOK {
		newApiErr := service.RelayErrorHandler(c.Request.Context(), httpResp, false)
		service.ResetStatusCode(newApiErr, statusCodeMappingStr)
		return newApiErr
	}

	var usage *dto.Usage
	var newApiErr *types.NewAPIError
	if info.IsStream {
		usage, newApiErr = handleStreamResponsesViaChatCompletions(c, info, httpResp)
	} else {
		usage, newApiErr = handleNonStreamResponsesViaChatCompletions(c, info, httpResp)
	}
	if newApiErr != nil {
		return newApiErr
	}

	if info.RelayMode == relayconstant.RelayModeResponsesCompact {
		originModelName := info.OriginModelName
		originPriceData := info.PriceData

		_, err := helper.ModelPriceHelper(c, info, info.GetEstimatePromptTokens(), &types.TokenCountMeta{})
		if err != nil {
			info.OriginModelName = originModelName
			info.PriceData = originPriceData
			return types.NewError(err, types.ErrorCodeModelPriceError, types.ErrOptionWithSkipRetry(), types.ErrOptionWithStatusCode(http.StatusBadRequest))
		}
		service.PostTextConsumeQuota(c, info, usage, nil)

		info.OriginModelName = originModelName
		info.PriceData = originPriceData
		return nil
	}

	if strings.HasPrefix(info.OriginModelName, "gpt-4o-audio") {
		service.PostAudioConsumeQuota(c, info, usage, "")
	} else {
		service.PostTextConsumeQuota(c, info, usage, nil)
	}
	return nil
}

func handleNonStreamResponsesViaChatCompletions(c *gin.Context, info *relaycommon.RelayInfo, httpResp *http.Response) (*dto.Usage, *types.NewAPIError) {
	defer service.CloseResponseBodyGracefully(httpResp)

	var chatResponse dto.OpenAITextResponse
	responseBody, err := io.ReadAll(httpResp.Body)
	if err != nil {
		return nil, types.NewOpenAIError(err, types.ErrorCodeReadResponseBodyFailed, http.StatusInternalServerError)
	}
	err = common.Unmarshal(responseBody, &chatResponse)
	if err != nil {
		return nil, types.NewOpenAIError(err, types.ErrorCodeBadResponseBody, http.StatusInternalServerError)
	}
	if oaiError := chatResponse.GetOpenAIError(); oaiError != nil && oaiError.Type != "" {
		return nil, types.WithOpenAIError(*oaiError, httpResp.StatusCode)
	}

	responsesResponse, err := service.ChatCompletionsResponseToResponsesResponse(&chatResponse)
	if err != nil {
		return nil, types.NewOpenAIError(err, types.ErrorCodeBadResponseBody, http.StatusInternalServerError)
	}

	respBody, err := common.Marshal(responsesResponse)
	if err != nil {
		return nil, types.NewOpenAIError(err, types.ErrorCodeJsonMarshalFailed, http.StatusInternalServerError)
	}

	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	_, _ = c.Writer.Write(respBody)

	usage := &dto.Usage{
		PromptTokens:     chatResponse.Usage.PromptTokens,
		CompletionTokens: chatResponse.Usage.CompletionTokens,
		TotalTokens:      chatResponse.Usage.TotalTokens,
	}
	return usage, nil
}

func handleStreamResponsesViaChatCompletions(c *gin.Context, info *relaycommon.RelayInfo, httpResp *http.Response) (*dto.Usage, *types.NewAPIError) {
	defer service.CloseResponseBodyGracefully(httpResp)

	helper.SetEventStreamHeaders(c)

	var (
		scanner    = bufio.NewScanner(httpResp.Body)
		usage      = &dto.Usage{}
		chatRespId = helper.GetResponseID(c)
		createdAt  = int(time.Now().Unix())
		modelName  = info.OriginModelName

		started          = false
		itemAdded        = false
		contentPartAdded = false
		accumulatedText  strings.Builder
		toolCallsMap     = make(map[string]string) // tc.ID -> accumulated arguments
	)

	scanner.Buffer(make([]byte, helper.InitialScannerBufferSize), helper.DefaultMaxScannerBufferSize)
	scanner.Split(bufio.ScanLines)

	sendEvent := func(evtType string, payload any) {
		jsonData, err := common.Marshal(payload)
		if err != nil {
			logger.LogError(c, "failed to marshal response stream event: "+err.Error())
			return
		}
		c.Render(-1, common.CustomEvent{Data: fmt.Sprintf("event: %s\n", evtType)})
		c.Render(-1, common.CustomEvent{Data: fmt.Sprintf("data: %s", string(jsonData))})
		_ = helper.FlushWriter(c)
	}

	for scanner.Scan() {
		line := scanner.Text()
		if len(line) < 6 {
			continue
		}
		if line[:5] != "data:" && line[:6] != "[DONE]" {
			continue
		}
		lineData := line[5:]
		lineData = strings.TrimSpace(lineData)
		if lineData == "" {
			continue
		}
		if strings.HasPrefix(lineData, "[DONE]") {
			break
		}

		var chunk dto.ChatCompletionsStreamResponse
		if err := common.UnmarshalJsonStr(lineData, &chunk); err != nil {
			logger.LogError(c, "failed to unmarshal chat completion stream chunk: "+err.Error())
			continue
		}

		if chunk.Id != "" {
			chatRespId = chunk.Id
		}
		if chunk.Created != 0 {
			createdAt = int(chunk.Created)
		}
		if chunk.Model != "" {
			modelName = chunk.Model
		}
		if chunk.Usage != nil {
			if chunk.Usage.PromptTokens != 0 {
				usage.PromptTokens = chunk.Usage.PromptTokens
			}
			if chunk.Usage.CompletionTokens != 0 {
				usage.CompletionTokens = chunk.Usage.CompletionTokens
			}
			if chunk.Usage.TotalTokens != 0 {
				usage.TotalTokens = chunk.Usage.TotalTokens
			}
		}

		if !started {
			started = true

			// 1. response.created
			sendEvent("response.created", dto.ResponsesStreamResponse{
				Type: "response.created",
				Response: &dto.OpenAIResponsesResponse{
					ID:        chatRespId,
					Object:    "response",
					CreatedAt: createdAt,
					Status:    json.RawMessage(`"in_progress"`),
					Model:     modelName,
				},
			})

			// 2. response.in_progress
			sendEvent("response.in_progress", dto.ResponsesStreamResponse{
				Type: "response.in_progress",
				Response: &dto.OpenAIResponsesResponse{
					ID:        chatRespId,
					Object:    "response",
					CreatedAt: createdAt,
					Status:    json.RawMessage(`"in_progress"`),
					Model:     modelName,
				},
			})
		}

		if len(chunk.Choices) > 0 {
			choice := chunk.Choices[0]

			// Handle content delta
			content := choice.Delta.GetContentString()
			if content != "" {
				if !itemAdded {
					itemAdded = true
					sendEvent("response.output_item.added", dto.ResponsesStreamResponse{
						Type:        "response.output_item.added",
						OutputIndex: common.GetPointer(0),
						Item: &dto.ResponsesOutput{
							ID:      "msg_" + chatRespId,
							Type:    "message",
							Role:    "assistant",
							Status:  "in_progress",
							Content: []dto.ResponsesOutputContent{},
						},
					})
				}
				if !contentPartAdded {
					contentPartAdded = true
					sendEvent("response.content_part.added", dto.ResponsesStreamResponse{
						Type:         "response.content_part.added",
						ItemID:       "msg_" + chatRespId,
						OutputIndex:  common.GetPointer(0),
						ContentIndex: common.GetPointer(0),
						Part: map[string]any{
							"type":        "output_text",
							"annotations": []any{},
							"logprobs":    []any{},
							"text":        "",
						},
					})
				}

				accumulatedText.WriteString(content)
				sendEvent("response.output_text.delta", dto.ResponsesStreamResponse{
					Type:         "response.output_text.delta",
					Delta:        content,
					OutputIndex:  common.GetPointer(0),
					ContentIndex: common.GetPointer(0),
					ItemID:       "msg_" + chatRespId,
				})
			}

			// Handle reasoning content delta
			reasoningContent := choice.Delta.GetReasoningContent()
			if reasoningContent != "" {
				if !itemAdded {
					itemAdded = true
					sendEvent("response.output_item.added", dto.ResponsesStreamResponse{
						Type:        "response.output_item.added",
						OutputIndex: common.GetPointer(0),
						Item: &dto.ResponsesOutput{
							ID:      "msg_" + chatRespId,
							Type:    "message",
							Role:    "assistant",
							Status:  "in_progress",
							Content: []dto.ResponsesOutputContent{},
						},
					})
				}
				if !contentPartAdded {
					contentPartAdded = true
					sendEvent("response.content_part.added", dto.ResponsesStreamResponse{
						Type:         "response.content_part.added",
						ItemID:       "msg_" + chatRespId,
						OutputIndex:  common.GetPointer(0),
						ContentIndex: common.GetPointer(0),
						Part: map[string]any{
							"type":        "output_text",
							"annotations": []any{},
							"logprobs":    []any{},
							"text":        "",
						},
					})
				}

				accumulatedText.WriteString(reasoningContent)
				sendEvent("response.output_text.delta", dto.ResponsesStreamResponse{
					Type:         "response.output_text.delta",
					Delta:        reasoningContent,
					OutputIndex:  common.GetPointer(0),
					ContentIndex: common.GetPointer(0),
					ItemID:       "msg_" + chatRespId,
				})
			}

			// Handle tool calls delta
			for _, tc := range choice.Delta.ToolCalls {
				tcId := tc.ID
				if tcId == "" {
					tcId = fmt.Sprintf("call_%s_0", chatRespId)
				}

				if _, ok := toolCallsMap[tcId]; !ok {
					sendEvent("response.output_item.added", dto.ResponsesStreamResponse{
						Type:        "response.output_item.added",
						OutputIndex: common.GetPointer(0),
						Item: &dto.ResponsesOutput{
							ID:        "fc_" + tcId,
							Type:      "function_call",
							CallId:    tcId,
							Name:      tc.Function.Name,
							Status:    "in_progress",
							Arguments: json.RawMessage(`""`),
						},
					})
				}

				toolCallsMap[tcId] = toolCallsMap[tcId] + tc.Function.Arguments

				sendEvent("response.function_call_arguments.delta", dto.ResponsesStreamResponse{
					Type:        "response.function_call_arguments.delta",
					Delta:       tc.Function.Arguments,
					ItemID:      "fc_" + tcId,
					OutputIndex: common.GetPointer(0),
				})
			}
		}
	}

	if !started {
		started = true
		sendEvent("response.created", dto.ResponsesStreamResponse{
			Type: "response.created",
			Response: &dto.OpenAIResponsesResponse{
				ID:        chatRespId,
				Object:    "response",
				CreatedAt: createdAt,
				Status:    json.RawMessage(`"in_progress"`),
				Model:     modelName,
			},
		})
		sendEvent("response.in_progress", dto.ResponsesStreamResponse{
			Type: "response.in_progress",
			Response: &dto.OpenAIResponsesResponse{
				ID:        chatRespId,
				Object:    "response",
				CreatedAt: createdAt,
				Status:    json.RawMessage(`"in_progress"`),
				Model:     modelName,
			},
		})
	}

	// 3. Send done events for text output
	if itemAdded || (accumulatedText.Len() > 0 || len(toolCallsMap) == 0) {
		if !itemAdded {
			itemAdded = true
			sendEvent("response.output_item.added", dto.ResponsesStreamResponse{
				Type:        "response.output_item.added",
				OutputIndex: common.GetPointer(0),
				Item: &dto.ResponsesOutput{
					ID:      "msg_" + chatRespId,
					Type:    "message",
					Role:    "assistant",
					Status:  "in_progress",
					Content: []dto.ResponsesOutputContent{},
				},
			})
			sendEvent("response.content_part.added", dto.ResponsesStreamResponse{
				Type:         "response.content_part.added",
				ItemID:       "msg_" + chatRespId,
				OutputIndex:  common.GetPointer(0),
				ContentIndex: common.GetPointer(0),
				Part: map[string]any{
					"type":        "output_text",
					"annotations": []any{},
					"logprobs":    []any{},
					"text":        "",
				},
			})
		}

		sendEvent("response.output_text.done", map[string]any{
			"type":          "response.output_text.done",
			"item_id":       "msg_" + chatRespId,
			"output_index":  0,
			"content_index": 0,
			"text":          accumulatedText.String(),
			"logprobs":      []any{},
		})

		sendEvent("response.content_part.done", map[string]any{
			"type":          "response.content_part.done",
			"item_id":       "msg_" + chatRespId,
			"output_index":  0,
			"content_index": 0,
			"part": map[string]any{
				"type":        "output_text",
				"annotations": []any{},
				"logprobs":    []any{},
				"text":        accumulatedText.String(),
			},
		})

		sendEvent("response.output_item.done", dto.ResponsesStreamResponse{
			Type:        "response.output_item.done",
			OutputIndex: common.GetPointer(0),
			Item: &dto.ResponsesOutput{
				Type:   "message",
				ID:     "msg_" + chatRespId,
				Status: "completed",
				Role:   "assistant",
				Content: []dto.ResponsesOutputContent{
					{
						Type:        "output_text",
						Text:        accumulatedText.String(),
						Annotations: []any{},
					},
				},
			},
		})
	}

	// Send done events for tool calls
	for tcId, tcArgs := range toolCallsMap {
		sendEvent("response.function_call_arguments.done", map[string]any{
			"type":         "response.function_call_arguments.done",
			"item_id":      "fc_" + tcId,
			"output_index": 0,
			"arguments":    tcArgs,
		})

		sendEvent("response.output_item.done", dto.ResponsesStreamResponse{
			Type:        "response.output_item.done",
			OutputIndex: common.GetPointer(0),
			Item: &dto.ResponsesOutput{
				Type:      "function_call",
				ID:        "fc_" + tcId,
				Status:    "completed",
				CallId:    tcId,
				Arguments: json.RawMessage(tcArgs),
			},
		})
	}

	if usage.CompletionTokens == 0 {
		tempStr := accumulatedText.String()
		if len(tempStr) > 0 {
			completionTokens := service.CountTextToken(tempStr, info.UpstreamModelName)
			usage.CompletionTokens = completionTokens
		}
	}
	if usage.PromptTokens == 0 && usage.CompletionTokens != 0 {
		usage.PromptTokens = info.GetEstimatePromptTokens()
	}
	usage.TotalTokens = usage.PromptTokens + usage.CompletionTokens

	// 4. Send response.completed
	var outputs []dto.ResponsesOutput
	if accumulatedText.Len() > 0 {
		outputs = append(outputs, dto.ResponsesOutput{
			Type:   "message",
			ID:     "msg_" + chatRespId,
			Status: "completed",
			Role:   "assistant",
			Content: []dto.ResponsesOutputContent{
				{
					Type:        "output_text",
					Text:        accumulatedText.String(),
					Annotations: []any{},
				},
			},
		})
	}
	for tcId, tcArgs := range toolCallsMap {
		outputs = append(outputs, dto.ResponsesOutput{
			Type:      "function_call",
			ID:        "fc_" + tcId,
			Status:    "completed",
			CallId:    tcId,
			Arguments: json.RawMessage(tcArgs),
		})
	}

	sendEvent("response.completed", dto.ResponsesStreamResponse{
		Type: "response.completed",
		Response: &dto.OpenAIResponsesResponse{
			ID:        chatRespId,
			Object:    "response",
			CreatedAt: createdAt,
			Status:    json.RawMessage(`"completed"`),
			Model:     modelName,
			Output:    outputs,
			Usage: &dto.Usage{
				InputTokens:  usage.PromptTokens,
				OutputTokens: usage.CompletionTokens,
				TotalTokens:  usage.TotalTokens,
			},
		},
	})

	// 5. Send [DONE]
	c.Render(-1, common.CustomEvent{Data: "data: [DONE]"})
	_ = helper.FlushWriter(c)

	if err := scanner.Err(); err != nil {
		if err != io.EOF {
			logger.LogError(c, "responses fallback stream scanner error: "+err.Error())
		}
	}

	return usage, nil
}

