#!/bin/bash

# Deploy new-api to VPS (without sshpass)
set -e

VPS_IP="180.93.59.22"
SSH_USER="root"
REMOTE_PATH="/root/new-api"
LOCAL_BINARY="./new-api"
LOCAL_DIST="./web/default/dist"

echo "========== BUILD BACKEND =========="
go build -o new-api .
echo "✅ Backend built"

echo ""
echo "========== BUILD FRONTEND =========="
cd web/default && bun run build && cd ../..
echo "✅ Frontend built"

echo ""
echo "========== DEPLOY TO VPS =========="

# Tạo temp dir để upload
TEMP_DEPLOY="/tmp/new-api-deploy-$$"
mkdir -p "$TEMP_DEPLOY"
cp "$LOCAL_BINARY" "$TEMP_DEPLOY/"
cp -r "$LOCAL_DIST"/* "$TEMP_DEPLOY/dist/" || mkdir -p "$TEMP_DEPLOY/dist" && cp -r "$LOCAL_DIST"/* "$TEMP_DEPLOY/dist/"

echo "Uploading files via SSH..."
tar -czf - -C "$TEMP_DEPLOY" . | ssh -o StrictHostKeyChecking=no "$SSH_USER@$VPS_IP" "
    pkill -f '/root/new-api/new-api' 2>/dev/null || true
    sleep 2
    cd $REMOTE_PATH
    tar -xzf -
    chmod +x new-api
    nohup ./new-api > logs/new-api.log 2>&1 &
    sleep 3
    ps aux | grep new-api | grep -v grep && echo '✅ Service started' || echo '⚠️  Service may not have started'
"

rm -rf "$TEMP_DEPLOY"

echo ""
echo "✅ Deploy complete!"
echo "📊 Logs: ssh root@$VPS_IP 'tail -f $REMOTE_PATH/logs/new-api.log'"
