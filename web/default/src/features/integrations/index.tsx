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
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Terminal,
  Check,
  Copy,
  Eye,
  EyeOff,
  Settings2,
  ChevronDown,
  Info,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Badge } from '@/components/ui/badge'
import { getUserModels } from '@/lib/api'
import { getApiKeys, fetchTokenKey } from '@/features/keys/api'
import type { ApiKey } from '@/features/keys/types'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface ModelSlot {
  key: string // param name: haiku | sonnet | opus | model | subagentModel
  label: string // UI label
  default: string // default model ID
}

interface GuideStep {
  title: string
  desc?: string
  code?: string
  lang?: string
  copyable?: boolean
}

interface CliTool {
  id: string
  name: string
  logo: string
  desc: string
  configType: 'auto' | 'guide'
  installCmd?: string
  modelSlots?: ModelSlot[] // auto tools: model slots
  guideSteps?: GuideStep[] // guide tools
  docsUrl?: string
}

// ─────────────────────────────────────────────────────────
// Tool Definitions
// ─────────────────────────────────────────────────────────

const CLI_TOOLS: CliTool[] = [
  {
    id: 'claude',
    name: 'Claude Code',
    logo: '/providers/claude.png',
    desc: 'CLI Agent dòng lệnh cực mạnh từ Anthropic, có thể đọc hiểu và sửa đổi toàn bộ project của bạn.',
    configType: 'auto',
    installCmd: 'npm install -g @anthropic-ai/claude-code',
    modelSlots: [
      { key: 'haiku', label: 'Claude Haiku', default: 'claude-haiku-4-5' },
      { key: 'sonnet', label: 'Claude Sonnet', default: 'claude-sonnet-4-5' },
      { key: 'opus', label: 'Claude Opus', default: 'claude-opus-4-5' },
    ],
  },
  {
    id: 'codex',
    name: 'OpenAI Codex CLI',
    logo: '/providers/codex.png',
    desc: 'CLI Agent tinh gọn, hiệu năng cao trên nền tảng OpenAI Responses API với hỗ trợ subagent.',
    configType: 'auto',
    installCmd: 'npm install -g @openai/codex',
    modelSlots: [
      { key: 'model', label: 'Model chính', default: 'openai/gpt-4o' },
      { key: 'subagentModel', label: 'Subagent Model', default: '' },
    ],
  },
  {
    id: 'cline',
    name: 'Cline',
    logo: '/providers/cline.png',
    desc: 'AI Coding Agent đa năng chạy trong VS Code, tự động thực hiện các thay đổi mã nguồn phức tạp.',
    configType: 'auto',
    modelSlots: [{ key: 'model', label: 'Model', default: 'openai/gpt-4o' }],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    logo: '/providers/opencode.png',
    desc: 'AI Terminal Assistant mã nguồn mở hiện đại, tích hợp trực tiếp vào terminal workflow của bạn.',
    configType: 'auto',
    installCmd: 'npm install -g opencode-ai',
    modelSlots: [{ key: 'model', label: 'Model', default: 'openai/gpt-4o' }],
  },
  {
    id: 'openclaw',
    name: 'Open Claw',
    logo: '/providers/openclaw.png',
    desc: 'AI Coding Assistant mã nguồn mở, tương thích hoàn toàn với giao thức OpenAI.',
    configType: 'auto',
    modelSlots: [{ key: 'model', label: 'Model', default: 'openai/gpt-4o' }],
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    logo: '/providers/hermes.png',
    desc: 'AI Agent tự cải thiện từ Nous Research, sở hữu khả năng tự sửa lỗi và tối ưu logic.',
    configType: 'auto',
    installCmd: 'curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash',
    modelSlots: [{ key: 'model', label: 'Model', default: 'openai/gpt-4o' }],
  },
  {
    id: 'kilo',
    name: 'Kilo Code',
    logo: '/providers/kilocode.png',
    desc: 'AI Coding Agent fork từ Cline với nhiều tính năng nâng cao về semantic memory và multi-agent.',
    configType: 'auto',
    modelSlots: [{ key: 'model', label: 'Model', default: 'openai/gpt-4o' }],
  },
  {
    id: 'droid',
    name: 'Factory Droid',
    logo: '/providers/droid.png',
    desc: 'AI Assistant từ Factory.ai, tối ưu hóa cho các tác vụ coding automation.',
    configType: 'auto',
    modelSlots: [{ key: 'model', label: 'Model', default: 'openai/gpt-4o' }],
  },
  {
    id: 'deepseek-tui',
    name: 'DeepSeek TUI',
    logo: '/providers/deepseek-tui.png',
    desc: 'Terminal Coding Agent viết bằng Rust, hiệu năng cực cao với kích thước binary siêu nhỏ.',
    configType: 'auto',
    modelSlots: [{ key: 'model', label: 'Model', default: 'deepseek/deepseek-chat' }],
  },
  {
    id: 'jcode',
    name: 'jcode',
    logo: '/providers/jcode.png',
    desc: 'Rust-based Coding Agent với semantic memory, multi-agent swarms và boot time 14ms.',
    configType: 'auto',
    installCmd: 'curl -fsSL https://raw.githubusercontent.com/1jehuang/jcode/master/scripts/install.sh | bash',
    modelSlots: [{ key: 'model', label: 'Model', default: 'openai/gpt-4o' }],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: '/providers/cursor.png',
    desc: 'IDE fork từ VS Code tích hợp AI mạnh mẽ. Yêu cầu Cursor Pro để sử dụng OpenAI-compatible endpoint.',
    configType: 'guide',
    docsUrl: 'https://cursor.com',
    guideSteps: [
      { title: 'Bước 1: Mở Settings', desc: 'Nhấn Ctrl+Shift+J (⌘+Shift+J trên macOS) → chọn Models ở sidebar trái.' },
      { title: 'Bước 2: Kích hoạt OpenAI API', desc: 'Bật "OpenAI API key" → Nhấn "Override Base URL".' },
      { title: 'Bước 3: Nhập Base URL', code: '{{baseUrl}}', copyable: true },
      { title: 'Bước 4: Nhập API Key', code: '{{apiKey}}', copyable: true },
      { title: 'Bước 5: Thêm Custom Model', desc: 'Cuộn xuống "Custom Models" → "+ Add Custom Model" → nhập tên model.' },
    ],
  },
  {
    id: 'continue',
    name: 'Continue',
    logo: '/providers/continue.png',
    desc: 'Extension AI mã nguồn mở chất lượng cao cho VS Code và JetBrains, hỗ trợ nhiều nhà cung cấp.',
    configType: 'guide',
    docsUrl: 'https://continue.dev',
    guideSteps: [
      { title: 'Mở tệp cấu hình', desc: 'Bấm biểu tượng bánh răng trong panel Continue → mở ~/.continue/config.json' },
      {
        title: 'Thêm model vào mảng "models"',
        code: JSON.stringify({ title: '{{model}} (new-api)', model: '{{model}}', apiBase: '{{baseUrl}}', provider: 'openai', apiKey: '{{apiKey}}' }, null, 2),
        lang: 'json',
      },
    ],
  },
  {
    id: 'roo',
    name: 'Roo Code',
    logo: '/providers/roo.png',
    desc: 'AI Coding Agent (fork từ Cline), tối ưu khả năng đọc hiểu cấu trúc file và context lớn.',
    configType: 'guide',
    guideSteps: [
      { title: 'Bước 1: Mở bảng cấu hình', desc: 'Bấm Roo Code ở sidebar → nút cài đặt → tại API Provider chọn "OpenAI Compatible".' },
      { title: 'Bước 2: Nhập Base URL', code: '{{baseUrl}}', copyable: true },
      { title: 'Bước 3: Nhập API Key', code: '{{apiKey}}', copyable: true },
      { title: 'Bước 4: Nhập Model ID', code: '{{model}}', copyable: true },
    ],
  },
  {
    id: 'amp',
    name: 'Amp CLI',
    logo: '/providers/amp.png',
    desc: 'Coding assistant CLI từ Sourcegraph với hỗ trợ model shorthands và tích hợp workspace sâu.',
    configType: 'guide',
    docsUrl: 'https://ampcode.com',
    guideSteps: [
      { title: 'Cài đặt Amp', desc: 'Cài Amp CLI theo hướng dẫn tại trang chủ.' },
      {
        title: 'Khởi chạy với biến môi trường',
        code: 'export OPENAI_API_KEY="{{apiKey}}"\nexport OPENAI_BASE_URL="{{baseUrl}}"\namp --model "{{model}}"',
        lang: 'bash',
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────
// SetupCommandBox — sinh lệnh curl | bash / PowerShell
// ─────────────────────────────────────────────────────────

function SetupCommandBox({
  toolId,
  apiKey,
  baseUrl,
  modelParams,
}: {
  toolId: string
  apiKey: string
  baseUrl: string
  modelParams: Record<string, string>
}) {
  const [tab, setTab] = useState<'unix' | 'win'>('unix')
  const [copied, setCopied] = useState(false)

  const serverUrl = baseUrl.endsWith('/v1') ? baseUrl.slice(0, -3) : baseUrl

  const buildQuery = (extra: Record<string, string> = {}) => {
    const params = new URLSearchParams({
      tool: toolId,
      key: apiKey || 'your-api-key',
      serverUrl,
      ...modelParams,
      ...extra,
    })
    return params.toString()
  }

  const unixCmd = `curl -sL "${serverUrl}/api/v1/llm/setup?${buildQuery()}" | bash`
  const winCmd = `irm "${serverUrl}/api/v1/llm/setup?${buildQuery({ os: 'windows' })}" | iex`
  const activeCmd = tab === 'unix' ? unixCmd : winCmd

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCmd)
    setCopied(true)
    toast.success('Đã sao chép lệnh cài đặt!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Terminal className="size-3.5 text-primary" />
          Lệnh cài đặt tự động
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setTab('unix')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${tab === 'unix' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Linux/macOS
          </button>
          <button
            onClick={() => setTab('win')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${tab === 'win' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Windows
          </button>
        </div>
      </div>
      <div className="flex items-start gap-2 bg-background rounded border border-border px-3 py-2 font-mono text-[11px] text-foreground overflow-x-auto">
        <span className="text-primary shrink-0 select-none">$</span>
        <code className="whitespace-nowrap">{activeCmd}</code>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-[10px] text-muted-foreground">
          Chạy lệnh trên terminal cục bộ của bạn để cấu hình tự động.
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded border border-border bg-background hover:bg-muted transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
          {copied ? 'Đã copy!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// ManualConfigBox — hiển thị file config để copy thủ công
// ─────────────────────────────────────────────────────────

function ManualConfigBox({
  filename,
  content,
  lang = 'json',
}: {
  filename: string
  content: string
  lang?: string
}) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Đã sao chép nội dung file!')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <code className="text-[10px] text-muted-foreground font-mono">{filename}</code>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
        >
          {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
          {copied ? 'Đã copy' : 'Copy'}
        </button>
      </div>
      <pre className="bg-muted/50 border border-border rounded p-2 font-mono text-[10px] overflow-x-auto leading-relaxed whitespace-pre">
        {content}
      </pre>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// getManualConfigs — sinh nội dung file config thủ công
// ─────────────────────────────────────────────────────────

function getManualConfigs(
  toolId: string,
  apiKey: string,
  baseUrl: string,
  modelParams: Record<string, string>,
): { filename: string; content: string; lang?: string }[] {
  const baseUrlV1 = baseUrl.endsWith('/v1') ? baseUrl : `${baseUrl}/v1`
  const baseUrlNoV1 = baseUrl.endsWith('/v1') ? baseUrl.slice(0, -3) : baseUrl
  const key = apiKey || '<YOUR_API_KEY>'
  const model = modelParams.model || 'openai/gpt-4o'
  const haiku = modelParams.haiku || 'claude-haiku-4-5'
  const sonnet = modelParams.sonnet || 'claude-sonnet-4-5'
  const opus = modelParams.opus || 'claude-opus-4-5'
  const subagentModel = modelParams.subagentModel || model

  switch (toolId) {
    case 'claude':
      return [
        {
          filename: '~/.claude/settings.json',
          content: JSON.stringify(
            {
              hasCompletedOnboarding: true,
              env: {
                ANTHROPIC_BASE_URL: baseUrlV1,
                ANTHROPIC_AUTH_TOKEN: key,
                ANTHROPIC_DEFAULT_HAIKU_MODEL: haiku,
                ANTHROPIC_DEFAULT_SONNET_MODEL: sonnet,
                ANTHROPIC_DEFAULT_OPUS_MODEL: opus,
              },
            },
            null,
            2,
          ),
          lang: 'json',
        },
      ]
    case 'codex':
      return [
        {
          filename: '~/.codex/config.toml',
          content: `model = "${model}"\nmodel_provider = "new-api"\n\n[model_providers.new-api]\nname = "new-api"\nbase_url = "${baseUrlV1}"\nwire_api = "responses"\n\n[agents.subagent]\nmodel = "${subagentModel}"`,
          lang: 'toml',
        },
        {
          filename: '~/.codex/auth.json',
          content: JSON.stringify({ OPENAI_API_KEY: key, auth_mode: 'apikey' }, null, 2),
          lang: 'json',
        },
      ]
    case 'cline':
      return [
        {
          filename: '~/.cline/data/globalState.json',
          content: JSON.stringify(
            { actModeApiProvider: 'openai', planModeApiProvider: 'openai', openAiBaseUrl: baseUrlNoV1, openAiModelId: model, planModeOpenAiModelId: model },
            null,
            2,
          ),
          lang: 'json',
        },
        {
          filename: '~/.cline/data/secrets.json',
          content: JSON.stringify({ openAiApiKey: key }, null, 2),
          lang: 'json',
        },
      ]
    case 'opencode':
      return [
        {
          filename: '~/.config/opencode/opencode.json',
          content: JSON.stringify(
            { selected_provider: 'new-api', provider: { 'new-api': { npm: '@ai-sdk/openai-compatible', options: { baseURL: baseUrlV1, apiKey: key }, models: { [model]: {} } } }, agent: { subagent: { model: `new-api/${model}` } }, default_model: `new-api/${model}` },
            null,
            2,
          ),
          lang: 'json',
        },
      ]
    case 'openclaw':
      return [{ filename: '~/.openclaw/openclaw.json', content: JSON.stringify({ api_base: baseUrlV1, api_key: key, model }, null, 2), lang: 'json' }]
    case 'hermes':
      return [
        { filename: '~/.hermes/config.yaml', content: `model:\n  default: "${model}"\n  provider: "custom"\n  base_url: "${baseUrlV1}"`, lang: 'yaml' },
        { filename: '~/.hermes/.env', content: `OPENAI_API_KEY=${key}` },
      ]
    case 'kilo':
      return [{ filename: '~/.local/share/kilo/auth.json', content: JSON.stringify({ apiKey: key, endpoint: baseUrlV1 }, null, 2), lang: 'json' }]
    case 'droid':
      return [{ filename: '~/.factory/settings.json', content: JSON.stringify({ api_base: baseUrlV1, api_key: key, model }, null, 2), lang: 'json' }]
    case 'deepseek-tui':
      return [{ filename: '~/.deepseek/config.toml', content: `[model_providers.openai]\napi_key = "${key}"\nbase_url = "${baseUrlV1}"\nmodel = "${model}"`, lang: 'toml' }]
    case 'jcode':
      return [
        { filename: '~/.jcode/config.toml', content: `[model_providers.new-api]\napi_key = "${key}"\nbase_url = "${baseUrlV1}"`, lang: 'toml' },
        { filename: '~/.config/jcode/provider-new-api.env', content: `OPENAI_API_KEY=${key}\nOPENAI_API_BASE=${baseUrlV1}` },
      ]
    default:
      return []
  }
}

// ─────────────────────────────────────────────────────────
// ToolCard — mỗi công cụ là 1 accordion card
// ─────────────────────────────────────────────────────────

function interpolate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`)
}

function ToolCard({
  tool,
  globalKey,
  globalModel,
  baseUrl,
  models,
}: {
  tool: CliTool
  globalKey: string
  globalModel: string
  baseUrl: string
  models: string[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [modelParams, setModelParams] = useState<Record<string, string>>({})
  const [copiedStep, setCopiedStep] = useState<Record<number, boolean>>({})

  // Initialize model slots from globalModel
  useEffect(() => {
    if (!tool.modelSlots) return
    const init: Record<string, string> = {}
    for (const slot of tool.modelSlots) {
      init[slot.key] = slot.key === 'haiku' || slot.key === 'sonnet' || slot.key === 'opus' ? slot.default : globalModel || slot.default
    }
    setModelParams(init)
  }, [globalModel, tool.modelSlots])

  const setSlot = useCallback((key: string, val: string) => {
    setModelParams((prev) => ({ ...prev, [key]: val }))
  }, [])

  const templateVars: Record<string, string> = {
    baseUrl: baseUrl,
    apiKey: globalKey || '<YOUR_API_KEY>',
    model: modelParams.model || globalModel || 'your-model',
  }

  const handleCopyStep = (text: string, idx: number) => {
    navigator.clipboard.writeText(interpolate(text, templateVars))
    setCopiedStep((prev) => ({ ...prev, [idx]: true }))
    toast.success('Đã sao chép!')
    setTimeout(() => setCopiedStep((prev) => ({ ...prev, [idx]: false })), 2000)
  }

  const manualConfigs = tool.configType === 'auto' ? getManualConfigs(tool.id, globalKey, baseUrl, modelParams) : []

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/30 transition-all duration-200 shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 flex items-center justify-center shrink-0 rounded-lg bg-muted/50 border border-border/50">
            <img
              src={tool.logo}
              alt={tool.name}
              className="size-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  const t = document.createElement('span')
                  t.textContent = tool.name[0]
                  t.className = 'text-sm font-bold text-muted-foreground'
                  parent.appendChild(t)
                }
              }}
            />
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-semibold text-sm text-foreground">{tool.name}</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium">
                {tool.configType === 'auto' ? '⚡ Auto-setup' : '📖 Guide'}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{tool.desc}</p>
          </div>
        </div>
        <ChevronDown
          className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border/50 p-4 space-y-4">
          {/* Install hint */}
          {tool.installCmd && (
            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/40">
              <Info className="size-3.5 shrink-0 mt-0.5 text-primary" />
              <span>
                Cài đặt:{' '}
                <code className="font-mono bg-background px-1 rounded border border-border/60">{tool.installCmd}</code>
              </span>
            </div>
          )}

          {/* Auto-setup tool: model slots */}
          {tool.configType === 'auto' && tool.modelSlots && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Cấu hình Model</p>
              {tool.modelSlots.map((slot) => (
                <div key={slot.key} className="grid grid-cols-[7rem_1fr] items-center gap-2">
                  <span className="text-xs text-muted-foreground text-right pr-1">{slot.label}</span>
                  <div className="relative">
                    <NativeSelect
                      value={modelParams[slot.key] ?? ''}
                      onChange={(e) => setSlot(slot.key, e.target.value)}
                      className="w-full text-xs"
                    >
                      {slot.key === 'subagentModel' && (
                        <NativeSelectOption value="">— Giống model chính —</NativeSelectOption>
                      )}
                      {models.map((m) => (
                        <NativeSelectOption key={m} value={m}>{m}</NativeSelectOption>
                      ))}
                      {/* Allow custom input via text */}
                    </NativeSelect>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Auto-setup: SetupCommandBox */}
          {tool.configType === 'auto' && (
            <SetupCommandBox
              toolId={tool.id}
              apiKey={globalKey}
              baseUrl={baseUrl}
              modelParams={modelParams}
            />
          )}

          {/* Auto-setup: Manual config toggle */}
          {tool.configType === 'auto' && manualConfigs.length > 0 && (
            <div>
              <button
                onClick={() => setShowManual((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <BookOpen className="size-3" />
                {showManual ? 'Ẩn cấu hình thủ công' : 'Xem cấu hình thủ công (copy từng file)'}
                <ChevronDown className={`size-3 transition-transform ${showManual ? 'rotate-180' : ''}`} />
              </button>
              {showManual && (
                <div className="mt-3 space-y-3">
                  {manualConfigs.map((cfg) => (
                    <ManualConfigBox key={cfg.filename} filename={cfg.filename} content={cfg.content} lang={cfg.lang} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guide-only tool: steps */}
          {tool.configType === 'guide' && tool.guideSteps && (
            <div className="space-y-3">
              {tool.guideSteps.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">{step.title}</p>
                  {step.desc && <p className="text-[11px] text-muted-foreground">{step.desc}</p>}
                  {step.code && (
                    <div className="relative group">
                      <pre className="bg-muted/50 border border-border rounded-lg px-3 py-2 font-mono text-[10px] overflow-x-auto whitespace-pre leading-relaxed">
                        {interpolate(step.code, templateVars)}
                      </pre>
                      <button
                        onClick={() => handleCopyStep(step.code!, idx)}
                        className="absolute top-1.5 right-1.5 size-6 flex items-center justify-center rounded bg-background/80 border border-border/60 hover:bg-background transition-colors cursor-pointer"
                      >
                        {copiedStep[idx] ? <Check className="size-3 text-green-500" /> : <Copy className="size-3 text-muted-foreground" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Docs link */}
          {tool.docsUrl && (
            <a
              href={tool.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
              <ExternalLink className="size-3" />
              Tài liệu chính thức
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Integrations Component
// ─────────────────────────────────────────────────────────

export function Integrations() {
  const [tokens, setTokens] = useState<ApiKey[]>([])
  const [models, setModels] = useState<string[]>([])
  const [selectedTokenId, setSelectedTokenId] = useState<string>('')
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [baseUrl, setBaseUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showKey, setShowKey] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Initialize base URL from current domain
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.origin}/v1`)
    }
  }, [])

  // Fetch models for a given API key using /v1/models with Bearer auth
  const fetchModelsByKey = async (key: string): Promise<string[]> => {
    if (!key) return []
    try {
      const res = await fetch('/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      })
      if (!res.ok) return []
      const data = await res.json()
      // OpenAI-compatible: { data: [ { id: "..." }, ... ] }
      if (Array.isArray(data?.data)) {
        return data.data.map((m: { id: string }) => m.id).filter(Boolean)
      }
      return []
    } catch {
      return []
    }
  }

  // Load tokens then load models for first token's key
  useEffect(() => {
    async function initData() {
      setIsLoading(true)
      try {
        const tokensRes = await getApiKeys({ p: 1, size: 100 })

        if (tokensRes.success && tokensRes.data?.items) {
          const enabled = tokensRes.data.items.filter((t) => t.status === 1)
          setTokens(enabled)
          if (enabled.length > 0) {
            const first = enabled[0]
            setSelectedTokenId(String(first.id))
            const keyRes = await fetchTokenKey(first.id)
            const key = keyRes.success && keyRes.data?.key ? keyRes.data.key : first.key
            setSelectedKey(key)

            // Fetch models using this key
            const modelList = await fetchModelsByKey(key)
            setModels(modelList)
            if (modelList.length > 0) {
              const preferred = modelList.find(
                (m: string) =>
                  m.toLowerCase().includes('gpt-4o') ||
                  m.toLowerCase().includes('sonnet') ||
                  m.toLowerCase().includes('deepseek'),
              )
              setSelectedModel(preferred || modelList[0])
            }
          }
        }
      } catch {
        toast.error('Lỗi khi tải dữ liệu tài khoản')
      } finally {
        setIsLoading(false)
      }
    }
    initData()
  }, [])

  const handleTokenChange = async (tokenIdStr: string) => {
    setSelectedTokenId(tokenIdStr)
    const token = tokens.find((t) => t.id === Number(tokenIdStr))
    if (!token) return
    try {
      const keyRes = await fetchTokenKey(token.id)
      const key = keyRes.success && keyRes.data?.key ? keyRes.data.key : token.key
      setSelectedKey(key)

      // Reload model list for new key
      const modelList = await fetchModelsByKey(key)
      if (modelList.length > 0) {
        setModels(modelList)
        const preferred = modelList.find(
          (m: string) =>
            m.toLowerCase().includes('gpt-4o') ||
            m.toLowerCase().includes('sonnet') ||
            m.toLowerCase().includes('deepseek'),
        )
        setSelectedModel(preferred || modelList[0])
      }
    } catch {
      setSelectedKey(token.key)
    }
  }

  const baseUrlNoV1 = baseUrl.endsWith('/v1') ? baseUrl.slice(0, -3) : baseUrl

  const filteredTools = CLI_TOOLS.filter(
    (t) =>
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Terminal className="size-6 text-primary" />
          Tích Hợp Công Cụ AI
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Kết nối các IDE, CLI Agent và công cụ lập trình AI vào tài khoản của bạn. Chọn API Key & Model, nhấn copy lệnh cài đặt và chạy trên terminal.
        </p>
      </div>

      {/* Global Config Card */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2 font-semibold">
            <Settings2 className="size-4 text-primary" />
            Cấu Hình Kết Nối
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {isLoading ? (
            <div className="py-4 text-center text-sm text-muted-foreground animate-pulse">
              Đang tải thông tin tài khoản...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Token */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">1. API Key</label>
                {tokens.length === 0 ? (
                  <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                    <Info className="size-4 shrink-0" />
                    <span>
                      Chưa có API Key.{' '}
                      <a href="/keys" className="underline font-bold">
                        Tạo tại đây
                      </a>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <NativeSelect
                      value={selectedTokenId}
                      onChange={(e) => handleTokenChange(e.target.value)}
                      className="flex-1"
                    >
                      {tokens.map((t) => (
                        <NativeSelectOption key={t.id} value={String(t.id)}>
                          {t.name} ({t.key.slice(0, 10)}...)
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <Button variant="outline" size="icon" className="size-8 shrink-0" onClick={() => setShowKey(!showKey)}>
                      {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </Button>
                  </div>
                )}
                {selectedKey && (
                  <p className="text-[10px] text-muted-foreground truncate font-mono">
                    {showKey ? selectedKey : `${selectedKey.slice(0, 8)}${'*'.repeat(20)}`}
                  </p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">2. Model mặc định</label>
                {models.length === 0 ? (
                  <div className="text-xs text-amber-500 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    Chưa có model khả dụng
                  </div>
                ) : (
                  <NativeSelect value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full">
                    {models.map((m) => (
                      <NativeSelectOption key={m} value={m}>{m}</NativeSelectOption>
                    ))}
                  </NativeSelect>
                )}
              </div>

              {/* Base URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">3. Base URL</label>
                <Input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="h-8 text-xs font-mono"
                  placeholder="https://your-domain.com/v1"
                />
                <p className="text-[10px] text-muted-foreground">Tự động nhận diện từ domain hiện tại</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tool list */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground">Công Cụ Hỗ Trợ</h2>
          <Badge variant="secondary" className="text-xs">{CLI_TOOLS.length} tools</Badge>
          <div className="flex-1" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm công cụ..."
            className="h-8 w-48 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              globalKey={selectedKey}
              globalModel={selectedModel}
              baseUrl={baseUrlNoV1}
              models={models}
            />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Không tìm thấy công cụ nào phù hợp với "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}
