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
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PublicLayout } from '@/components/layout'
import { useStatus } from '@/hooks/use-status'

type SectionId =
  | 'overview'
  | 'chat'
  | 'completions'
  | 'embeddings'
  | 'models'
  | 'errors'

interface NavItem {
  id: SectionId
  label: string
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'chat', label: 'Chat Completions' },
  { id: 'completions', label: 'Text Completions' },
  { id: 'embeddings', label: 'Embeddings' },
  { id: 'models', label: 'Models List' },
  { id: 'errors', label: 'Xử lý lỗi' },
]

function MethodBadge({ method }: { method: 'POST' | 'GET' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide',
        method === 'POST'
          ? 'bg-blue-500/15 text-blue-500 dark:bg-blue-400/20 dark:text-blue-400'
          : 'bg-green-500/15 text-green-600 dark:bg-green-400/20 dark:text-green-400'
      )}
    >
      {method}
    </span>
  )
}

function EndpointHeader({
  method,
  path,
  title,
  description,
}: {
  method: 'POST' | 'GET'
  path: string
  title: string
  description: string
}) {
  return (
    <div className='mb-6'>
      <h2 className='text-foreground mb-2 text-xl font-bold'>{title}</h2>
      <div className='bg-muted border-border flex items-center gap-3 rounded-lg border px-4 py-2.5'>
        <MethodBadge method={method} />
        <code className='text-foreground/90 font-mono text-sm'>{path}</code>
      </div>
      <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
        {description}
      </p>
    </div>
  )
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className='border-border bg-muted/40 dark:bg-muted/20 group relative my-4 overflow-hidden rounded-xl border'>
      <div className='border-border/60 bg-muted/60 flex items-center justify-between border-b px-4 py-2'>
        <span className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
          {lang}
        </span>
        <button
          onClick={copy}
          className='text-muted-foreground hover:text-foreground cursor-pointer rounded px-2 py-1 text-xs transition-colors'
        >
          {copied ? '✓ Đã sao chép' : 'Sao chép'}
        </button>
      </div>
      <pre className='overflow-x-auto px-4 py-4 text-sm'>
        <code className='font-mono text-sm leading-relaxed'>{code}</code>
      </pre>
    </div>
  )
}

