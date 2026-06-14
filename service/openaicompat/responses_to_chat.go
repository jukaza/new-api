package openaicompat

import (
	"errors"
	"fmt"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/dto"
)

func ResponsesResponseToChatCompletionsResponse(resp *dto.OpenAIResponsesResponse, id string) (*dto.OpenAITextResponse, *dto.Usage, error) {
	if resp == nil {
		return nil, nil, errors.New("response is nil")
	}

	text := ExtractOutputTextFromResponses(resp)

	usage := &dto.Usage{}
	if resp.Usage != nil {
		if resp.Usage.InputTokens != 0 {
			usage.PromptTokens = resp.Usage.InputTokens
			usage.InputTokens = resp.Usage.InputTokens
		}
		if resp.Usage.OutputTokens != 0 {
			usage.CompletionTokens = resp.Usage.OutputTokens
			usage.OutputTokens = resp.Usage.OutputTokens
		}
		if resp.Usage.TotalTokens != 0 {
			usage.TotalTokens = resp.Usage.TotalTokens
		} else {
			usage.TotalTokens = usage.PromptTokens + usage.CompletionTokens
		}
		if resp.Usage.InputTokensDetails != nil {
			usage.PromptTokensDetails.CachedTokens = resp.Usage.InputTokensDetails.CachedTokens
			usage.PromptTokensDetails.ImageTokens = resp.Usage.InputTokensDetails.ImageTokens
			usage.PromptTokensDetails.AudioTokens = resp.Usage.InputTokensDetails.AudioTokens
		}
		if resp.Usage.CompletionTokenDetails.ReasoningTokens != 0 {
			usage.CompletionTokenDetails.ReasoningTokens = resp.Usage.CompletionTokenDetails.ReasoningTokens
		}
	}

	created := resp.CreatedAt

	var toolCalls []dto.ToolCallResponse
	if text == "" && len(resp.Output) > 0 {
		for _, out := range resp.Output {
			if out.Type != "function_call" {
				continue
			}
			name := strings.TrimSpace(out.Name)
			if name == "" {
				continue
			}
			callId := strings.TrimSpace(out.CallId)
			if callId == "" {
				callId = strings.TrimSpace(out.ID)
			}
			toolCalls = append(toolCalls, dto.ToolCallResponse{
				ID:   callId,
				Type: "function",
				Function: dto.FunctionResponse{
					Name:      name,
					Arguments: out.ArgumentsString(),
				},
			})
		}
	}

	finishReason := "stop"
	if len(toolCalls) > 0 {
		finishReason = "tool_calls"
	}

	msg := dto.Message{
		Role:    "assistant",
		Content: text,
	}
	if len(toolCalls) > 0 {
		msg.SetToolCalls(toolCalls)
		msg.Content = ""
	}

	out := &dto.OpenAITextResponse{
		Id:      id,
		Object:  "chat.completion",
		Created: created,
		Model:   resp.Model,
		Choices: []dto.OpenAITextResponseChoice{
			{
				Index:        0,
				Message:      msg,
				FinishReason: finishReason,
			},
		},
		Usage: *usage,
	}

	return out, usage, nil
}

func ExtractOutputTextFromResponses(resp *dto.OpenAIResponsesResponse) string {
	if resp == nil || len(resp.Output) == 0 {
		return ""
	}

	var sb strings.Builder

	// Prefer assistant message outputs.
	for _, out := range resp.Output {
		if out.Type != "message" {
			continue
		}
		if out.Role != "" && out.Role != "assistant" {
			continue
		}
		for _, c := range out.Content {
			if c.Type == "output_text" && c.Text != "" {
				sb.WriteString(c.Text)
			}
		}
	}
	if sb.Len() > 0 {
		return sb.String()
	}
	for _, out := range resp.Output {
		for _, c := range out.Content {
			if c.Text != "" {
				sb.WriteString(c.Text)
			}
		}
	}
	return sb.String()
}

