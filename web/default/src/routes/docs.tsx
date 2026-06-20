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
import { createFileRoute, Outlet, Link, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PublicLayout } from '@/components/layout'
import { cn } from '@/lib/utils'
import { vibeCodingSections } from '@/features/docs/config/vibe-coding-nav'
import { ChevronDown, ChevronRight, BookOpen, Terminal, Sparkles, HelpCircle } from 'lucide-react'

export const Route = createFileRoute('/docs')({
  component: DocsLayout,
})

const apiNavItems = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'chat', label: 'Chat Completions' },
  { id: 'completions', label: 'Text Completions' },
  { id: 'embeddings', label: 'Embeddings' },
  { id: 'models', label: 'Models List' },
  { id: 'errors', label: 'Xử lý lỗi' },
]

function DocsLayout() {
  const location = useLocation()
  const isApiDocs = location.pathname === '/docs' || location.pathname === '/docs/'

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Auto-expand section containing active item
  useEffect(() => {
    // extract slug from path: e.g. "/docs/vibe-coding/stage-1/learning-map/index" -> "stage-1/learning-map/index"
    let currentSplat = location.pathname.replace(/^\/docs\/vibe-coding\//, '').replace(/\/$/, '')
    if (currentSplat && currentSplat !== '/docs' && currentSplat !== 'docs') {
      const activeSec = vibeCodingSections.find(sec =>
        sec.groups.some(grp => grp.items.some(item => item.slug === currentSplat))
      )
      if (activeSec) {
        setExpandedSections(prev => ({ ...prev, [activeSec.sectionTitle]: true }))
      }
    }
  }, [location.pathname])

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }))
  }

  // Helper to check if any item in a section is active
  const isSectionActive = (section: typeof vibeCodingSections[0]) => {
    const currentSplat = location.pathname.replace(/^\/docs\/vibe-coding\//, '').replace(/\/$/, '')
    return section.groups.some(grp => grp.items.some(item => item.slug === currentSplat))
  }

  const getSectionIcon = (title: string) => {
    if (title.includes('Giai đoạn 1')) return <BookOpen className='h-4 w-4 shrink-0 text-primary' />
    if (title.includes('Giai đoạn 2')) return <Terminal className='h-4 w-4 shrink-0 text-indigo-500' />
    if (title.includes('Giai đoạn 3')) return <Sparkles className='h-4 w-4 shrink-0 text-violet-500' />
    return <HelpCircle className='h-4 w-4 shrink-0 text-emerald-500' />
  }

  return (
    <PublicLayout>
      <div className='mx-auto flex max-w-7xl gap-8 px-4 py-8'>
        {/* Sidebar Navigation */}
        <aside className='hidden w-64 shrink-0 lg:block'>
          <div className='sticky top-24 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2 scrollbar-thin'>
            
            {/* API Docs Section */}
            <div className='border-b border-border/60 pb-4'>
              <Link to="/docs" className={cn(
                'mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors',
                isApiDocs
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}>
                <BookOpen className='h-4 w-4 text-primary' />
                Tài liệu API JukaShop
              </Link>
              {isApiDocs && (
                <nav className='space-y-0.5 border-l border-border ml-4 pl-3'>
                  {apiNavItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#section-${item.id}`}
                      className='block w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>

            {/* Vibe Coding Sections */}
            <div className='space-y-4'>
              <p className='text-muted-foreground px-2 text-xs font-bold uppercase tracking-wider'>
                Khóa học Vibe Coding
              </p>
              
              {vibeCodingSections.map((section) => {
                const isExpanded = !!expandedSections[section.sectionTitle]
                const active = isSectionActive(section)

                return (
                  <div key={section.sectionTitle} className='space-y-2'>
                    {/* Section Header Button */}
                    <button
                      onClick={() => toggleSection(section.sectionTitle)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-semibold transition-colors',
                        active
                          ? 'bg-muted/80 text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        {getSectionIcon(section.sectionTitle)}
                        <span className='line-clamp-1'>{section.sectionTitle}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className='h-3 w-3 shrink-0 text-muted-foreground' />
                      ) : (
                        <ChevronRight className='h-3 w-3 shrink-0 text-muted-foreground' />
                      )}
                    </button>

                    {/* Section Groups & Items */}
                    {isExpanded && (
                      <div className='ml-2 border-l border-border/80 pl-3 space-y-3 animate-in slide-in-from-top-1 duration-200'>
                        {section.groups.map((group) => (
                          <div key={group.groupTitle} className='space-y-1'>
                            <p className='text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest px-2 py-0.5'>
                              {group.groupTitle}
                            </p>
                            <nav className='space-y-0.5'>
                              {group.items.map((item) => {
                                const itemPath = `/docs/vibe-coding/${item.slug}`
                                const isActive = location.pathname === itemPath || location.pathname === `${itemPath}/`
                                return (
                                  <Link
                                    key={item.slug}
                                    to={`/docs/vibe-coding/$`}
                                    params={{ _splat: item.slug }}
                                    className={cn(
                                      'block w-full rounded-md px-2 py-1 text-left text-xs transition-colors',
                                      isActive
                                        ? 'bg-primary/15 text-primary font-medium'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                  >
                                    {item.title}
                                  </Link>
                                )
                              })}
                            </nav>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className='min-w-0 flex-1 space-y-12'>
          <Outlet />
        </main>
      </div>
    </PublicLayout>
  )
}
