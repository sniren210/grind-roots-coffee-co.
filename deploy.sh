#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# grind-roots-coffee — Deploy Script
# ─────────────────────────────────────────────────────────────────────────────
# Usage:
#   ./deploy.sh                          # interactive (prompts for all vars)
#   REGISTRY=docker.io IMAGE=myapp TAG=v1 ./deploy.sh   # non-interactive
#
# Required env vars:
#   REGISTRY   — Docker registry (e.g. docker.io, ghcr.io, registry.example.com)
#   IMAGE       — Image name (e.g. username/grind-roots or registry.example.com/app)
#   TAG         — Image tag  (e.g. latest, dev, 2026-07-06)
#   VPS_HOST    — VPS SSH host  (e.g. root@198.51.100.42)
#   VPS_DIR     — Path to app on VPS (e.g. /opt/grind-roots)
#
# VPS prerequisites (one-time):
#   1. Install Docker on VPS:
#        curl -fsSL https://get.docker.com | sh
#        systemctl enable --now docker
#
#   2. Create the app directory on VPS:
#        ssh root@<VPS_HOST> "mkdir -p /opt/grind-roots && mkdir -p /etc/docker/certs.d/registry.example.com"
#
#   3. For private registry — copy the cert and configure:
#        scp cert.pem root@<VPS_HOST>:/etc/docker/certs.d/registry.example.com/ca.crt
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

log()  { echo -e "${GREEN}✓${RESET}  $*"; }
warn() { echo -e "${YELLOW}⚠${RESET}  $*"; }
err()  { echo -e "${RED}✗${RESET}  $*" >&2; exit 1; }
step() { echo -e "\n${CYAN}▸${RESET}  ${BOLD}$*${RESET}"; }

# ── Env / Defaults ───────────────────────────────────────────────────────────
REGISTRY="${REGISTRY:-}"
IMAGE="${IMAGE:-}"
TAG="${TAG:-$(date +%Y-%m-%d_%H%M%S)}"
VPS_HOST="${VPS_HOST:-}"
VPS_DIR="${VPS_DIR:-/opt/grind-roots}"
DOCKERFILE="${DOCKERFILE:-Dockerfile}"

# ── Prompt for missing vars ─────────────────────────────────────────────────
prompt() {
  local var="$1"; local label="$2"; local secret="${3:-}"
  if [[ -z "${!var:-}" ]]; then
    printf "%s [%s]: " "$label" "${!var:-}"
    local val; read -r val
    if [[ -n "$val" ]]; then declare "$var=$val"; fi
  fi
  [[ -n "${!var:-}" ]] || err "Variable $var is required but was not provided."
}

# ── Helpers ─────────────────────────────────────────────────────────────────
run() {
  echo -e "  ${CYAN}$ $*\n${RESET}"
  "$@"
}

ssh_run() {
  local cmd="cd $VPS_DIR && $1"
  shift
  run ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$@" "$VPS_HOST" "$cmd"
}

# ── Banner ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}  grind-roots-coffee  Deploy${RESET}"
echo -e "  ─────────────────────────────────────────"

# ── Collect missing variables ─────────────────────────────────────────────────
if [[ -z "$REGISTRY" || -z "$IMAGE" || -z "$VPS_HOST" ]]; then
  echo ""
  warn "Some required variables are missing. Please provide them below."
  echo ""
  prompt REGISTRY  "Docker Registry"    "e.g. docker.io  (press Enter for docker.io)"
  REGISTRY="${REGISTRY:-docker.io}"
  prompt IMAGE     "Image name"         "e.g. username/grind-roots"
  prompt VPS_HOST  "VPS SSH host"       "e.g. root@198.51.100.42"
  prompt TAG       "Image tag (optional)" "leave blank for timestamped tag"
  prompt VPS_DIR   "App directory (optional)" "/opt/grind-roots"
  VPS_DIR="${VPS_DIR:-/opt/grind-roots}"
fi

FULL_IMAGE="${REGISTRY}/${IMAGE}:${TAG}"
LATEST_IMAGE="${REGISTRY}/${IMAGE}:latest"

# ── Validate ─────────────────────────────────────────────────────────────────
[[ "$REGISTRY" == docker.io ]] && IMAGE_NAME="$IMAGE" || IMAGE_NAME="${REGISTRY}/${IMAGE}"
log "Registry:  ${REGISTRY}"
log "Image:      ${IMAGE_NAME}:${TAG}"
log "VPS:        ${VPS_HOST}:${VPS_DIR}"
echo ""

# ── Step 1: Build ────────────────────────────────────────────────────────────
step "Building Docker image"
start=$(date +%s)
run docker build \
  --platform=linux/amd64 \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -f "$DOCKERFILE" \
  -t "$FULL_IMAGE" \
  -t "$LATEST_IMAGE" \
  .
n=$(( $(date +%s) - start ))
log "Image built in ${n}s — ${FULL_IMAGE}"

# ── Step 2: Login to registry ───────────────────────────────────────────────
step "Logging in to registry"
if [[ "$REGISTRY" == docker.io ]]; then
  run docker login -u "$DOCKER_USER" -p "$DOCKER_TOKEN" || err "Docker Hub login failed. Set DOCKER_USER and DOCKER_TOKEN env vars."
elif [[ "$REGISTRY" != localhost ]]; then
  run docker login "$REGISTRY" || err "Registry login failed."
fi

# ── Step 3: Push ─────────────────────────────────────────────────────────────
step "Pushing image to registry"
run docker push "$FULL_IMAGE"
run docker push "$LATEST_IMAGE"
log "Image pushed"

# ── Step 4: Pull on VPS ─────────────────────────────────────────────────────
step "Pulling image on VPS"
ssh_run "docker pull $FULL_IMAGE" || err "Docker pull on VPS failed."

# ── Step 5: Restart container ───────────────────────────────────────────────
step "Restarting container on VPS"

# Stop & remove old container if it exists
ssh_run "cd $VPS_DIR && \
  docker compose down --remove-orphans 2>/dev/null || true && \
  docker stop grind-roots 2>/dev/null || true && \
  docker rm grind-roots 2>/dev/null || true" || true

# Start new container
ssh_run "cd $VPS_DIR && \
  docker run -d \
    --name grind-roots \
    --restart unless-stopped \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e PORT=3000 \
    $FULL_IMAGE" || err "Failed to start container on VPS."

# ── Step 6: Health check ───────────────────────────────────────────────────
step "Health check"
sleep 5
STATUS=$(ssh_run "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/" 2>/dev/null || echo "000")
if [[ "$STATUS" == "200" ]]; then
  log "App is live! HTTP $STATUS"
else
  warn "App responded with HTTP $STATUS — check logs: ssh $VPS_HOST 'docker logs grind-roots'"
fi

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
log "Deploy complete!"
echo ""
echo -e "  ${BOLD}Image:${RESET}  ${FULL_IMAGE}"
echo -e "  ${BOLD}VPS:${RESET}    http://${VPS_HOST#*@}:3000"
echo -e "  ${BOLD}Logs:${RESET}    ssh ${VPS_HOST} 'docker logs grind-roots -f'"
echo ""
