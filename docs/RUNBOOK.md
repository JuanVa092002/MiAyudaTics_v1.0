# Runbook — MiAyudaTIC

## Health check

```bash
curl https://TU-BACKEND.onrender.com/api/health
```

Respuesta esperada: `{ "status": "ok", "database": "connected" }`

## Deploy

1. Merge a `main` → CI verde
2. Vercel auto-deploy (`client/`)
3. Render auto-deploy (`server/`)

## Rollback

- **Vercel:** Deployments → Promote previous deployment
- **Render:** Manual Deploy → commit anterior

## Si MongoDB Atlas cae

- Verificar status en Atlas
- Revisar `DB_URI` y IP allowlist
- El endpoint `/api/health` devolverá `503`

## Si Brevo falla

- Los flujos de app siguen; los correos se registran en logs
- Verificar `BREVO_API_KEY` y IP autorizada en Brevo

## Backup

- MongoDB Atlas: activar backups continuos en el cluster de producción
- **Evidencias:** almacenadas en Cloudinary (`CLOUDINARY_*` en Render). No dependen del disco de Render
- Respaldo local (`STORAGE_PATH`) solo aplica si Cloudinary no está configurado
