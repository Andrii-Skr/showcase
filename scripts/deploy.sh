#!/usr/bin/env bash
set -Eeuo pipefail

readonly ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

readonly ENV_FILE="${ENV_FILE:-.env}"
readonly STATE_DIR="${DEPLOY_STATE_DIR:-.deploy}"
readonly CURRENT_RELEASE_FILE="$STATE_DIR/current-release"
readonly PREVIOUS_RELEASE_FILE="$STATE_DIR/previous-release"
readonly WAIT_TIMEOUT="${WAIT_TIMEOUT:-${DEPLOY_WAIT_TIMEOUT:-180}}"
readonly COMPOSE=(docker compose --env-file "$ENV_FILE")

log() {
  printf '[deploy] %s\n' "$*"
}

fail() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage:
  ./scripts/deploy.sh deploy [release-tag]
  ./scripts/deploy.sh rollback

The script is intended to run on the production Docker host from the checked-out
repository. It never removes volumes. Successful release state is stored in .deploy/.
EOF
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "required command is missing: $1"
}

env_value() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 || true)"
  printf '%s' "${line#*=}"
}

validate_environment() {
  [[ -f "$ENV_FILE" ]] || fail "$ENV_FILE does not exist; run 'make init' and replace every secret"
  chmod 600 "$ENV_FILE"

  local key value
  for key in UMAMI_DB_PASSWORD UMAMI_DATABASE_URL UMAMI_APP_SECRET; do
    value="$(env_value "$key")"
    [[ -n "$value" ]] || fail "$key is missing or empty in $ENV_FILE"
    [[ "$value" != *replace-with* ]] || fail "$key still contains the example placeholder"
  done

  "${COMPOSE[@]}" config --quiet
}

validate_release() {
  local release="$1"
  [[ "$release" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]] || fail "invalid Docker release tag: $release"
}

generated_release() {
  local revision="nogit"
  if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    revision="$(git rev-parse --short=12 HEAD)"
  fi
  printf '%s-%s' "$(date -u +%Y%m%d%H%M%S)" "$revision"
}

showcase_image() {
  local image
  image="$(env_value SHOWCASE_IMAGE)"
  printf '%s' "${image:-justours/showcase}"
}

read_release() {
  local file="$1"
  [[ -f "$file" ]] && tr -d '\r\n' < "$file" || true
}

write_release_state() {
  local current="$1"
  local previous="$2"
  mkdir -p "$STATE_DIR"
  printf '%s\n' "$current" > "$CURRENT_RELEASE_FILE.tmp"
  mv "$CURRENT_RELEASE_FILE.tmp" "$CURRENT_RELEASE_FILE"
  if [[ -n "$previous" && "$previous" != "$current" ]]; then
    printf '%s\n' "$previous" > "$PREVIOUS_RELEASE_FILE.tmp"
    mv "$PREVIOUS_RELEASE_FILE.tmp" "$PREVIOUS_RELEASE_FILE"
  fi
}

wait_for_public_health() {
  local endpoint port
  endpoint="$("${COMPOSE[@]}" port showcase 3000 | tail -n 1)"
  port="${endpoint##*:}"
  [[ "$port" =~ ^[0-9]+$ ]] || fail "could not determine the published showcase port"
  curl --fail --silent --show-error --retry 5 --retry-delay 2 "http://127.0.0.1:${port}/api/health" >/dev/null
}

start_release() {
  local release="$1"
  if ! RELEASE_TAG="$release" "${COMPOSE[@]}" up -d --remove-orphans --wait --wait-timeout "$WAIT_TIMEOUT"; then
    return 1
  fi
  wait_for_public_health
}

restore_release() {
  local release="$1"
  local image
  image="$(showcase_image)"
  [[ -n "$release" ]] || return 1
  docker image inspect "${image}:${release}" >/dev/null 2>&1 || return 1

  log "restoring release $release"
  start_release "$release"
}

deploy() {
  local release="${1:-}"
  local previous
  [[ -n "$release" ]] || release="$(generated_release)"
  validate_release "$release"
  previous="$(read_release "$CURRENT_RELEASE_FILE")"

  log "building showcase release $release"
  RELEASE_TAG="$release" "${COMPOSE[@]}" build --pull showcase

  log "pulling pinned analytics images"
  "${COMPOSE[@]}" pull analytics analytics-db

  log "starting release $release and waiting up to ${WAIT_TIMEOUT}s for health checks"
  if ! start_release "$release"; then
    log "release $release failed its health check"
    if restore_release "$previous"; then
      fail "deployment failed; restored previous release $previous"
    fi
    fail "deployment failed and no previous local image was available for rollback"
  fi

  write_release_state "$release" "$previous"
  log "release $release is healthy"
  "${COMPOSE[@]}" ps
}

rollback() {
  local current previous
  current="$(read_release "$CURRENT_RELEASE_FILE")"
  previous="$(read_release "$PREVIOUS_RELEASE_FILE")"
  [[ -n "$previous" ]] || fail "no previous successful release is recorded"
  validate_release "$previous"

  restore_release "$previous" || fail "image for previous release $previous is not available locally"
  write_release_state "$previous" "$current"
  log "rolled back from ${current:-unknown} to $previous"
  "${COMPOSE[@]}" ps
}

main() {
  case "${1:-}" in
    -h|--help|help) usage; exit 0 ;;
  esac

  require_command docker
  require_command curl
  docker compose version >/dev/null
  validate_environment

  case "${1:-}" in
    deploy) deploy "${2:-}" ;;
    rollback) rollback ;;
    *) usage; exit 2 ;;
  esac
}

main "$@"
