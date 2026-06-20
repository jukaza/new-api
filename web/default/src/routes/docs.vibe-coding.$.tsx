import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Markdown } from '@/components/ui/markdown'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/docs/vibe-coding/$')({
  component: VibeCodingDocViewer,
})

function preprocessMarkdown(text: string) {
  // Strip YAML frontmatter
  let clean = text.replace(/^---[\s\S]*?---\s*/, '')
  
  // Strip Vitepress script setups
  clean = clean.replace(/<script setup>[\s\S]*?<\/script>/g, '')

  // Replace Vitepress custom containers with GitHub markdown alerts
  clean = clean
    .replace(/:::\s*warning([\s\S]*?):::/g, '\n> [!WARNING]$1\n')
    .replace(/:::\s*tip([\s\S]*?):::/g, '\n> [!TIP]$1\n')
    .replace(/:::\s*info([\s\S]*?):::/g, '\n> [!NOTE]$1\n')
    .replace(/:::\s*danger([\s\S]*?):::/g, '\n> [!CAUTION]$1\n')
    .replace(/:::\s*note([\s\S]*?):::/g, '\n> [!NOTE]$1\n')

  return clean
}

function VibeCodingDocViewer() {
  const { _splat } = Route.useParams()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const splat = _splat || 'index'
    const fetchDoc = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 1. Try loading from polished vibe-coding directory
        let docPath = `/docs/vibe-coding/${splat}.md`
        let response = await fetch(docPath)
        
        // 2. If 404, fallback to raw vibe-coding-raw directory
        if (!response.ok && response.status === 404) {
          docPath = `/docs/vibe-coding-raw/${splat}.md`
          response = await fetch(docPath)
        }

        // 3. Fallback for directory indices (e.g. stage-2/frontend/ui-design -> stage-2/frontend/ui-design/index)
        if (!response.ok && response.status === 404 && !splat.endsWith('/index') && !splat.endsWith('index')) {
          docPath = `/docs/vibe-coding/${splat}/index.md`
          response = await fetch(docPath)
          if (!response.ok && response.status === 404) {
            docPath = `/docs/vibe-coding-raw/${splat}/index.md`
            response = await fetch(docPath)
          }
        }
        
        if (!response.ok) {
          throw new Error('Bài học chưa được xuất bản hoặc không tồn tại.')
        }
        
        const text = await response.text()
        if (isMounted) {
          setContent(preprocessMarkdown(text))
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDoc()
    return () => { isMounted = false }
  }, [_splat])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-destructive mb-2">Không tìm thấy bài học</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Markdown>{content}</Markdown>
    </div>
  )
}
