package controller

/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
*/

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

// HandleCliSetup sinh script cấu hình CLI tự động (Bash hoặc PowerShell).
// GET /api/v1/llm/setup
// Params:
//
//	tool        — tên công cụ: claude, codex, cline, opencode, openclaw, hermes, kilo, droid, deepseek-tui, jcode
//	key         — API key của người dùng (bắt buộc, dùng để xác thực)
//	serverUrl   — base URL của server (ví dụ: https://your-domain.com), nếu trống thì tự nhận diện
//	os          — "windows" để trả về PowerShell, mặc định là Bash
//	model       — model ID mặc định
//	subagentModel — model cho subagent (Codex)
//	haiku, sonnet, opus — model mappings cho Claude Code
func HandleCliSetup(c *gin.Context) {
	key := c.Query("key")
	tool := c.Query("tool")
	osType := c.Query("os")

	// Tự nhận diện Windows từ User-Agent nếu không truyền os=windows
	if osType == "" {
		ua := strings.ToLower(c.Request.UserAgent())
		if strings.Contains(ua, "windows") || strings.Contains(ua, "powershell") ||
			strings.Contains(ua, "win64") || strings.Contains(ua, "win32") {
			osType = "windows"
		}
	}

	// Xác thực API key
	if key == "" {
		returnSetupErrorScript(c, osType, "API key là bắt buộc (?key=sk-xxx)")
		return
	}
	dbKey := strings.TrimPrefix(key, "sk-")
	_, err := model.ValidateUserToken(dbKey)
	if err != nil {
		returnSetupErrorScript(c, osType, "API key không hợp lệ hoặc đã hết hạn")
		return
	}

	fullKey := key
	if !strings.HasPrefix(fullKey, "sk-") {
		fullKey = "sk-" + fullKey
	}

	// Xác định Base URL
	serverUrl := c.Query("serverUrl")
	var baseUrl string
	if serverUrl != "" {
		baseUrl = strings.TrimSuffix(serverUrl, "/")
	} else {
		host := c.Request.Header.Get("X-Forwarded-Host")
		if host == "" {
			host = c.Request.Header.Get("X-Original-Host")
		}
		if host == "" {
			host = c.Request.Host
		}
		scheme := "http"
		if c.Request.TLS != nil || c.Request.Header.Get("X-Forwarded-Proto") == "https" {
			scheme = "https"
		}
		baseUrl = fmt.Sprintf("%s://%s", scheme, host)
	}
	baseUrlWithV1 := baseUrl + "/v1"
	baseUrlWithoutV1 := baseUrl

	// Đọc các tham số model
	mainModel := c.Query("model")
	subagentModel := c.Query("subagentModel")
	haiku := c.Query("haiku")
	sonnet := c.Query("sonnet")
	opus := c.Query("opus")

	// Default values
	if mainModel == "" {
		mainModel = "openai/gpt-4o"
	}
	if subagentModel == "" {
		subagentModel = mainModel
	}
	if haiku == "" {
		haiku = "claude-haiku-4-5"
	}
	if sonnet == "" {
		sonnet = "claude-sonnet-4-5"
	}
	if opus == "" {
		opus = "claude-opus-4-5"
	}

	isWin := strings.EqualFold(osType, "windows")
	var script string
	if isWin {
		script = generateCliSetupPowerShell(tool, fullKey, baseUrlWithV1, baseUrlWithoutV1, mainModel, subagentModel, haiku, sonnet, opus)
	} else {
		script = generateCliSetupBash(tool, fullKey, baseUrlWithV1, baseUrlWithoutV1, mainModel, subagentModel, haiku, sonnet, opus)
	}

	c.Header("Content-Type", "text/plain; charset=utf-8")
	c.String(http.StatusOK, script)
}

