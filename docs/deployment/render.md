# Render Deployment Guide (Backend)

Este documento describe la configuración de despliegue para el backend en Render (Web Service), usando nuestra arquitectura de monorepo con `pnpm`.

## Configuración de Web Service en Render

1.  **Environment:** `Node`
2.  **Root Directory:** `server` (Esto asegura que el servicio se ejecute en el contexto de la carpeta del backend).
3.  **Build Command:** `pnpm install --frozen-lockfile && pnpm run build`
    *   *Nota: Dado que estamos usando `pnpm`, asegúrate de tener pnpm instalado en tu entorno o definir `PNPM_VERSION` si Render lo requiere.*
4.  **Start Command:** `pnpm run start`

## Manejo del Monorepo

Al configurar `Root Directory` como `server`, el comando `pnpm install` leerá el `package.json` de la carpeta `server`, pero se apalancará en el `pnpm-workspace.yaml` de la raíz si se requiere subir el contexto.

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

`CLIENT_URL` y `CORS_ORIGINS` deben coincidir con la URL del frontend en Vercel.

## Detalles Adicionales

*   El código de producción de Typescript será compilado en la carpeta `server/dist`.
*   El comando de inicio (`pnpm run start`) ejecuta `node dist/index.js`, que es nuestro nuevo punto de entrada refactorizado para garantizar que no haya dependencias de desarrollo (`ts-node-dev`) en producción.
