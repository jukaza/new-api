import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Markdown } from '@/components/ui/markdown'
import { cn } from '@/lib/utils'
import { vibeCodingSections } from '@/features/docs/config/vibe-coding-nav'

export const Route = createFileRoute('/docs/vibe-coding/$')({
  component: VibeCodingDocViewer,
})

function findBreadcrumb(slug: string) {
  for (const section of vibeCodingSections) {
    for (const group of section.groups) {
      for (const item of group.items) {
        if (item.slug === slug) {
          // Rút gọn section name
          const secShort = section.sectionTitle.split(':')[0]
          return {
            section: secShort,
            group: group.groupTitle,
            title: item.title
          }
        }
      }
    }
  }
  return null
}

function DocSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse mt-4">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 items-center opacity-60">
        <div className="h-3 w-16 bg-muted rounded"></div>
        <div className="h-2 w-2 bg-muted rounded-full"></div>
        <div className="h-3 w-24 bg-muted rounded"></div>
        <div className="h-2 w-2 bg-muted rounded-full"></div>
        <div className="h-3 w-32 bg-muted rounded"></div>
      </div>
      
      {/* Title skeleton */}
      <div className="h-9 w-3/4 bg-muted rounded-lg my-4"></div>
      
      {/* Paragraph skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
      </div>
      
      {/* Codeblock skeleton */}
      <div className="h-40 w-full bg-muted/50 rounded-xl my-6"></div>
      
      {/* Paragraph 2 skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-4/5 bg-muted rounded"></div>
      </div>
    </div>
  )
}

function preprocessMarkdown(text: string) {
  // Strip YAML frontmatter
  let clean = text.replace(/^---[\s\S]*?---\s*/, '')
  
  // Strip Vitepress script setups
  clean = clean.replace(/<script setup>[\s\S]*?<\/script>/g, '')

  // Replace Vitepress custom containers with custom styled HTML blocks
  clean = clean
    .replace(/:::\s*tip\s+([^\n]+)?\n([\s\S]*?):::/g, (_, title, content) => {
      const displayTitle = title ? title.trim() : 'Mẹo'
      return `<div class="custom-block tip"><span class="custom-block-title">${displayTitle}</span>\n\n${content}\n\n</div>`
    })
    .replace(/:::\s*warning\s+([^\n]+)?\n([\s\S]*?):::/g, (_, title, content) => {
      const displayTitle = title ? title.trim() : 'Cảnh báo'
      return `<div class="custom-block warning"><span class="custom-block-title">${displayTitle}</span>\n\n${content}\n\n</div>`
    })
    .replace(/:::\s*danger\s+([^\n]+)?\n([\s\S]*?):::/g, (_, title, content) => {
      const displayTitle = title ? title.trim() : 'Nguy hiểm'
      return `<div class="custom-block danger"><span class="custom-block-title">${displayTitle}</span>\n\n${content}\n\n</div>`
    })
    .replace(/:::\s*info\s+([^\n]+)?\n([\s\S]*?):::/g, (_, title, content) => {
      const displayTitle = title ? title.trim() : 'Thông tin'
      return `<div class="custom-block info"><span class="custom-block-title">${displayTitle}</span>\n\n${content}\n\n</div>`
    })
    .replace(/:::\s*note\s+([^\n]+)?\n([\s\S]*?):::/g, (_, title, content) => {
      const displayTitle = title ? title.trim() : 'Lưu ý'
      return `<div class="custom-block note"><span class="custom-block-title">${displayTitle}</span>\n\n${content}\n\n</div>`
    })
    // Support default single line tag matches just in case
    .replace(/:::\s*tip([\s\S]*?):::/g, '<div class="custom-block tip"><span class="custom-block-title">Mẹo</span>\n\n$1\n\n</div>')
    .replace(/:::\s*warning([\s\S]*?):::/g, '<div class="custom-block warning"><span class="custom-block-title">Cảnh báo</span>\n\n$1\n\n</div>')
    .replace(/:::\s*danger([\s\S]*?):::/g, '<div class="custom-block danger"><span class="custom-block-title">Nguy hiểm</span>\n\n$1\n\n</div>')
    .replace(/:::\s*info([\s\S]*?):::/g, '<div class="custom-block info"><span class="custom-block-title">Thông tin</span>\n\n$1\n\n</div>')
    .replace(/:::\s*note([\s\S]*?):::/g, '<div class="custom-block note"><span class="custom-block-title">Lưu ý</span>\n\n$1\n\n</div>')

  return clean
}

