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
import { useTranslation } from 'react-i18next'
import { Markdown } from '@/components/ui/markdown'
import { PublicLayout } from '@/components/layout'
import { useStatus } from '@/hooks/use-status'
import { Skeleton } from '@/components/ui/skeleton'

export function Docs() {
  const { t } = useTranslation()
  const { status, loading } = useStatus()

  // Dynamic server address or fallback
  const serverAddress =
    (status?.server_address as string) ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://newapi.jukaza.site')

  const docsMarkdown = `# Tài liệu API JukaShop

Tài liệu đầy đủ về các endpoint, định dạng yêu cầu/phản hồi (request/response format) và xử lý lỗi (error handling).

## Base URL & Xác thực (Authentication)

### Base URL
Tất cả các yêu cầu API phải được gửi đến Base URL sau:
\`\`\`bash
${serverAddress}/v1
\`\`\`

### Xác thực (Authentication)
Dịch vụ sử dụng phương thức xác thực qua Bearer Token:
\`\`\`bash
Authorization: Bearer sk-your-api-key
\`\`\`

### Content-Type
Tất cả các yêu cầu POST yêu cầu Header:
\`\`\`bash
Content-Type: application/json
\`\`\`

---

## 1. Chat Completions
\`POST /v1/chat/completions\`

Endpoint chính để tương tác với các mô hình ngôn ngữ (LLM). Hoàn toàn tương thích với OpenAI Chat Completions API.

### Tham số yêu cầu (Request Body)
| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| \`model\` | string | **Có** | ID của mô hình hoặc tên định danh muốn sử dụng (ví dụ: \`gpt-4o\`, \`claude-3-5-sonnet\`). |
| \`messages\` | array | **Có** | Danh sách lịch sử cuộc hội thoại dưới dạng các đối tượng \`{ role, content }\`. |
| \`stream\` | boolean | Không | Bật phản hồi dạng dòng (streaming) theo giao thức SSE (Mặc định: \`false\`). |
| \`max_tokens\` | integer | Không | Số lượng token tối đa trong phản hồi. |
| \`temperature\` | number | Không | Độ sáng tạo/ngẫu nhiên của phản hồi (0.0 đến 2.0, mặc định: \`1.0\`). |
| \`top_p\` | number | Không | Lựa chọn nhân hạt (Nucleus sampling, 0.0 đến 1.0). |
| \`stop\` | string \\| array | Không | Chuỗi dừng - mô hình sẽ dừng sinh văn bản khi gặp các ký tự này. |

### Các vai trò (Roles) trong Messages
- \`system\`: Thiết lập hành vi, bối cảnh cho mô hình (system prompt).
- \`user\`: Tin nhắn hoặc yêu cầu của người dùng.
- \`assistant\`: Phản hồi của trợ lý AI (hữu ích khi muốn làm ví dụ few-shot).

### Ví dụ Request
\`\`\`json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": "Bạn là trợ lý AI hữu ích."
    },
    {
      "role": "user",
      "content": "Giải thích machine learning bằng ngôn ngữ đơn giản."
    }
  ],
  "max_tokens": 1024,
  "temperature": 0.7,
  "stream": false
}
\`\`\`

### Ví dụ Response (Non-streaming)
\`\`\`json
{
  "id": "chatcmpl-xxxxxxxxxxxx",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Machine learning (ML) là một nhánh..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
\`\`\`

### Ví dụ Response (Streaming)
\`\`\`text
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Machine"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" learning"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

---

## 2. Text Completions (Legacy)
\`POST /v1/completions\`

Dùng cho việc hoàn thành văn bản đơn giản mà không cần lịch sử tin nhắn. 

### Ví dụ Request
\`\`\`json
{
  "model": "gpt-4o",
  "prompt": "Viết một hàm Python để tính fibonacci:",
  "max_tokens": 256,
  "temperature": 0.5
}
\`\`\`
> [!TIP]
> Khuyến nghị: Với các ứng dụng mới, bạn nên ưu tiên sử dụng \`/chat/completions\` thay vì \`/completions\` để đạt hiệu năng và tính linh hoạt tốt nhất.

---

## 3. Embeddings
\`POST /v1/embeddings\`

Chuyển đổi văn bản thành vector embedding để phục vụ tìm kiếm ngữ nghĩa (semantic search), hệ thống RAG, phân cụm hoặc phân loại văn bản.

### Ví dụ Request
\`\`\`json
{
  "model": "text-embedding-3-small",
  "input": "ChiaseGPU là nền tảng chia sẻ GPU P2P",
  "encoding_format": "float"
}
\`\`\`

### Ví dụ Response
\`\`\`json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [0.0023, -0.0094, 0.0156, ...],
      "index": 0
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 12,
    "total_tokens": 12
  }
}
\`\`\`

### Ví dụ mã Python tích hợp Embeddings
\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="${serverAddress}/v1"
)

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="ChiaseGPU là nền tảng chia sẻ GPU P2P"
)

embedding = response.data[0].embedding
print(f"Dimension: {len(embedding)}")
print(f"First 5 values: {embedding[:5]}")
\`\`\`

---

## 4. Models List
\`GET /v1/models\`

Lấy danh sách tất cả các mô hình đang khả dụng và được cấp quyền với API key của bạn.

### Ví dụ Request (curl)
\`\`\`bash
curl ${serverAddress}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`

### Ví dụ Response
\`\`\`json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-4o",
      "object": "model",
      "created": 1700000000,
      "owned_by": "provider-name"
    },
    {
      "id": "claude-sonnet-4-20250514",
      "object": "model",
      "created": 1700000000,
      "owned_by": "provider-name"
    }
  ]
}
\`\`\`

---

## 5. Xử lý lỗi (Error Handling)

Khi xảy ra lỗi, API sẽ trả về phản hồi JSON với thông báo lỗi chi tiết:
\`\`\`json
{
  "error": {
    "message": "Mô tả lỗi chi tiết bằng tiếng Việt hoặc tiếng Anh",
    "type": "invalid_request_error",
    "code": "model_not_found"
  }
}
\`\`\`

### Các mã trạng thái HTTP (HTTP Status Codes)
| Mã lỗi | Kiểu lỗi | Mô tả chi tiết |
| :--- | :--- | :--- |
| **200** | OK | Request thành công. |
| **400** | Bad Request | Request không hợp lệ (lỗi định dạng JSON, tham số sai). |
| **401** | Unauthorized | Khóa API key không chính xác, hết hạn hoặc bị thiếu. |
| **402** | Payment Required | Tài khoản không đủ số dư hạn ngạch (quota) để thực hiện yêu cầu. |
| **403** | Forbidden | Bị từ chối truy cập do tài khoản không có quyền gọi mô hình này. |
| **404** | Not Found | Mô hình được chọn không tồn tại hoặc không khả dụng trên kênh. |
| **429** | Rate Limited | Vượt quá số lượng yêu cầu tối đa cho phép (Rate limit exceeded). |
| **500 / 502 / 503** | Server Error | Lỗi từ hệ thống máy chủ hoặc nhà cung cấp thượng nguồn gặp sự cố. |

### Chiến lược Thử lại (Retry Strategy) khuyên dùng
Khi gặp lỗi mạng hoặc lỗi mã 429/5xx, bạn nên áp dụng cơ chế thử lại trễ số mũ (exponential backoff) như ví dụ Python dưới đây:

\`\`\`python
import time
from openai import OpenAI, APIError, RateLimitError

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="${serverAddress}/v1"
)

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
        except RateLimitError:
            wait = 2 ** attempt  # 1s, 2s, 4s
            print(f"Rate limited. Thử lại sau {wait} giây...")
            time.sleep(wait)
        except APIError as e:
            if e.status_code >= 500:
                wait = 2 ** attempt
                print(f"Lỗi hệ thống. Thử lại sau {wait} giây...")
                time.sleep(wait)
            else:
                raise
    raise Exception("Vượt quá số lần thử lại tối đa")
\`\`\`
`

  if (loading) {
    return (
      <PublicLayout>
        <div className='mx-auto flex max-w-4xl flex-col gap-4 py-12'>
          <Skeleton className='h-8 w-[45%]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className='mx-auto max-w-5xl px-4 py-8'>
        <Markdown className='prose-neutral dark:prose-invert max-w-none'>
          {docsMarkdown}
        </Markdown>
      </div>
    </PublicLayout>
  )
}
