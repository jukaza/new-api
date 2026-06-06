#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../web/default"
echo "Starting web frontend dev server..."
bun run dev
