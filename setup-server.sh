#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "Usage: ./setup-server.sh <FLOATING_IP>"
    exit 1
fi

IP="$1"
SSH="ssh -o StrictHostKeyChecking=accept-new ubuntu@$IP"
SCP="scp -o StrictHostKeyChecking=accept-new"

echo "==> Waiting for SSH to become available..."
for i in $(seq 1 30); do
    if $SSH "echo ok" &>/dev/null; then
        echo "    SSH is ready."
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo "    ERROR: SSH not available after 60s. Check security group and IP."
        exit 1
    fi
    sleep 2
done

echo "==> Installing Caddy..."
$SSH "sudo apt-get update -qq && sudo apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl > /dev/null"
$SSH "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg"
$SSH "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list > /dev/null"
$SSH "sudo apt-get update -qq && sudo apt-get install -y -qq caddy > /dev/null"

echo "==> Deploying website files..."
$SSH "sudo mkdir -p /var/www/mannhart.ai"
$SCP index.html "ubuntu@$IP:/tmp/index.html"
$SSH "sudo mv /tmp/index.html /var/www/mannhart.ai/index.html"

# Copy photos if the directory exists
if [ -d "Fotos FHNW" ]; then
    echo "==> Deploying photos..."
    $SCP -r "Fotos FHNW" "ubuntu@$IP:/tmp/fotos"
    $SSH "sudo mv '/tmp/fotos' '/var/www/mannhart.ai/Fotos FHNW'"
fi

echo "==> Configuring Caddy..."
$SSH "sudo tee /etc/caddy/Caddyfile > /dev/null" <<'CADDYFILE'
t.mannhart.ai {
    root * /var/www/mannhart.ai
    file_server
    encode gzip
}
CADDYFILE

$SSH "sudo systemctl restart caddy"

echo ""
echo "════════════════════════════════════════════════════"
echo "  Site deployed!"
echo "  https://t.mannhart.ai (once DNS propagates)"
echo ""
echo "  To update the site later:"
echo "  scp index.html ubuntu@$IP:/tmp/index.html"
echo "  ssh ubuntu@$IP 'sudo mv /tmp/index.html /var/www/mannhart.ai/index.html'"
echo "════════════════════════════════════════════════════"
