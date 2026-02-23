#!/usr/bin/env bash
set -euo pipefail

# ── Configuration ──────────────────────────────────────────────
CLOUD="PCP-JW9FEX7-dc3-a"
FLAVOR="a1-ram2-disk20-perf1"
IMAGE="Ubuntu 24.04 LTS Noble Numbat"
KEYPAIR_NAME="mannhart-ai"
SSH_PUBKEY="$HOME/.ssh/id_ed25519.pub"
SECGROUP="mannhart-ai-web"
NETWORK_NAME="mannhart-ai-net"
SUBNET_NAME="mannhart-ai-subnet"
ROUTER_NAME="mannhart-ai-router"
SERVER_NAME="mannhart-ai"
EXT_NETWORK="ext-floating1"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load password from .env
if [ -f "$SCRIPT_DIR/.env" ]; then
    # shellcheck source=/dev/null
    source "$SCRIPT_DIR/.env"
fi
if [ -z "${OPEN_STACK_PASSWORD:-}" ]; then
    echo "ERROR: OPEN_STACK_PASSWORD not set. Create a .env file with OPEN_STACK_PASSWORD=..."
    exit 1
fi

export OS_CLIENT_CONFIG_FILE="$SCRIPT_DIR/PCU-JW9FEX7-clouds.yaml"
export OS_PASSWORD="$OPEN_STACK_PASSWORD"
OS="openstack --os-cloud $CLOUD"

echo "==> 1/7 Uploading SSH keypair..."
$OS keypair create --public-key "$SSH_PUBKEY" "$KEYPAIR_NAME"

echo "==> 2/7 Creating security group..."
$OS security group create "$SECGROUP" --description "SSH + HTTP + HTTPS"
$OS security group rule create --protocol tcp --dst-port 22 --remote-ip 0.0.0.0/0 "$SECGROUP"
$OS security group rule create --protocol tcp --dst-port 80 --remote-ip 0.0.0.0/0 "$SECGROUP"
$OS security group rule create --protocol tcp --dst-port 443 --remote-ip 0.0.0.0/0 "$SECGROUP"

echo "==> 3/7 Creating private network + subnet..."
$OS network create "$NETWORK_NAME"
$OS subnet create "$SUBNET_NAME" \
    --network "$NETWORK_NAME" \
    --subnet-range 192.168.100.0/24 \
    --dns-nameserver 8.8.8.8 \
    --dns-nameserver 1.1.1.1

echo "==> 4/7 Creating router (connects private network to internet)..."
$OS router create "$ROUTER_NAME"
$OS router set "$ROUTER_NAME" --external-gateway "$EXT_NETWORK"
$OS router add subnet "$ROUTER_NAME" "$SUBNET_NAME"

echo "==> 5/7 Booting VM..."
$OS server create \
    --flavor "$FLAVOR" \
    --image "$IMAGE" \
    --key-name "$KEYPAIR_NAME" \
    --security-group "$SECGROUP" \
    --network "$NETWORK_NAME" \
    "$SERVER_NAME"

echo "    Waiting for server to become ACTIVE..."
$OS server wait "$SERVER_NAME"
echo "    Server is ACTIVE."

echo "==> 6/7 Allocating and assigning floating IP..."
FLOATING_IP=$($OS floating ip create "$EXT_NETWORK" -f value -c floating_ip_address)
$OS server add floating ip "$SERVER_NAME" "$FLOATING_IP"
echo "    Floating IP: $FLOATING_IP"

echo "==> 7/7 Done!"
echo ""
echo "════════════════════════════════════════════════════"
echo "  VM is ready at: $FLOATING_IP"
echo "  SSH:  ssh ubuntu@$FLOATING_IP"
echo ""
echo "  Next steps:"
echo "  1. Add DNS A record on Hostpoint:"
echo "     t.mannhart.ai → $FLOATING_IP"
echo ""
echo "  2. Run: ./setup-server.sh $FLOATING_IP"
echo "════════════════════════════════════════════════════"
