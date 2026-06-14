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

	// Keep savedJsonData for retry on transient upstream errors (e.g. LiteRouter cold-start).
	savedJsonData := jsonData

	statusCodeMappingStr := c.GetString("status_code_mapping")

	var httpResp *http.Response
	const maxAttempts = 2
	for attempt := 1; attempt <= maxAttempts; attempt++ {
		body, size, closer, err := relaycommon.NewOutboundJSONBody(savedJsonData)
		if err != nil {
			return types.NewError(err, types.ErrorCodeConvertRequestFailed, types.ErrOptionWithSkipRetry())
		}
		info.UpstreamRequestBodySize = size

		resp, err := adaptor.DoRequest(c, info, body)
		closer.Close()
		if err != nil {
			if attempt < maxAttempts {
				logger.LogWarn(c, fmt.Sprintf("Responses fallback DoRequest error (attempt %d/%d), retrying: %v", attempt, maxAttempts, err))
				continue
			}
			return types.NewOpenAIError(err, types.ErrorCodeDoRequestFailed, http.StatusInternalServerError)
		}
		if resp == nil {
			if attempt < maxAttempts {
				logger.LogWarn(c, fmt.Sprintf("Responses fallback nil response (attempt %d/%d), retrying", attempt, maxAttempts))
				continue
			}
			return types.NewOpenAIError(nil, types.ErrorCodeBadResponse, http.StatusInternalServerError)
		}

		httpResp = resp.(*http.Response)
		info.IsStream = info.IsStream || strings.HasPrefix(httpResp.Header.Get("Content-Type"), "text/event-stream")
		if httpResp.StatusCode != http.StatusOK {
			newApiErr := service.RelayErrorHandler(c.Request.Context(), httpResp, false)
			// Retry on transient upstream routing errors (e.g. LiteRouter cooldown/cold-start)
			if attempt < maxAttempts && strings.Contains(newApiErr.Error(), "all active connections failed") {
				logger.LogWarn(c, fmt.Sprintf("Responses fallback upstream transient error (attempt %d/%d), retrying: %s", attempt, maxAttempts, newApiErr.Error()))
				continue
			}
			service.ResetStatusCode(newApiErr, statusCodeMappingStr)
			return newApiErr
		}
		break // success
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

type responseStreamState struct {
	responseId         string
	createdAt          int
	modelName          string
	seq                int
	started            bool
	inThinking         bool
	// Text output tracking
	msgItemAdded       map[int]bool
	msgContentAdded    map[int]bool
	msgTextBuf         map[int]string
	msgItemDone        map[int]bool
	// Reasoning tracking
	reasoningId        string
	reasoningIndex     int
	reasoningBuf       strings.Builder
	reasoningPartAdded bool
	reasoningDone      bool
	// Tool calls tracking
	funcCallIds        map[int]string
	funcArgsBuf        map[int]string
	funcNames          map[int]string
	funcItemDone       map[int]bool
	funcArgsDone       map[int]bool
	completedSent      bool
}

func (s *responseStreamState) startReasoning(sendEvent func(string, dto.ResponsesStreamResponse), idx int) {
	if s.reasoningId == "" {
		s.reasoningId = fmt.Sprintf("rs_%s_%d", s.responseId, idx)
		s.reasoningIndex = idx

		sendEvent("response.output_item.added", dto.ResponsesStreamResponse{
			OutputIndex: common.GetPointer(idx),
			Item: &dto.ResponsesOutput{
				ID:      s.reasoningId,
				Type:    "reasoning",
				Summary: []dto.ResponsesReasoningSummaryPart{},
			},
		})

		sendEvent("response.reasoning_summary_part.added", dto.ResponsesStreamResponse{
			ItemID:       s.reasoningId,
			OutputIndex:  common.GetPointer(idx),
			SummaryIndex: common.GetPointer(0),
			Part: dto.ResponsesReasoningSummaryPart{
				Type: "summary_text",
				Text: "",
			},
		})
		s.reasoningPartAdded = true
	}
}

func (s *responseStreamState) emitReasoningDelta(sendEvent func(string, dto.ResponsesStreamResponse), text string) {
	if text == "" {
		return
	}
	s.reasoningBuf.WriteString(text)
	sendEvent("response.reasoning_summary_text.delta", dto.ResponsesStreamResponse{
		ItemID:       s.reasoningId,
		OutputIndex:  common.GetPointer(s.reasoningIndex),
		SummaryIndex: common.GetPointer(0),
		Delta:        text,
	})
}

func (s *responseStreamState) closeReasoning(sendEvent func(string, dto.ResponsesStreamResponse)) {
	if s.reasoningId != "" && !s.reasoningDone {
		s.reasoningDone = true

		sendEvent("response.reasoning_summary_text.done", dto.ResponsesStreamResponse{
			ItemID:       s.reasoningId,
			OutputIndex:  common.GetPointer(s.reasoningIndex),
			SummaryIndex: common.GetPointer(0),
			Text:         s.reasoningBuf.String(),
		})

		sendEvent("response.reasoning_summary_part.done", dto.ResponsesStreamResponse{
			ItemID:       s.reasoningId,
			OutputIndex:  common.GetPointer(s.reasoningIndex),
			SummaryIndex: common.GetPointer(0),
			Part: dto.ResponsesReasoningSummaryPart{
				Type: "summary_text",
				Text: s.reasoningBuf.String(),
			},
		})

		sendEvent("response.output_item.done", dto.ResponsesStreamResponse{
			OutputIndex: common.GetPointer(s.reasoningIndex),
			Item: &dto.ResponsesOutput{
				ID:   s.reasoningId,
				Type: "reasoning",
				Summary: []dto.ResponsesReasoningSummaryPart{
					{
						Type: "summary_text",
						Text: s.reasoningBuf.String(),
					},
				},
			},
		})
	}
}

func (s *responseStreamState) emitTextContent(sendEvent func(string, dto.ResponsesStreamResponse), idx int, content string) {
	if !s.msgItemAdded[idx] {
		s.msgItemAdded[idx] = true
		msgId := fmt.Sprintf("msg_%s_%d", s.responseId, idx)

		sendEvent("response.output_item.added", dto.ResponsesStreamResponse{
			OutputIndex: common.GetPointer(idx),
			Item: &dto.ResponsesOutput{
				ID:      msgId,
				Type:    "message",
				Content: []dto.ResponsesOutputContent{},
				Role:    "assistant",
			},
		})
	}

	if !s.msgContentAdded[idx] {
		s.msgContentAdded[idx] = true
		msgId := fmt.Sprintf("msg_%s_%d", s.responseId, idx)

		sendEvent("response.content_part.added", dto.ResponsesStreamResponse{
			ItemID:       msgId,
			OutputIndex:  common.GetPointer(idx),
			ContentIndex: common.GetPointer(0),
			Part: map[string]any{
				"type":        "output_text",
				"annotations": []any{},
				"logprobs":    []any{},
				"text":        "",
			},
		})
	}

	msgId := fmt.Sprintf("msg_%s_%d", s.responseId, idx)
	sendEvent("response.output_text.delta", dto.ResponsesStreamResponse{
		ItemID:       msgId,
		OutputIndex:  common.GetPointer(idx),
		ContentIndex: common.GetPointer(0),
		Delta:        content,
		Logprobs:     []any{},
	})

	s.msgTextBuf[idx] = s.msgTextBuf[idx] + content
}

func (s *responseStreamState) closeMessage(sendEvent func(string, dto.ResponsesStreamResponse), idx int) {
	if s.msgItemAdded[idx] && !s.msgItemDone[idx] {
		s.msgItemDone[idx] = true
		fullText := s.msgTextBuf[idx]
		msgId := fmt.Sprintf("msg_%s_%d", s.responseId, idx)

		sendEvent("response.output_text.done", dto.ResponsesStreamResponse{
			ItemID:       msgId,
			OutputIndex:  common.GetPointer(idx),
			ContentIndex: common.GetPointer(0),
			Text:         fullText,
			Logprobs:     []any{},
		})

		sendEvent("response.content_part.done", dto.ResponsesStreamResponse{
			ItemID:       msgId,
			OutputIndex:  common.GetPointer(idx),
			ContentIndex: common.GetPointer(0),
			Part: map[string]any{
				"type":        "output_text",
				"annotations": []any{},
				"logprobs":    []any{},
				"text":        fullText,
			},
		})

		sendEvent("response.output_item.done", dto.ResponsesStreamResponse{
			OutputIndex: common.GetPointer(idx),
			Item: &dto.ResponsesOutput{
				ID:     msgId,
				Type:   "message",
				Role:   "assistant",
				Status: "completed",
				Content: []dto.ResponsesOutputContent{
					{
						Type:        "output_text",
						Text:        fullText,
						Annotations: []any{},
					},
				},
			},
		})
	}
}

func (s *responseStreamState) emitToolCall(sendEvent func(string, dto.ResponsesStreamResponse), tc dto.ToolCallResponse) {
	tcIdx := 0
	if tc.Index != nil {
		tcIdx = *tc.Index
	}
	newCallId := tc.ID
	funcName := tc.Function.Name

	if funcName != "" {
		s.funcNames[tcIdx] = funcName
	}

	if s.funcCallIds[tcIdx] == "" && newCallId != "" {
		s.funcCallIds[tcIdx] = newCallId

		sendEvent("response.output_item.added", dto.ResponsesStreamResponse{
			OutputIndex: common.GetPointer(tcIdx),
			Item: &dto.ResponsesOutput{
				ID:        fmt.Sprintf("fc_%s", newCallId),
				Type:      "function_call",
				CallId:    newCallId,
				Name:      s.funcNames[tcIdx],
				Status:    "in_progress",
				Arguments: json.RawMessage(`""`),
			},
		})
	}

	if tc.Function.Arguments != "" {
		refCallId := s.funcCallIds[tcIdx]
		if refCallId == "" {
			refCallId = newCallId
		}
		if refCallId != "" {
			sendEvent("response.function_call_arguments.delta", dto.ResponsesStreamResponse{
				ItemID:      fmt.Sprintf("fc_%s", refCallId),
				OutputIndex: common.GetPointer(tcIdx),
				Delta:       tc.Function.Arguments,
			})
		}
		s.funcArgsBuf[tcIdx] = s.funcArgsBuf[tcIdx] + tc.Function.Arguments
	}
}

func (s *responseStreamState) closeToolCall(sendEvent func(string, dto.ResponsesStreamResponse), idx int) {
	callId := s.funcCallIds[idx]
	if callId != "" && !s.funcItemDone[idx] {
		args := s.funcArgsBuf[idx]
		if args == "" {
			args = "{}"
		}

		sendEvent("response.function_call_arguments.done", dto.ResponsesStreamResponse{
			ItemID:      fmt.Sprintf("fc_%s", callId),
			OutputIndex: common.GetPointer(idx),
			Arguments:   args,
		})

		sendEvent("response.output_item.done", dto.ResponsesStreamResponse{
			OutputIndex: common.GetPointer(idx),
			Item: &dto.ResponsesOutput{
				ID:        fmt.Sprintf("fc_%s", callId),
				Type:      "function_call",
				Status:    "completed",
				CallId:    callId,
				Name:      s.funcNames[idx],
				Arguments: json.RawMessage([]byte(args)),
			},
		})

		s.funcItemDone[idx] = true
		s.funcArgsDone[idx] = true
	}
}

func (s *responseStreamState) sendCompleted(sendEvent func(string, dto.ResponsesStreamResponse), usage *dto.Usage) {
	if !s.completedSent {
		s.completedSent = true

		var outputs []dto.ResponsesOutput
		if s.reasoningId != "" {
			outputs = append(outputs, dto.ResponsesOutput{
				Type: "reasoning",
				ID:   s.reasoningId,
				Summary: []dto.ResponsesReasoningSummaryPart{
					{
						Type: "summary_text",
						Text: s.reasoningBuf.String(),
					},
				},
			})
		}

		maxMsgIdx := -1
		for idx := range s.msgItemAdded {
			if idx > maxMsgIdx {
				maxMsgIdx = idx
			}
		}
		for idx := 0; idx <= maxMsgIdx; idx++ {
			if s.msgItemAdded[idx] {
				outputs = append(outputs, dto.ResponsesOutput{
					Type:   "message",
					ID:     fmt.Sprintf("msg_%s_%d", s.responseId, idx),
					Status: "completed",
					Role:   "assistant",
					Content: []dto.ResponsesOutputContent{
						{
							Type:        "output_text",
							Text:        s.msgTextBuf[idx],
							Annotations: []any{},
						},
					},
				})
			}
		}

		maxFuncIdx := -1
		for idx := range s.funcCallIds {
			if idx > maxFuncIdx {
				maxFuncIdx = idx
			}
		}
		for idx := 0; idx <= maxFuncIdx; idx++ {
			callId := s.funcCallIds[idx]
			if callId != "" {
				args := s.funcArgsBuf[idx]
				if args == "" {
					args = "{}"
				}
				outputs = append(outputs, dto.ResponsesOutput{
					Type:      "function_call",
					ID:        fmt.Sprintf("fc_%s", callId),
					Status:    "completed",
					CallId:    callId,
					Arguments: json.RawMessage([]byte(args)),
					Name:      s.funcNames[idx],
				})
			}
		}

		sendEvent("response.completed", dto.ResponsesStreamResponse{
			Response: &dto.OpenAIResponsesResponse{
				ID:        s.responseId,
				Object:    "response",
				CreatedAt: s.createdAt,
				Status:    json.RawMessage(`"completed"`),
				Model:     s.modelName,
				Output:    outputs,
				Usage: &dto.Usage{
					InputTokens:  usage.PromptTokens,
					OutputTokens: usage.CompletionTokens,
					TotalTokens:  usage.TotalTokens,
				},
			},
		})
	}
}

func (s *responseStreamState) flushState(sendEvent func(string, dto.ResponsesStreamResponse), usage *dto.Usage) {
	if s.completedSent {
		return
	}
	for idx := range s.msgItemAdded {
		s.closeMessage(sendEvent, idx)
	}
	s.closeReasoning(sendEvent)
	for idx := range s.funcCallIds {
		s.closeToolCall(sendEvent, idx)
	}
	s.sendCompleted(sendEvent, usage)
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
	)

	scanner.Buffer(make([]byte, helper.InitialScannerBufferSize), helper.DefaultMaxScannerBufferSize)
	scanner.Split(bufio.ScanLines)

	state := &responseStreamState{
		responseId:      chatRespId,
		createdAt:       createdAt,
		modelName:       modelName,
		msgItemAdded:    make(map[int]bool),
		msgContentAdded: make(map[int]bool),
		msgTextBuf:      make(map[int]string),
		msgItemDone:     make(map[int]bool),
		funcCallIds:     make(map[int]string),
		funcArgsBuf:     make(map[int]string),
		funcNames:       make(map[int]string),
		funcItemDone:    make(map[int]bool),
		funcArgsDone:    make(map[int]bool),
	}

	nextSeq := func() int {
		state.seq++
		return state.seq
	}

	sendEvent := func(evtType string, payload dto.ResponsesStreamResponse) {
		payload.Type = evtType
		payload.SequenceNumber = nextSeq()
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
			state.responseId = chunk.Id
		}
		if chunk.Created != 0 {
			state.createdAt = int(chunk.Created)
		}
		if chunk.Model != "" {
			state.modelName = chunk.Model
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

		if !state.started {
			state.started = true

			// 1. response.created
			sendEvent("response.created", dto.ResponsesStreamResponse{
				Response: &dto.OpenAIResponsesResponse{
					ID:        state.responseId,
					Object:    "response",
					CreatedAt: state.createdAt,
					Status:    json.RawMessage(`"in_progress"`),
					Model:     state.modelName,
				},
			})

			// 2. response.in_progress
			sendEvent("response.in_progress", dto.ResponsesStreamResponse{
				Response: &dto.OpenAIResponsesResponse{
					ID:        state.responseId,
					Object:    "response",
					CreatedAt: state.createdAt,
					Status:    json.RawMessage(`"in_progress"`),
					Model:     state.modelName,
				},
			})
		}

		if len(chunk.Choices) > 0 {
			choice := chunk.Choices[0]
			idx := choice.Index

			// Handle reasoning content delta
			reasoningContent := choice.Delta.GetReasoningContent()
			if reasoningContent != "" {
				state.startReasoning(sendEvent, idx)
				state.emitReasoningDelta(sendEvent, reasoningContent)
			}

			// Handle text content delta
			content := choice.Delta.GetContentString()
			if content != "" {
				if strings.Contains(content, "<think>") {
					state.inThinking = true
					content = strings.Replace(content, "<think>", "", 1)
					state.startReasoning(sendEvent, idx)
				}

				if strings.Contains(content, "</think>") {
					parts := strings.SplitN(content, "</think>", 2)
					thinkPart := parts[0]
					textPart := ""
					if len(parts) > 1 {
						textPart = parts[1]
					}
					if thinkPart != "" {
						state.emitReasoningDelta(sendEvent, thinkPart)
					}
					state.closeReasoning(sendEvent)
					state.inThinking = false
					content = textPart
				}

				if state.inThinking && content != "" {
					state.emitReasoningDelta(sendEvent, content)
					continue
				}

				if content != "" {
					state.emitTextContent(sendEvent, idx, content)
				}
			}

			// Handle tool calls delta
			if len(choice.Delta.ToolCalls) > 0 {
				state.closeMessage(sendEvent, idx)
				for _, tc := range choice.Delta.ToolCalls {
					state.emitToolCall(sendEvent, tc)
				}
			}

			// Handle finish_reason
			if choice.FinishReason != nil && *choice.FinishReason != "" {
				state.flushState(sendEvent, usage)
			}
		}
	}

	if !state.started {
		state.started = true
		sendEvent("response.created", dto.ResponsesStreamResponse{
			Response: &dto.OpenAIResponsesResponse{
				ID:        state.responseId,
				Object:    "response",
				CreatedAt: state.createdAt,
				Status:    json.RawMessage(`"in_progress"`),
				Model:     state.modelName,
			},
		})
		sendEvent("response.in_progress", dto.ResponsesStreamResponse{
			Response: &dto.OpenAIResponsesResponse{
				ID:        state.responseId,
				Object:    "response",
				CreatedAt: state.createdAt,
				Status:    json.RawMessage(`"in_progress"`),
				Model:     state.modelName,
			},
		})
	}

	state.flushState(sendEvent, usage)

	if usage.CompletionTokens == 0 {
		var accumulatedText strings.Builder
		for _, v := range state.msgTextBuf {
			accumulatedText.WriteString(v)
		}
		for _, v := range state.funcArgsBuf {
			accumulatedText.WriteString(v)
		}
		accumulatedText.WriteString(state.reasoningBuf.String())

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