function VibeCodingDocViewer() {
  const { _splat } = Route.useParams()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])

  const splat = _splat || 'index'
  const breadcrumb = findBreadcrumb(splat)

  useEffect(() => {
    let isMounted = true
    const fetchDoc = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const isHtml = (t: string) => {
          const trimmed = t.trim()
          return trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<!--')
        }

        let text = ''
        let ok = false

        // 1. Try loading from polished vibe-coding directory
        let docPath = `/docs/vibe-coding/${splat}.md`
        let response = await fetch(docPath)
        
        if (response.ok) {
          text = await response.text()
          if (!isHtml(text)) {
            ok = true
          }
        }
        
        // 2. If not ok, fallback to raw vibe-coding-raw directory
        if (!ok) {
          docPath = `/docs/vibe-coding-raw/${splat}.md`
          response = await fetch(docPath)
          if (response.ok) {
            text = await response.text()
            if (!isHtml(text)) {
              ok = true
            }
          }
        }

        // 3. Fallback for directory indices (e.g. stage-2/frontend/ui-design -> stage-2/frontend/ui-design/index)
        if (!ok && !splat.endsWith('/index') && !splat.endsWith('index')) {
          docPath = `/docs/vibe-coding/${splat}/index.md`
          response = await fetch(docPath)
          if (response.ok) {
            text = await response.text()
            if (!isHtml(text)) {
              ok = true
            }
          }
          if (!ok) {
            docPath = `/docs/vibe-coding-raw/${splat}/index.md`
            response = await fetch(docPath)
            if (response.ok) {
              text = await response.text()
              if (!isHtml(text)) {
                ok = true
              }
            }
          }
        }
        
        if (!ok) {
          throw new Error('Bài học chưa được xuất bản hoặc không tồn tại.')
        }
        
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
  }, [splat])

  // Populate dynamic Table of Contents (TOC) based on DOM elements inside markdown-content
  useEffect(() => {
    if (!content || loading) return
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll('.markdown-content h2, .markdown-content h3')
      const items: typeof toc = []
      headings.forEach((heading) => {
        const text = heading.textContent || ''
        let id = heading.id
        if (!id) {
          id = text.toLowerCase()
            .replace(/[^a-z0-9\u00C0-\u1EF9\s-]/g, '')
            .replace(/\s+/g, '-')
          heading.id = id
        }
        items.push({
          id,
          text,
          level: heading.tagName === 'H2' ? 2 : 3
        })
      })
      setToc(items)
    }, 150)
    return () => clearTimeout(timer)
  }, [content, loading])

  if (loading) {
    return (
      <div className="relative w-full">
        {/* Glow effect in background */}
        <div className="absolute -top-12 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <DocSkeleton />
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
    <div className="relative w-full">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute -top-20 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none dark:opacity-40" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none dark:opacity-30" />

      {/* Breadcrumb Header */}
      {breadcrumb && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-6 font-medium bg-muted/30 px-3 py-1.5 rounded-lg border border-border/20 w-fit backdrop-blur-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <span>Vibe Coding</span>
          <span className="text-muted-foreground/40">/</span>
          <span>{breadcrumb.section}</span>
          <span className="text-muted-foreground/40">/</span>
          <span>{breadcrumb.group}</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px] md:max-w-xs">{breadcrumb.title}</span>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col xl:flex-row gap-10 items-start">
        <div className="markdown-content flex-1 min-w-0 w-full relative z-10">
          <Markdown>{content}</Markdown>
        </div>
        
        {/* Sticky Table of Contents sidebar */}
        {toc.length > 0 && (
          <aside className="hidden xl:block w-64 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin border-l pl-5 border-border/40 bg-background/30 backdrop-blur-xs py-1 rounded-r-lg z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 mb-3 px-1">
              Mục lục bài học
            </p>
            <nav className="space-y-1.5">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={cn(
                    "block rounded-md text-xs text-muted-foreground hover:text-foreground transition-all duration-150 py-0.5 px-1 hover:bg-muted/40",
                    item.level === 3 
                      ? "pl-4 border-l border-border/30 text-muted-foreground/75 hover:border-muted-foreground/50" 
                      : "font-medium"
                  )}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </div>
  )
}
