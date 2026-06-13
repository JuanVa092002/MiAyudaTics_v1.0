# Runbook — MiAyudaTIC

## Health check

```bash
curl https://TU-BACKEND.onrender.com/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "database": "connected",
  "integrations": { "cloudinary": "configured", "brevo": "configured" }
}
```

En Render, configura **Health Check Path:** `/api/health`.

Render exige **HTTP 200** en este endpoint. Si MongoDB cae en runtime, la respuesta sigue siendo 200 con `"status": "degraded"`.

Smoke automatizado post-deploy:

```bash
./scripts/smoke-prod.sh
# o: pnpm run smoke:prod
```

Ver checklist completo: `docs/deployment/production-qa-checklist.md`

## Deploy

1. Merge a `master` → CI verde
2. Vercel auto-deploy (`client/`)
3. Render auto-deploy (`server/`)
4. Ejecutar `pnpm run smoke:prod` o workflow **Post-Deploy Smoke** en GitHub Actions

## Cold start (Render free tier)

Tras ~15 min de inactividad, el backend puede tardar 30–60 s en responder. El frontend debe mostrar error de conexión recuperable; reintentar login o refrescar.

## Rollback

- **Vercel:** Deployments → Promote previous deployment
- **Render:** Manual Deploy → commit anterior

## Si MongoDB Atlas cae

- Verificar status en Atlas
- Revisar `DB_URI` y IP allowlist
- El endpoint `/api/health` devolverá `"status": "degraded"` y `"database": "disconnected"` (HTTP 200)

## Si Brevo falla

- Los flujos de app siguen; los correos se registran en logs
- Verificar `BREVO_API_KEY` y desactivar "Block unknown IP addresses" en Brevo

## Backup

- MongoDB Atlas: activar backups continuos en el cluster de producción
- **Evidencias:** almacenadas en Cloudinary (`CLOUDINARY_*` en Render). No dependen del disco de Render
- Respaldo local (`STORAGE_PATH`) solo aplica si Cloudinary no está configurado
