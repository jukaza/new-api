package setting

import (
	"encoding/json"

	"github.com/QuantumNous/new-api/common"
)

var Chats = []map[string]string{
	{
		"ChatGPT Next Web": "https://app.nextchat.dev/#/?settings={\"key\":\"{key}\",\"url\":\"{address}\"}",
	},
	{
		"Cherry Studio": "cherrystudio://providers/api-keys?v=1&data={cherryConfig}",
	},
	{
		"Lobe Chat": "https://chat-preview.lobehub.com/?settings={\"keyVaults\":{\"openai\":{\"apiKey\":\"{key}\",\"baseURL\":\"{address}/v1\"}}}",
	},
	{
		"OpenCat": "opencat://team/join?domain={address}&token={key}",
	},
	{
		"AMA Chat": "ama://set-api-key?server={address}&key={key}",
	},
	{
		"Fluent Read (Dịch thuật)": "fluentread",
	},
}

func UpdateChatsByJsonString(jsonString string) error {
	Chats = make([]map[string]string, 0)
	return json.Unmarshal([]byte(jsonString), &Chats)
}

func Chats2JsonString() string {
	jsonBytes, err := json.Marshal(Chats)
	if err != nil {
		common.SysLog("error marshalling chats: " + err.Error())
		return "[]"
	}
	return string(jsonBytes)
}