func ResponsesRequestToChatCompletionsRequest(req *dto.OpenAIResponsesRequest) (*dto.GeneralOpenAIRequest, error) {
	if req == nil {
		return nil, errors.New("request is nil")
	}

	var messages []dto.Message
	if len(req.Instructions) > 0 {
		var instructionsStr string
		if err := common.Unmarshal(req.Instructions, &instructionsStr); err == nil && instructionsStr != "" {
			messages = append(messages, dto.Message{
				Role:    "system",
				Content: instructionsStr,
			})
		}
	}

	inputMessages := mapResponsesInputToChatMessages(req.Input)
	if len(inputMessages) > 0 {
		messages = append(messages, inputMessages...)
	}

	var tools []dto.ToolCallRequest
	if len(req.Tools) > 0 {
		var rawTools []map[string]any
		if err := common.Unmarshal(req.Tools, &rawTools); err == nil {
			for _, rt := range rawTools {
				t, _ := rt["type"].(string)
				if t == "function" {
					name, _ := rt["name"].(string)
					desc, _ := rt["description"].(string)
					params := rt["parameters"]

					tools = append(tools, dto.ToolCallRequest{
						Type: "function",
						Function: dto.FunctionRequest{
							Name:        name,
							Description: desc,
							Parameters:  params,
						},
					})
				}
			}
		}
	}

	var toolChoice any
	if len(req.ToolChoice) > 0 {
		var strChoice string
		if err := common.Unmarshal(req.ToolChoice, &strChoice); err == nil {
			toolChoice = strChoice
		} else {
			var objChoice map[string]any
			if err := common.Unmarshal(req.ToolChoice, &objChoice); err == nil {
				t, _ := objChoice["type"].(string)
				if t == "function" {
					name, _ := objChoice["name"].(string)
					toolChoice = map[string]any{
						"type": "function",
						"function": map[string]any{
							"name": name,
						},
					}
				} else {
					toolChoice = objChoice
				}
			} else {
				toolChoice = req.ToolChoice
			}
		}
	}

	if strings.Contains(strings.ToLower(req.Model), "deepseek") {
		tools = nil
		toolChoice = nil
	}

	var responseFormat *dto.ResponseFormat
	if len(req.Text) > 0 {
		var textParams struct {
			Format struct {
				Type   string `json:"type"`
				Name   string `json:"name"`
				Strict *bool  `json:"strict,omitempty"`
				Schema any    `json:"schema,omitempty"`
			} `json:"format"`
		}
		if err := common.Unmarshal(req.Text, &textParams); err == nil && textParams.Format.Type != "" {
			responseFormat = &dto.ResponseFormat{
				Type: textParams.Format.Type,
			}
			if textParams.Format.Type == "json_schema" {
				schemaObj := map[string]any{
					"name": textParams.Format.Name,
				}
				if textParams.Format.Strict != nil {
					schemaObj["strict"] = *textParams.Format.Strict
				}
				if textParams.Format.Schema != nil {
					schemaObj["schema"] = textParams.Format.Schema
				}
				schemaJson, _ := common.Marshal(schemaObj)
				responseFormat.JsonSchema = schemaJson
			}
		}
	}

	var maxTokens *uint
	if req.MaxOutputTokens != nil {
		maxTokens = req.MaxOutputTokens
	}

	var reasoningEffort string
	if req.Reasoning != nil {
		reasoningEffort = req.Reasoning.Effort
	}

	var parallelToolCalls *bool
	if len(req.ParallelToolCalls) > 0 {
		var val bool
		if err := common.Unmarshal(req.ParallelToolCalls, &val); err == nil {
			parallelToolCalls = &val
		}
	}

	out := &dto.GeneralOpenAIRequest{
		Model:               req.Model,
		Messages:            messages,
		Stream:              req.Stream,
		StreamOptions:       req.StreamOptions,
		MaxTokens:           maxTokens,
		MaxCompletionTokens: maxTokens,
		ReasoningEffort:     reasoningEffort,
		Temperature:         req.Temperature,
		TopP:                req.TopP,
		Tools:               tools,
		ToolChoice:          toolChoice,
		ResponseFormat:      responseFormat,
		User:                req.User,
		ParallelTooCalls:    parallelToolCalls,
		Store:               req.Store,
		Metadata:            req.Metadata,
	}

	return out, nil
}

