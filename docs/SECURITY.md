# Seguridad — MiAyudaTIC

## Reportar vulnerabilidades

Envía un correo al equipo líder TIC con:

- Descripción del hallazgo
- Pasos para reproducir
- Impacto estimado

No publiques vulnerabilidades en issues públicos hasta coordinar mitigación.

## Controles implementados

- Autenticación JWT en cookie `httpOnly` **y** `Authorization: Bearer` (móvil)
- Socket.IO autenticado (cookie, Bearer o `auth.token`)
- RBAC por rol en rutas API
- Rate limiting en login, registro, recuperación de contraseña y **uploads** (20/15min)
- Validación Zod en entradas críticas
- CORS restringido por `CLIENT_URL` / `CORS_ORIGINS`

## Rotación de secretos

| Secreto | Dónde rotar |
|---------|-------------|
| `JWT_SECRET` | Render env + invalidar sesiones activas |
| `DB_URI` | MongoDB Atlas → Database Access |
| `BREVO_API_KEY` | Brevo dashboard |

Tras rotar, redeploy del backend en Render.
