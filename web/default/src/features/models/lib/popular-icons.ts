/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

export interface PopularIconOption {
  value: string
  label: string
  icon: string
}

export const POPULAR_ICONS: PopularIconOption[] = [
  { value: 'OpenAI', label: 'OpenAI', icon: 'OpenAI' },
  { value: 'OpenAI.Color', label: 'OpenAI (Color)', icon: 'OpenAI.Color' },
  { value: 'Claude.Color', label: 'Claude / Anthropic', icon: 'Claude.Color' },
  { value: 'Gemini.Color', label: 'Gemini / Google', icon: 'Gemini.Color' },
  { value: 'DeepSeek.Color', label: 'DeepSeek', icon: 'DeepSeek.Color' },
  { value: 'Minimax.Color', label: 'MiniMax', icon: 'Minimax.Color' },
  { value: 'Qwen.Color', label: 'Qwen / Alibaba', icon: 'Qwen.Color' },
  { value: 'Zhipu.Color', label: 'GLM / Zhipu', icon: 'Zhipu.Color' },
  { value: 'Wenxin.Color', label: 'Ernie / Baidu', icon: 'Wenxin.Color' },
  { value: 'Spark.Color', label: 'Spark / Xunfei', icon: 'Spark.Color' },
  { value: 'Hunyuan.Color', label: 'Hunyuan / Tencent', icon: 'Hunyuan.Color' },
  { value: 'Yi.Color', label: 'Yi / 01.AI', icon: 'Yi.Color' },
  { value: 'Mistral.Color', label: 'Mistral', icon: 'Mistral.Color' },
  { value: 'XAI', label: 'Grok / xAI', icon: 'XAI' },
  { value: 'Ollama', label: 'Llama / Meta', icon: 'Ollama' },
  { value: 'Doubao.Color', label: 'Doubao / ByteDance', icon: 'Doubao.Color' },
  { value: 'Kling.Color', label: 'Kling / Kuaishou', icon: 'Kling.Color' },
  { value: 'Jimeng.Color', label: 'Jimeng / ByteDance', icon: 'Jimeng.Color' },
  { value: 'Vidu', label: 'Vidu', icon: 'Vidu' },
  { value: 'Cohere.Color', label: 'Cohere', icon: 'Cohere.Color' },
  { value: 'Cloudflare.Color', label: 'Cloudflare', icon: 'Cloudflare.Color' },
  { value: 'Ai360.Color', label: '360 AI', icon: 'Ai360.Color' },
  { value: 'Jina', label: 'Jina', icon: 'Jina' },
  { value: 'AzureAI', label: 'Azure / Microsoft', icon: 'AzureAI' },
]