// returnSetupErrorScript trả về script thông báo lỗi và thoát
func returnSetupErrorScript(c *gin.Context, osType string, errMsg string) {
	c.Header("Content-Type", "text/plain; charset=utf-8")
	if strings.EqualFold(osType, "windows") {
		c.String(http.StatusBadRequest,
			fmt.Sprintf("Write-Error \"[new-api] %s\"\nExit 1", errMsg))
	} else {
		c.String(http.StatusBadRequest,
			fmt.Sprintf("echo \"[new-api] Lỗi: %s\"\nexit 1", errMsg))
	}
}

// generateCliSetupBash sinh mã Bash cho Linux / macOS
func generateCliSetupBash(tool, key, baseUrlWithV1, baseUrlWithoutV1, mainModel, subagentModel, haiku, sonnet, opus string) string {
	var sb strings.Builder
	sb.WriteString("#!/bin/bash\nset -e\n\n")

	switch tool {
	case "claude":
		sb.WriteString("mkdir -p \"$HOME/.claude\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.claude/settings.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "hasCompletedOnboarding": true,
  "env": {
    "ANTHROPIC_BASE_URL": "%s",
    "ANTHROPIC_AUTH_TOKEN": "%s",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "%s",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "%s",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "%s"
  }
}
`, baseUrlWithV1, key, haiku, sonnet, opus))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] Claude Code đã được cấu hình thành công!\"\n")

	case "codex":
		sb.WriteString("mkdir -p \"$HOME/.codex\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.codex/config.toml\"\n")
		sb.WriteString(fmt.Sprintf(`model = "%s"
model_provider = "new-api"

[model_providers.new-api]
name = "new-api"
base_url = "%s"
wire_api = "responses"

[agents.subagent]
model = "%s"
`, mainModel, baseUrlWithV1, subagentModel))
		sb.WriteString("EOF\n\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.codex/auth.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "OPENAI_API_KEY": "%s",
  "auth_mode": "apikey"
}
`, key))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] OpenAI Codex CLI đã được cấu hình thành công!\"\n")

	case "cline":
		sb.WriteString("mkdir -p \"$HOME/.cline/data\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.cline/data/globalState.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "actModeApiProvider": "openai",
  "planModeApiProvider": "openai",
  "openAiBaseUrl": "%s",
  "openAiModelId": "%s",
  "planModeOpenAiModelId": "%s"
}
`, baseUrlWithoutV1, mainModel, mainModel))
		sb.WriteString("EOF\n\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.cline/data/secrets.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "openAiApiKey": "%s"
}
`, key))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] Cline đã được cấu hình thành công!\"\n")

	case "opencode":
		sb.WriteString("mkdir -p \"$HOME/.config/opencode\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.config/opencode/opencode.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "selected_provider": "new-api",
  "provider": {
    "new-api": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "%s",
        "apiKey": "%s"
      },
      "models": {
        "%s": {}
      }
    }
  },
  "agent": {
    "subagent": {
      "model": "new-api/%s"
    }
  },
  "default_model": "new-api/%s"
}
`, baseUrlWithV1, key, mainModel, mainModel, mainModel))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] OpenCode đã được cấu hình thành công!\"\n")

	case "openclaw":
		sb.WriteString("mkdir -p \"$HOME/.openclaw\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.openclaw/openclaw.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "api_base": "%s",
  "api_key": "%s",
  "model": "%s"
}
`, baseUrlWithV1, key, mainModel))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] Open Claw đã được cấu hình thành công!\"\n")

	case "hermes":
		sb.WriteString("mkdir -p \"$HOME/.hermes\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.hermes/config.yaml\"\n")
		sb.WriteString(fmt.Sprintf(`model:
  default: "%s"
  provider: "custom"
  base_url: "%s"
`, mainModel, baseUrlWithV1))
		sb.WriteString("EOF\n\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.hermes/.env\"\n")
		sb.WriteString(fmt.Sprintf("OPENAI_API_KEY=%s\n", key))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] Hermes Agent đã được cấu hình thành công!\"\n")

	case "kilo":
		sb.WriteString("mkdir -p \"$HOME/.local/share/kilo\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.local/share/kilo/auth.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "apiKey": "%s",
  "endpoint": "%s",
  "openai-compatible": {
    "type": "api-key",
    "apiKey": "%s",
    "baseUrl": "%s",
    "model": "%s"
  }
}
`, key, baseUrlWithV1, key, baseUrlWithV1, mainModel))
		sb.WriteString("EOF\n")
		sb.WriteString(fmt.Sprintf(`if command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1; then
  PY_CMD=$(command -v python3 || command -v python)
  $PY_CMD -c '
