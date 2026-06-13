#!/usr/bin/env bash
# Smoke tests API móvil — login Bearer + health
# Uso: BACKEND_URL=... TEST_EMAIL=... TEST_PASSWORD=... ./scripts/smoke-mobile-api.sh

set -euo pipefail

BACKEND_URL="${BACKEND_URL:-https://miayudatics-v1-0.onrender.com}"
TEST_EMAIL="${TEST_EMAIL:-}"
TEST_PASSWORD="${TEST_PASSWORD:-}"

pass=0
fail=0

check() {
  local name="$1"
  local ok="$2"
  if [ "$ok" = "1" ]; then
    echo "PASS: $name"
    pass=$((pass + 1))
  else
    echo "FAIL: $name"
    fail=$((fail + 1))
  fi
}

echo "=== MiAyudaTIC smoke mobile API ==="
echo "Backend: $BACKEND_URL"
echo ""

health_body="$(curl -sf "$BACKEND_URL/api/health" 2>/dev/null || echo '{}')"
echo "$health_body" | grep -q '"socket"' && socket_ok=1 || socket_ok=0
check "health integrations.socket" "$socket_ok"

if [ -n "$TEST_EMAIL" ] && [ -n "$TEST_PASSWORD" ]; then
  login_body="$(curl -sf -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"correo\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" 2>/dev/null || echo '{}')"

  token="$(echo "$login_body" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4 || true)"
  if [ -n "$token" ]; then
    verify_code="$(curl -s -o /dev/null -w '%{http_code}' \
      -H "Authorization: Bearer $token" \
      "$BACKEND_URL/api/auth/verify-token")"
    check "verify-token Bearer" "$([ "$verify_code" = "200" ] && echo 1 || echo 0)"

    echo "$login_body" | grep -q '"expiresIn":7200' && exp_ok=1 || exp_ok=0
    check "login expiresIn" "$exp_ok"
  else
    check "login obtiene token" "0"
    check "verify-token Bearer" "0"
    check "login expiresIn" "0"
  fi
else
  echo "SKIP: login/verify (set TEST_EMAIL and TEST_PASSWORD)"
fi

cors_hdr="$(curl -si -H "Origin: https://miayudatics.vercel.app" \
  -X OPTIONS \
  -H "Access-Control-Request-Method: POST" \
  "$BACKEND_URL/api/auth/login" 2>/dev/null | grep -i 'access-control-allow-origin' || true)"
echo "$cors_hdr" | grep -q 'miayudatics.vercel.app' && cors_ok=1 || cors_ok=0
check "CORS preflight login" "$cors_ok"

echo ""
echo "=== Resumen: $pass PASS, $fail FAIL ==="
[ "$fail" -eq 0 ]
