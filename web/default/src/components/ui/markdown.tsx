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
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { CodeBlock, CodeBlockCopyButton } from '@/components/ai-elements/code-block'

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        'prose prose-sm md:prose-base dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20',
        'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl',
        'prose-p:leading-relaxed prose-p:my-3',
        'prose-a:text-primary prose-a:font-semibold prose-a:underline-offset-4 hover:prose-a:underline',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none',
        'prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-blockquote:my-4',
        'prose-ul:my-3 prose-ol:my-3 prose-li:my-1.5',
        'prose-table:border prose-thead:bg-muted',
        'prose-td:border prose-th:border prose-td:px-4 prose-th:px-4 prose-td:py-2 prose-th:py-2',
        'prose-img:rounded-xl prose-img:shadow-md prose-img:my-6',
        '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        '[overflow-wrap:anywhere] break-words',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target='_blank' rel='noopener noreferrer' />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const codeContent = String(children).replace(/\n$/, '')
            
            if (!match && !codeContent.includes('\n')) {
              return (
                <code className={cn("bg-muted px-1.5 py-0.5 rounded font-mono text-sm border font-normal dark:border-border/30", className)} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <div className="my-4 not-prose">
                <CodeBlock 
                  code={codeContent} 
                  language={(match ? match[1] : 'text') as any} 
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              </div>
            )
          }
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