import json, os, sys
paths = [
    "~/.config/Code/User/settings.json",
    "~/.config/Code - Insiders/User/settings.json",
    "~/.config/Cursor/User/settings.json",
    "~/Library/Application Support/Code/User/settings.json",
    "~/Library/Application Support/Code - Insiders/User/settings.json",
    "~/Library/Application Support/Cursor/User/settings.json"
]
for p in paths:
    full_path = os.path.expanduser(p)
    if os.path.exists(os.path.dirname(full_path)):
        data = {}
        if os.path.exists(full_path):
            try:
                with open(full_path, "r") as f:
                    data = json.load(f)
            except:
                pass
        data["kilocode.customProvider"] = {
            "name": "new-api",
            "baseURL": sys.argv[1],
            "apiKey": sys.argv[2]
        }
        data["kilocode.defaultModel"] = sys.argv[3]
        try:
            with open(full_path, "w") as f:
                json.dump(data, f, indent=2)
        except:
            pass

def update_kilo_config(file_path, base_url, api_key, model_id):
    data = {}
    if os.path.exists(file_path):
        try:
            with open(file_path, "r") as f:
                lines = []
                for line in f:
                    if not line.strip().startswith("//"):
                        lines.append(line)
                data = json.loads("".join(lines))
        except:
            data = {}
    if not isinstance(data, dict):
        data = {}
    data["$schema"] = "https://app.kilo.ai/config.json"
    if "provider" not in data or not isinstance(data["provider"], dict):
        data["provider"] = {}
    data["provider"]["new-api"] = {
        "api": "openai",
        "options": {
            "apiKey": api_key,
            "baseURL": base_url
        },
        "models": {
            model_id: {
                "name": model_id
            }
        }
    }
    data["model"] = f"new-api/{model_id}"
    if "models" in data:
        del data["models"]
    if "enabled_providers" in data and isinstance(data["enabled_providers"], list):
        if "new-api" not in data["enabled_providers"]:
            data["enabled_providers"].append("new-api")
    if "disabled_providers" in data and isinstance(data["disabled_providers"], list):
        if "new-api" in data["disabled_providers"]:
            data["disabled_providers"].remove("new-api")
    try:
        dir_name = os.path.dirname(file_path)
        if dir_name:
            os.makedirs(dir_name, exist_ok=True)
        with open(file_path, "w") as f:
            json.dump(data, f, indent=2)
    except:
        pass

kilo_configs = [
    os.path.expanduser("~/.config/kilo/kilo.jsonc")
]
if os.path.exists(".kilo"):
    kilo_configs.append(".kilo/kilo.jsonc")
else:
    kilo_configs.append("kilo.jsonc")

for p in kilo_configs:
    update_kilo_config(p, sys.argv[1], sys.argv[2], sys.argv[3])
' "%s" "%s" "%s"
fi
`, baseUrlWithV1, key, mainModel))
		sb.WriteString("echo \"[new-api] Kilo Code đã được cấu hình thành công!\"\n")

	case "droid":
		sb.WriteString("mkdir -p \"$HOME/.factory\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.factory/settings.json\"\n")
		sb.WriteString(fmt.Sprintf(`{
  "api_base": "%s",
  "api_key": "%s",
  "model": "%s"
}
`, baseUrlWithV1, key, mainModel))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] Factory Droid đã được cấu hình thành công!\"\n")

	case "deepseek-tui":
		sb.WriteString("mkdir -p \"$HOME/.deepseek\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.deepseek/config.toml\"\n")
		sb.WriteString(fmt.Sprintf(`[model_providers.openai]
