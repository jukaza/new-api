#!/bin/bash
set -e

VPS_IP="180.93.59.22"
SSH_USER="root"
REMOTE_PATH="/root/new-api"

# QUAN TRỌNG: Frontend được embed vào binary Go (//go:embed web/default/dist).
# Phải build FRONTEND TRƯỚC, rồi build BACKEND sau để embed dist mới.
# Chỉ cần upload binary — KHÔNG cần upload dist (binary tự serve embedded).

echo "========== BUILD FRONTEND (trước) =========="
cd web/default && bun run build && cd ../..
echo "✅ Frontend built"

echo ""
echo "========== BUILD BACKEND (embed dist mới) =========="
go build -o new-api .
echo "✅ Backend built (đã embed frontend mới)"

echo ""
echo "========== DEPLOY =========="
ssh -o StrictHostKeyChecking=no "$SSH_USER@$VPS_IP" "pkill -f '/root/new-api/new-api' 2>/dev/null || true; sleep 2"
echo "⏹  Stopped old process"

scp -o StrictHostKeyChecking=no new-api "$SSH_USER@$VPS_IP:$REMOTE_PATH/new-api"
echo "📤 Uploaded binary"

ssh -o StrictHostKeyChecking=no "$SSH_USER@$VPS_IP" "cd $REMOTE_PATH && chmod +x new-api && nohup ./new-api > logs/new-api.log 2>&1 & sleep 3 && ps aux | grep new-api | grep -v grep && echo '✅ Service started' || echo '⚠️ Check logs'"

echo ""
echo "✅ Deploy complete!"
