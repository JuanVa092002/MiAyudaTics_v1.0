#!/usr/bin/env bash
# Smoke tests de producción — MiAyudaTIC
# Uso: BACKEND_URL=... FRONTEND_URL=... ./scripts/smoke-prod.sh

set -euo pipefail

BACKEND_URL="${BACKEND_URL:-https://miayudatics-v1-0.onrender.com}"
FRONTEND_URL="${FRONTEND_URL:-https://miayudatics.vercel.app}"

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

echo "=== MiAyudaTIC smoke prod ==="
echo "Backend:  $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo ""

# Health
health_body="$(curl -sf "$BACKEND_URL/api/health" 2>/dev/null || echo '{}')"
echo "$health_body" | grep -q '"status":"ok"' && db_ok=1 || db_ok=0
echo "$health_body" | grep -q '"database":"connected"' && db_conn=1 || db_conn=0
check "health status ok" "$db_ok"
check "health database connected" "$db_conn"

# CORS GET
cors_get="$(curl -s -o /dev/null -w '%{http_code}' -H "Origin: $FRONTEND_URL" "$BACKEND_URL/api/health")"
check "CORS GET from frontend" "$([ "$cors_get" = "200" ] && echo 1 || echo 0)"

cors_header="$(curl -si -H "Origin: $FRONTEND_URL" "$BACKEND_URL/api/health" 2>/dev/null | grep -i 'access-control-allow-origin' || true)"
echo "$cors_header" | grep -q "$FRONTEND_URL" && cors_hdr=1 || cors_hdr=0
check "CORS allow-origin header" "$cors_hdr"

# CORS preflight
cors_opt="$(curl -s -o /dev/null -w '%{http_code}' -X OPTIONS \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  "$BACKEND_URL/api/auth/login")"
check "CORS preflight login" "$([ "$cors_opt" = "200" ] && echo 1 || echo 0)"

# API security
u_code="$(curl -s -o /dev/null -w '%{http_code}' "$BACKEND_URL/api/usuarios")"
check "usuarios sin auth -> 401" "$([ "$u_code" = "401" ] && echo 1 || echo 0)"

login_code="$(curl -s -o /dev/null -w '%{http_code}' -X POST \
  -H "Content-Type: application/json" \
  -d '{"correo":"no@existe.test","password":"wrongpass12"}' \
  "$BACKEND_URL/api/auth/login")"
check "login invalido -> 401" "$([ "$login_code" = "401" ] && echo 1 || echo 0)"

evil_code="$(curl -s -o /dev/null -w '%{http_code}' -H "Origin: https://evil.example" "$BACKEND_URL/api/health" || echo 000)"
check "CORS origen malicioso bloqueado" "$([ "$evil_code" = "500" ] && echo 1 || echo 0)"

# Frontend
fe_code="$(curl -s -o /dev/null -w '%{http_code}' "$FRONTEND_URL")"
check "frontend home 200" "$([ "$fe_code" = "200" ] && echo 1 || echo 0)"

deep_code="$(curl -s -o /dev/null -w '%{http_code}' "$FRONTEND_URL/adminSolicitud")"
check "SPA deep link 200" "$([ "$deep_code" = "200" ] && echo 1 || echo 0)"

js_file="$(curl -sf "$FRONTEND_URL" | grep -o 'assets/index-[^"]*\.js' | head -1 || true)"
if [ -n "$js_file" ]; then
  echo "$js_file" | grep -q 'index-' && js_ok=1 || js_ok=0
  backend_in_js="$(curl -sf "$FRONTEND_URL/$js_file" | grep -o 'https://[^"`]*onrender[^"`]*' | head -1 || true)"
  echo "$backend_in_js" | grep -q 'onrender.com' && be_js=1 || be_js=0
else
  js_ok=0
  be_js=0
fi
check "frontend bundle presente" "$js_ok"
check "bundle apunta a Render" "$be_js"

echo ""
echo "=== Resumen: $pass PASS, $fail FAIL ==="
[ "$fail" -eq 0 ]