api_key = "%s"
base_url = "%s"
model = "%s"
`, key, baseUrlWithV1, mainModel))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] DeepSeek TUI đã được cấu hình thành công!\"\n")

	case "jcode":
		sb.WriteString("mkdir -p \"$HOME/.jcode\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.jcode/config.toml\"\n")
		sb.WriteString(fmt.Sprintf(`[model_providers.new-api]
api_key = "%s"
base_url = "%s"
`, key, baseUrlWithV1))
		sb.WriteString("EOF\n\n")
		sb.WriteString("mkdir -p \"$HOME/.config/jcode\"\n")
		sb.WriteString("cat << 'EOF' > \"$HOME/.config/jcode/provider-new-api.env\"\n")
		sb.WriteString(fmt.Sprintf("OPENAI_API_KEY=%s\nOPENAI_API_BASE=%s\n", key, baseUrlWithV1))
		sb.WriteString("EOF\n")
		sb.WriteString("echo \"[new-api] jcode đã được cấu hình thành công!\"\n")

	default:
		sb.WriteString(fmt.Sprintf("echo \"[new-api] Lỗi: Công cụ '%s' không được hỗ trợ\"\nexit 1\n", tool))
	}

	return sb.String()
}

// generateCliSetupPowerShell sinh mã PowerShell cho Windows
func generateCliSetupPowerShell(tool, key, baseUrlWithV1, baseUrlWithoutV1, mainModel, subagentModel, haiku, sonnet, opus string) string {
	var sb strings.Builder
	sb.WriteString("$ErrorActionPreference = \"Stop\"\n\n")

	switch tool {
	case "claude":
		sb.WriteString("$dir = Join-Path $HOME \".claude\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$settingsJson = @"
{
  "hasCompletedOnboarding": true,
  "env": {
    "ANTHROPIC_BASE_URL": "%s",
    "ANTHROPIC_AUTH_TOKEN": "%s",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "%s",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "%s",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "%s"
  }
}
"@
Set-Content -Path (Join-Path $dir "settings.json") -Value $settingsJson -Force
`, baseUrlWithV1, key, haiku, sonnet, opus))
		sb.WriteString("Write-Host \"[new-api] Claude Code đã được cấu hình thành công!\"\n")

	case "codex":
		sb.WriteString("$dir = Join-Path $HOME \".codex\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$configToml = @"
model = "%s"
model_provider = "new-api"

[model_providers.new-api]
name = "new-api"
base_url = "%s"
wire_api = "responses"

[agents.subagent]
model = "%s"
"@
Set-Content -Path (Join-Path $dir "config.toml") -Value $configToml -Force

$authJson = @"
{
  "OPENAI_API_KEY": "%s",
  "auth_mode": "apikey"
}
"@
Set-Content -Path (Join-Path $dir "auth.json") -Value $authJson -Force
`, mainModel, baseUrlWithV1, subagentModel, key))
		sb.WriteString("Write-Host \"[new-api] OpenAI Codex CLI đã được cấu hình thành công!\"\n")

	case "cline":
		sb.WriteString("$dir = Join-Path $HOME \".cline\\data\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$globalStateJson = @"
{
  "actModeApiProvider": "openai",
  "planModeApiProvider": "openai",
  "openAiBaseUrl": "%s",
  "openAiModelId": "%s",
  "planModeOpenAiModelId": "%s"
}
"@
Set-Content -Path (Join-Path $dir "globalState.json") -Value $globalStateJson -Force

$secretsJson = @"
{
  "openAiApiKey": "%s"
}
"@
Set-Content -Path (Join-Path $dir "secrets.json") -Value $secretsJson -Force
`, baseUrlWithoutV1, mainModel, mainModel, key))
		sb.WriteString("Write-Host \"[new-api] Cline đã được cấu hình thành công!\"\n")

	case "opencode":
		sb.WriteString("$dir = Join-Path $HOME \".config\\opencode\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$opencodeJson = @"
{
  "selected_provider": "new-api",
  "provider": {
    "new-api": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "%s",
        "apiKey": "%s"
      },
      "models": {
        "%s": {}
      }
    }
  },
  "agent": {
    "subagent": {
      "model": "new-api/%s"
    }
  },
  "default_model": "new-api/%s"
}
"@
Set-Content -Path (Join-Path $dir "opencode.json") -Value $opencodeJson -Force
`, baseUrlWithV1, key, mainModel, mainModel, mainModel))
		sb.WriteString("Write-Host \"[new-api] OpenCode đã được cấu hình thành công!\"\n")

	case "openclaw":
		sb.WriteString("$dir = Join-Path $HOME \".openclaw\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$openclawJson = @"
{
  "api_base": "%s",
  "api_key": "%s",
  "model": "%s"
}
"@
Set-Content -Path (Join-Path $dir "openclaw.json") -Value $openclawJson -Force
`, baseUrlWithV1, key, mainModel))
		sb.WriteString("Write-Host \"[new-api] Open Claw đã được cấu hình thành công!\"\n")

	case "hermes":
		sb.WriteString("$dir = Join-Path $HOME \".hermes\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$configYaml = @"
model:
  default: "%s"
  provider: "custom"
  base_url: "%s"
"@
Set-Content -Path (Join-Path $dir "config.yaml") -Value $configYaml -Force

$envContent = @"
OPENAI_API_KEY=%s
"@
Set-Content -Path (Join-Path $dir ".env") -Value $envContent -Force
`, mainModel, baseUrlWithV1, key))
		sb.WriteString("Write-Host \"[new-api] Hermes Agent đã được cấu hình thành công!\"\n")

	case "kilo":
		sb.WriteString("$dir = Join-Path $HOME \".local\\share\\kilo\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$authJson = @"
{
  "apiKey": "%s",
  "endpoint": "%s",
  "openai-compatible": {
    "type": "api-key",
    "apiKey": "%s",
    "baseUrl": "%s",
    "model": "%s"
  }
}
"@
Set-Content -Path (Join-Path $dir "auth.json") -Value $authJson -Force
`, key, baseUrlWithV1, key, baseUrlWithV1, mainModel))
		sb.WriteString(fmt.Sprintf(`$vscodePaths = @(
    "$env:APPDATA\Code\User\settings.json",
    "$env:APPDATA\Code - Insiders\User\settings.json",
    "$env:APPDATA\Cursor\User\settings.json"
)
foreach ($p in $vscodePaths) {
    $parent = Split-Path $p
    if (Test-Path $parent) {
        $vscode = @{}
        if (Test-Path $p) {
            try {
                $vscode = Get-Content $p -Raw | ConvertFrom-Json
            } catch {}
        }
        if ($vscode -isnot [System.Management.Automation.PSCustomObject]) {
            $vscode = [PSCustomObject]$vscode
        }
        $vscode | Add-Member -NotePropertyName "kilocode.customProvider" -NotePropertyValue @{
            name = "new-api"
            baseURL = "%s"
            apiKey = "%s"
        } -Force
        $vscode | Add-Member -NotePropertyName "kilocode.defaultModel" -NotePropertyValue "%s" -Force
        $vscode | ConvertTo-Json -Depth 10 | Set-Content $p -Force
    }
}

function Update-KiloConfig($filePath, $baseUrl, $apiKey, $modelId) {
    $parent = Split-Path $filePath
    if ($parent -and !(Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    $config = @{}
    if (Test-Path $filePath) {
        try {
            $lines = Get-Content $filePath
            $cleanLines = @()
            foreach ($line in $lines) {
                if (!($line.Trim().StartsWith("//"))) {
                    $cleanLines += $line
                }
            }
            $config = $cleanLines -join [char]10 | ConvertFrom-Json
        } catch {}
    }
    if ($config -isnot [System.Management.Automation.PSCustomObject]) {
        $config = [PSCustomObject]$config
    }
    $config | Add-Member -NotePropertyName '$schema' -NotePropertyValue "https://app.kilo.ai/config.json" -Force
    if (!$config.provider -or $config.provider -isnot [System.Management.Automation.PSCustomObject]) {
        $config | Add-Member -NotePropertyName "provider" -NotePropertyValue [PSCustomObject]@{} -Force
    }
    $config.provider | Add-Member -NotePropertyName "new-api" -NotePropertyValue [PSCustomObject]@{
        api = "openai"
        options = @{
            apiKey = $apiKey
            baseURL = $baseUrl
        }
        models = @{
            $modelId = @{
                name = $modelId
            }
        }
    } -Force
    $config | Add-Member -NotePropertyName "model" -NotePropertyValue "new-api/$modelId" -Force
    if ($config.models) {
        $config.PSObject.Properties.Remove("models")
    }
    if ($config.enabled_providers -and $config.enabled_providers -is [System.Collections.IList]) {
        if ($config.enabled_providers -notcontains "new-api") {
            $config.enabled_providers += "new-api"
        }
    }
    if ($config.disabled_providers -and $config.disabled_providers -is [System.Collections.IList]) {
        if ($config.disabled_providers -contains "new-api") {
            $config.disabled_providers = $config.disabled_providers | Where-Object { $_ -ne "new-api" }
        }
    }
    $config | ConvertTo-Json -Depth 10 | Set-Content $filePath -Force
}

$kiloPaths = @("$HOME\.config\kilo\kilo.jsonc")
if (Test-Path ".kilo") {
    $kiloPaths += ".kilo\kilo.jsonc"
} else {
    $kiloPaths += "kilo.jsonc"
}
foreach ($kp in $kiloPaths) {
    Update-KiloConfig $kp "%s" "%s" "%s"
}
`, baseUrlWithV1, key, mainModel, baseUrlWithV1, key, mainModel))
		sb.WriteString("Write-Host \"[new-api] Kilo Code đã được cấu hình thành công!\"\n")

	case "droid":
		sb.WriteString("$dir = Join-Path $HOME \".factory\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$settingsJson = @"
{
  "api_base": "%s",
  "api_key": "%s",
  "model": "%s"
}
"@
Set-Content -Path (Join-Path $dir "settings.json") -Value $settingsJson -Force
`, baseUrlWithV1, key, mainModel))
		sb.WriteString("Write-Host \"[new-api] Factory Droid đã được cấu hình thành công!\"\n")

	case "deepseek-tui":
		sb.WriteString("$dir = Join-Path $HOME \".deepseek\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$configToml = @"
[model_providers.openai]
api_key = "%s"
base_url = "%s"
model = "%s"
"@
Set-Content -Path (Join-Path $dir "config.toml") -Value $configToml -Force
`, key, baseUrlWithV1, mainModel))
		sb.WriteString("Write-Host \"[new-api] DeepSeek TUI đã được cấu hình thành công!\"\n")

	case "jcode":
		sb.WriteString("$dir = Join-Path $HOME \".jcode\"\n")
		sb.WriteString("if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }\n")
		sb.WriteString(fmt.Sprintf(`$configToml = @"
[model_providers.new-api]
api_key = "%s"
base_url = "%s"
"@
Set-Content -Path (Join-Path $dir "config.toml") -Value $configToml -Force

$dirConfig = Join-Path $HOME ".config\jcode"
if (!(Test-Path $dirConfig)) { New-Item -ItemType Directory -Path $dirConfig -Force | Out-Null }
$envContent = @"
OPENAI_API_KEY=%s
OPENAI_API_BASE=%s
"@
Set-Content -Path (Join-Path $dirConfig "provider-new-api.env") -Value $envContent -Force
`, key, baseUrlWithV1, key, baseUrlWithV1))
		sb.WriteString("Write-Host \"[new-api] jcode đã được cấu hình thành công!\"\n")

	default:
		sb.WriteString(fmt.Sprintf("Write-Error \"[new-api] Công cụ '%s' không được hỗ trợ\"\nExit 1\n", tool))
	}

	return sb.String()
}
