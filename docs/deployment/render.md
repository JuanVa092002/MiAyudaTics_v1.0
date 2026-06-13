# Render Deployment Guide (Backend)

Este documento describe la configuración de despliegue para el backend en Render (Web Service), usando nuestra arquitectura de monorepo con `pnpm`.

## Configuración de Web Service en Render

1.  **Environment:** `Node`
2.  **Root Directory:** *(vacío — raíz del monorepo)* para que `pnpm-lock.yaml` esté disponible
3.  **Build Command:** `pnpm install --frozen-lockfile --filter nodeproyectosena... && pnpm -C server run build`
4.  **Start Command:** `pnpm -C server run start`
5.  **Health Check Path:** `/api/health`

## Manejo del Monorepo

El `pnpm-lock.yaml` vive en la raíz. Si usas Root Directory `server` sin incluir archivos externos, el build fallará. Alternativa: Docker con `server/Dockerfile` y contexto en la raíz del repo.

## Variables de Entorno

Configura en Render (Dashboard → Environment) las mismas claves que en `server/.env.example`:

| Variable | Ejemplo producción |
|----------|-------------------|
| `NODE_ENV` | `production` |
| `PORT` | `8000` |
| `DB_URI` | `mongodb+srv://...` |
| `PUBLIC_URL` | `https://miayudatics-api.onrender.com` |
| `RENDER_URL` | `https://miayudatics-api.onrender.com` |
| `CLIENT_URL` | `https://tu-app.vercel.app` |
| `CORS_ORIGINS` | `https://tu-app.vercel.app` |
| `JWT_SECRET` | Secreto largo aleatorio |
| `BREVO_API_KEY` | Clave API de Brevo |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |
| `CLOUDINARY_FOLDER` | Carpeta raíz (ej. `miayudatics`) |
| `MEDIA_MAX_BYTES` | Límite upload (default `10485760`) |
| `REDIS_URL` | Opcional; Socket.IO multi-instancia |
| `REQUIRE_SOLICITUD_FOTO` | `true` para exigir foto en solicitudes |
| `STORAGE_PATH` | Solo si Cloudinary no está configurado (respaldo local) |

`CLIENT_URL` y `CORS_ORIGINS` deben coincidir con la URL del frontend en Vercel.

## Almacenamiento de evidencias (Cloudinary)

Con `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` configurados, las fotos de solicitudes, perfiles y evidencias se suben a Cloudinary y **persisten tras redeploy** en Render.

Sin Cloudinary, el backend guarda en `STORAGE_PATH` (disco local, efímero en Render gratis).

## Socket.IO y escalabilidad

- **Piloto (1 instancia):** rooms en memoria; sin `REDIS_URL`.
- **Multi-instancia:** añade `REDIS_URL` (Render Redis o Upstash). El servidor activa `@socket.io/redis-adapter` al arrancar.
- Apps móviles: ver `docs/mobile-integration.md` para `auth.token` y eventos realtime.

## Detalles Adicionales

*   El código de producción de Typescript será compilado en la carpeta `server/dist`.
*   El comando de inicio (`pnpm run start`) ejecuta `node dist/index.js`, que es nuestro nuevo punto de entrada refactorizado para garantizar que no haya dependencias de desarrollo (`ts-node-dev`) en producción.
