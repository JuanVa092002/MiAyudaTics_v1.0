# Seguridad — MiAyudaTIC

## Reportar vulnerabilidades

Envía un correo al equipo líder TIC con:

- Descripción del hallazgo
- Pasos para reproducir
- Impacto estimado

No publiques vulnerabilidades en issues públicos hasta coordinar mitigación.

## Controles implementados

- Autenticación JWT en cookie `httpOnly`
- RBAC por rol en rutas API
- Rate limiting en login, registro y recuperación de contraseña
- Validación Zod en entradas críticas
- CORS restringido por `CLIENT_URL` / `CORS_ORIGINS`

## Rotación de secretos

| Secreto | Dónde rotar |
|---------|-------------|
| `JWT_SECRET` | Render env + invalidar sesiones activas |
| `DB_URI` | MongoDB Atlas → Database Access |
| `BREVO_API_KEY` | Brevo dashboard |

Tras rotar, redeploy del backend en Render.