func mapResponsesInputToChatMessages(inputRaw []byte) []dto.Message {
	if len(inputRaw) == 0 {
		return nil
	}

	// First try to parse as simple string
	var strInput string
	if err := common.Unmarshal(inputRaw, &strInput); err == nil {
		return []dto.Message{
			{
				Role:    "user",
				Content: strInput,
			},
		}
	}

	// Try to parse as array of maps
	var rawItems []map[string]any
	if err := common.Unmarshal(inputRaw, &rawItems); err == nil {
		var messages []dto.Message
		for _, rawItem := range rawItems {
			role, _ := rawItem["role"].(string)
			if role == "" {
				// If no role, default to user
				role = "user"
			}

			contentVal := rawItem["content"]
			if contentVal == nil {
				continue
			}

			var convertedContent any
			switch cv := contentVal.(type) {
			case string:
				convertedContent = cv
			case []any:
				var parts []map[string]any
				for _, partAny := range cv {
					partMap, ok := partAny.(map[string]any)
					if !ok {
						continue
					}
					t, _ := partMap["type"].(string)
					switch t {
					case "input_text", "output_text":
						text, _ := partMap["text"].(string)
						parts = append(parts, map[string]any{
							"type": "text",
							"text": text,
						})
					case "input_image":
						var imageUrl string
						switch imgVal := partMap["image_url"].(type) {
						case string:
							imageUrl = imgVal
						case map[string]any:
							imageUrl, _ = imgVal["url"].(string)
						}
						parts = append(parts, map[string]any{
							"type": "image_url",
							"image_url": map[string]any{
								"url": imageUrl,
							},
						})
					default:
						// Pass other types through as-is
						parts = append(parts, partMap)
					}
				}
				convertedContent = parts
			default:
				convertedContent = cv
			}

			messages = append(messages, dto.Message{
				Role:    role,
				Content: convertedContent,
			})
		}
		return messages
	}

	return nil
}

func ChatCompletionsResponseToResponsesResponse(chatResp *dto.OpenAITextResponse) (*dto.OpenAIResponsesResponse, error) {
	if chatResp == nil {
		return nil, errors.New("chatResp is nil")
	}

	var createdVal int
	switch c := chatResp.Created.(type) {
	case int:
		createdVal = c
	case int64:
		createdVal = int(c)
	case float64:
		createdVal = int(c)
	}

	var outputs []dto.ResponsesOutput
	if len(chatResp.Choices) > 0 {
		choice := chatResp.Choices[0]

		// 1. Text content
		text := choice.Message.StringContent()
		if text != "" {
			outputs = append(outputs, dto.ResponsesOutput{
				Type:   "message",
				ID:     "msg_" + chatResp.Id,
				Status: "completed",
				Role:   "assistant",
				Content: []dto.ResponsesOutputContent{
					{
						Type: "output_text",
						Text: text,
					},
				},
			})
		}

		// 2. Tool calls
		toolCalls := choice.Message.ParseToolCalls()
		for i, tc := range toolCalls {
			tcId := tc.ID
			if tcId == "" {
				tcId = fmt.Sprintf("call_%s_%d", chatResp.Id, i)
			}
			tcArgs, _ := common.Marshal(tc.Function.Arguments)
			outputs = append(outputs, dto.ResponsesOutput{
				Type:      "function_call",
				ID:        tcId,
				Status:    "completed",
				CallId:    tcId,
				Name:      tc.Function.Name,
				Arguments: tcArgs,
			})
		}
	}

	usage := &dto.Usage{
		InputTokens:  chatResp.Usage.PromptTokens,
		OutputTokens: chatResp.Usage.CompletionTokens,
		TotalTokens:  chatResp.Usage.TotalTokens,
	}

	resp := &dto.OpenAIResponsesResponse{
		ID:        chatResp.Id,
		Object:    "response",
		CreatedAt: createdVal,
		Status:    []byte(`"completed"`),
		Model:     chatResp.Model,
		Output:    outputs,
		Usage:     usage,
	}

	return resp, nil
}

