#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load SERVER_IP from .env
if [ -f "$SCRIPT_DIR/.env" ]; then
    # shellcheck source=/dev/null
    source "$SCRIPT_DIR/.env"
fi
if [ -z "${SERVER_IP:-}" ]; then
    echo "ERROR: SERVER_IP not set. Add SERVER_IP=... to .env"
    exit 1
fi

SSH="ssh -o StrictHostKeyChecking=accept-new ubuntu@$SERVER_IP"

echo "==> Building site..."
npm run build

echo "==> Deploying _site/ to server..."
rsync -avz --delete "$SCRIPT_DIR/_site/" "ubuntu@$SERVER_IP:/var/www/mannhart.ai/"

echo ""
echo "════════════════════════════════════════════════════"
echo "  Site deployed to https://t.mannhart.ai"
echo "════════════════════════════════════════════════════"