function ParamTable({
  rows,
}: {
  rows: {
    name: string
    type: string
    required: boolean
    desc: string
  }[]
}) {
  return (
    <div className='border-border my-4 overflow-x-auto rounded-xl border'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='bg-muted/60 border-border border-b'>
            <th className='text-muted-foreground px-4 py-3 text-left font-medium'>
              Tham số
            </th>
            <th className='text-muted-foreground px-4 py-3 text-left font-medium'>
              Kiểu
            </th>
            <th className='text-muted-foreground px-4 py-3 text-left font-medium'>
              Bắt buộc
            </th>
            <th className='text-muted-foreground px-4 py-3 text-left font-medium'>
              Mô tả
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className='border-border/50 hover:bg-muted/30 border-b last:border-0 transition-colors'
            >
              <td className='px-4 py-3'>
                <code className='bg-muted rounded px-1.5 py-0.5 font-mono text-xs'>
                  {row.name}
                </code>
              </td>
              <td className='text-muted-foreground px-4 py-3 font-mono text-xs'>
                {row.type}
              </td>
              <td className='px-4 py-3'>
                {row.required ? (
                  <span className='inline-flex rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500 dark:text-red-400'>
                    Có
                  </span>
                ) : (
                  <span className='text-muted-foreground text-xs'>Không</span>
                )}
              </td>
              <td className='text-foreground/80 px-4 py-3 text-sm leading-relaxed'>
                {row.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusTable({
  rows,
}: {
  rows: { code: string; type: string; desc: string }[]
}) {
  const colorMap: Record<string, string> = {
    '200': 'text-green-500 bg-green-500/10',
    '400': 'text-yellow-500 bg-yellow-500/10',
    '401': 'text-orange-500 bg-orange-500/10',
    '402': 'text-orange-500 bg-orange-500/10',
    '403': 'text-red-500 bg-red-500/10',
    '404': 'text-red-500 bg-red-500/10',
    '429': 'text-purple-500 bg-purple-500/10',
    '500/502/503': 'text-red-600 bg-red-600/10',
  }
  return (
    <div className='border-border my-4 overflow-x-auto rounded-xl border'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='bg-muted/60 border-border border-b'>
            <th className='text-muted-foreground px-4 py-3 text-left font-medium'>
              Mã
            </th>
            <th className='text-muted-foreground px-4 py-3 text-left font-medium'>
              Tên lỗi
            </th>
            <th className='text-muted-foreground px-4 py-3 text-left font-medium'>
              Mô tả
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className='border-border/50 hover:bg-muted/30 border-b last:border-0 transition-colors'
            >
              <td className='px-4 py-3'>
                <span
                  className={cn(
                    'rounded px-2 py-0.5 font-mono text-xs font-bold',
                    colorMap[row.code] ?? 'text-muted-foreground bg-muted'
                  )}
                >
                  {row.code}
                </span>
              </td>
              <td className='text-foreground/70 px-4 py-3 text-xs'>{row.type}</td>
              <td className='text-foreground/80 px-4 py-3 text-sm'>
                {row.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='text-foreground mb-3 mt-6 text-base font-semibold'>
      {children}
    </h3>
  )
}

function InfoBox({
  type,
  children,
}: {
  type: 'tip' | 'info'
  children: React.ReactNode
}) {
  const styles =
    type === 'tip'
      ? 'border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300'
      : 'border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-300'
  const icon = type === 'tip' ? '💡' : 'ℹ️'
  return (
    <div className={cn('my-4 rounded-xl border px-4 py-3 text-sm leading-relaxed', styles)}>
      <span className='mr-2'>{icon}</span>
      {children}
    </div>
  )
}

export function Docs() {
  const { status } = useStatus()
  const [activeSection, setActiveSection] = useState<SectionId>('overview')

  const serverAddress =
    (status?.server_address as string | undefined) ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://newapi.jukaza.site')

  const systemName = (status?.system_name as string | undefined) || 'JukaShop'

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id)
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <PublicLayout>
      <div className='mx-auto flex max-w-6xl gap-8 px-4 py-8'>
        {/* Sidebar Navigation */}
        <aside className='hidden w-52 shrink-0 lg:block'>
          <div className='sticky top-24'>
            <p className='text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider'>
              Tài liệu API
            </p>
            <nav className='space-y-0.5'>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    activeSection === item.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className='min-w-0 flex-1 space-y-12'>
          {/* Section: Overview */}
          <section id='section-overview'>
            <div className='mb-6'>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400'>
                <span className='relative flex size-1.5'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75' />
                  <span className='relative inline-flex size-1.5 rounded-full bg-blue-500' />
                </span>
                API Documentation
              </div>
              <h1 className='text-foreground mb-2 text-3xl font-bold tracking-tight'>
                Tài liệu API {systemName}
              </h1>
              <p className='text-muted-foreground text-base leading-relaxed'>
                Tài liệu đầy đủ về các endpoint, định dạng yêu cầu/phản hồi và xử lý lỗi. API của chúng tôi hoàn toàn tương thích với chuẩn OpenAI.
              </p>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='border-border bg-card rounded-xl border p-4'>
                <p className='text-muted-foreground mb-1 text-xs font-medium uppercase'>Base URL</p>
                <code className='text-foreground font-mono text-sm break-all'>{serverAddress}/v1</code>
              </div>
              <div className='border-border bg-card rounded-xl border p-4'>
                <p className='text-muted-foreground mb-1 text-xs font-medium uppercase'>Authentication</p>
                <code className='text-foreground font-mono text-sm'>Bearer sk-your-api-key</code>
              </div>
            </div>

            <SectionTitle>Xác thực (Authentication)</SectionTitle>
            <p className='text-muted-foreground text-sm'>Mọi yêu cầu cần có header xác thực:</p>
            <CodeBlock lang='http' code={`Authorization: Bearer sk-your-api-key\nContent-Type: application/json`} />
          </section>

          {/* Section: Chat Completions */}
          <section id='section-chat'>
            <EndpointHeader
              method='POST'
              path='/v1/chat/completions'
              title='Chat Completions'
              description='Endpoint chính để tương tác với các mô hình ngôn ngữ (LLM). Hoàn toàn tương thích với OpenAI Chat Completions API.'
            />

            <SectionTitle>Tham số yêu cầu (Request Body)</SectionTitle>
            <ParamTable
              rows={[
                { name: 'model', type: 'string', required: true, desc: 'ID của mô hình hoặc tên định danh muốn sử dụng (ví dụ: gpt-4o, claude-3-5-sonnet).' },
                { name: 'messages', type: 'array', required: true, desc: 'Danh sách lịch sử cuộc hội thoại dưới dạng các đối tượng { role, content }.' },
                { name: 'stream', type: 'boolean', required: false, desc: 'Bật phản hồi dạng dòng (streaming) theo giao thức SSE. Mặc định: false.' },
                { name: 'max_tokens', type: 'integer', required: false, desc: 'Số lượng token tối đa trong phản hồi.' },
                { name: 'temperature', type: 'number', required: false, desc: 'Độ sáng tạo/ngẫu nhiên của phản hồi (0.0 đến 2.0, mặc định: 1.0).' },
                { name: 'top_p', type: 'number', required: false, desc: 'Nucleus sampling (0.0 đến 1.0).' },
                { name: 'stop', type: 'string | array', required: false, desc: 'Chuỗi dừng — mô hình sẽ ngừng sinh văn bản khi gặp ký tự này.' },
              ]}
            />

            <SectionTitle>Roles trong Messages</SectionTitle>
            <div className='border-border bg-card my-4 rounded-xl border overflow-hidden'>
              {[
                { role: 'system', desc: 'Thiết lập hành vi và bối cảnh cho mô hình (system prompt).' },
                { role: 'user', desc: 'Tin nhắn hoặc câu hỏi từ người dùng.' },
                { role: 'assistant', desc: 'Phản hồi của AI (dùng trong ví dụ few-shot).' },
              ].map((r, i) => (
                <div key={i} className={cn('flex gap-4 px-4 py-3', i > 0 && 'border-t border-border/50')}>
                  <code className='bg-muted text-primary mt-0.5 shrink-0 rounded px-2 py-0.5 font-mono text-xs h-fit'>{r.role}</code>
                  <p className='text-muted-foreground text-sm'>{r.desc}</p>
                </div>
              ))}
            </div>

            <SectionTitle>Ví dụ Request</SectionTitle>
            <CodeBlock lang='json' code={`{
  "model": "gpt-4o",
  "messages": [
    { "role": "system", "content": "Bạn là trợ lý AI hữu ích." },
    { "role": "user", "content": "Giải thích machine learning bằng ngôn ngữ đơn giản." }
  ],
  "max_tokens": 1024,
  "temperature": 0.7,
  "stream": false
}`} />

            <SectionTitle>Response (Non-streaming)</SectionTitle>
            <CodeBlock lang='json' code={`{
  "id": "chatcmpl-xxxxxxxxxxxx",
  "object": "chat.completion",
  "created": 1700000000,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "Machine learning (ML) là..." },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 25, "completion_tokens": 150, "total_tokens": 175 }
}`} />

            <SectionTitle>Response (Streaming — SSE)</SectionTitle>
            <CodeBlock lang='text' code={`data: {"id":"chatcmpl-xxx","choices":[{"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"Machine"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":" learning"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{},"finish_reason":"stop"}]}

data: [DONE]`} />
          </section>

          {/* Section: Text Completions */}
          <section id='section-completions'>
            <EndpointHeader
              method='POST'
              path='/v1/completions'
              title='Text Completions (Legacy)'
              description='Dùng cho việc hoàn thành văn bản đơn giản mà không cần lịch sử tin nhắn.'
            />
            <CodeBlock lang='json' code={`{
  "model": "gpt-4o",
  "prompt": "Viết một hàm Python để tính fibonacci:",
  "max_tokens": 256,
  "temperature": 0.5
}`} />
            <InfoBox type='tip'>
              Khuyến nghị: Với các ứng dụng mới, ưu tiên sử dụng <code className='bg-muted rounded px-1 py-0.5 font-mono text-xs'>/chat/completions</code> để đạt hiệu năng và tính linh hoạt tốt nhất.
            </InfoBox>
          </section>

          {/* Section: Embeddings */}
          <section id='section-embeddings'>
            <EndpointHeader
              method='POST'
              path='/v1/embeddings'
              title='Embeddings'
              description='Chuyển đổi văn bản thành vector embedding để phục vụ tìm kiếm ngữ nghĩa (semantic search), hệ thống RAG, phân cụm hoặc phân loại văn bản.'
            />
            <SectionTitle>Ví dụ Request</SectionTitle>
            <CodeBlock lang='json' code={`{
  "model": "text-embedding-3-small",
  "input": "Đây là văn bản cần chuyển thành vector embedding",
  "encoding_format": "float"
}`} />
            <SectionTitle>Ví dụ Response</SectionTitle>
            <CodeBlock lang='json' code={`{
  "object": "list",
  "data": [{ "object": "embedding", "embedding": [0.0023, -0.0094, ...], "index": 0 }],
  "model": "text-embedding-3-small",
  "usage": { "prompt_tokens": 12, "total_tokens": 12 }
}`} />
            <SectionTitle>Tích hợp Python (OpenAI SDK)</SectionTitle>
            <CodeBlock lang='python' code={`from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="${serverAddress}/v1"
)

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Văn bản cần embedding"
)
print(f"Dimension: {len(response.data[0].embedding)}")`} />
          </section>

          {/* Section: Models */}
          <section id='section-models'>
            <EndpointHeader
              method='GET'
              path='/v1/models'
              title='Models List'
              description='Lấy danh sách tất cả các mô hình đang khả dụng và được cấp quyền với API key của bạn.'
            />
            <SectionTitle>Ví dụ Request</SectionTitle>
            <CodeBlock lang='bash' code={`curl ${serverAddress}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"`} />
            <SectionTitle>Ví dụ Response</SectionTitle>
            <CodeBlock lang='json' code={`{
  "object": "list",
  "data": [
    { "id": "gpt-4o", "object": "model", "created": 1700000000, "owned_by": "provider-name" },
    { "id": "claude-sonnet-4-20250514", "object": "model", "created": 1700000000, "owned_by": "provider-name" }
  ]
}`} />
          </section>

          {/* Section: Error Handling */}
          <section id='section-errors'>
            <div className='mb-6'>
              <h2 className='text-foreground mb-2 text-xl font-bold'>Xử lý lỗi (Error Handling)</h2>
              <p className='text-muted-foreground text-sm'>
                Khi xảy ra lỗi, API sẽ trả về JSON với thông tin chi tiết.
              </p>
            </div>

            <CodeBlock lang='json' code={`{
  "error": {
    "message": "Mô tả lỗi chi tiết",
    "type": "invalid_request_error",
    "code": "model_not_found"
  }
}`} />

            <SectionTitle>Mã trạng thái HTTP</SectionTitle>
            <StatusTable
              rows={[
                { code: '200', type: 'OK', desc: 'Request thành công.' },
                { code: '400', type: 'Bad Request', desc: 'Request không hợp lệ (lỗi định dạng JSON, tham số sai).' },
                { code: '401', type: 'Unauthorized', desc: 'API key không chính xác, hết hạn hoặc bị thiếu.' },
                { code: '402', type: 'Payment Required', desc: 'Tài khoản không đủ số dư hạn ngạch (quota) để thực hiện yêu cầu.' },
                { code: '403', type: 'Forbidden', desc: 'Không có quyền truy cập mô hình này.' },
                { code: '404', type: 'Not Found', desc: 'Mô hình được chọn không tồn tại hoặc không khả dụng.' },
                { code: '429', type: 'Rate Limited', desc: 'Vượt quá số lượng yêu cầu tối đa cho phép (Rate limit exceeded).' },
                { code: '500/502/503', type: 'Server Error', desc: 'Lỗi từ hệ thống máy chủ hoặc nhà cung cấp thượng nguồn.' },
              ]}
            />

            <SectionTitle>Chiến lược Thử lại (Retry)</SectionTitle>
            <CodeBlock lang='python' code={`import time
from openai import OpenAI, APIError, RateLimitError

client = OpenAI(api_key="sk-your-api-key", base_url="${serverAddress}/v1")

def chat_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(model="gpt-4o", messages=messages)
        except RateLimitError:
            wait = 2 ** attempt  # 1s, 2s, 4s
            print(f"Rate limited. Thử lại sau {wait}s...")
            time.sleep(wait)
        except APIError as e:
            if e.status_code >= 500:
                wait = 2 ** attempt
                print(f"Lỗi server. Thử lại sau {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise Exception("Vượt quá số lần thử lại tối đa")`} />
          </section>
        </main>
      </div>
    </PublicLayout>
  )
}
