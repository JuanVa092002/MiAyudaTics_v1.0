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

Asegúrate de configurar las siguientes variables de entorno en Render:

*   `PORT`: `8000` (o el puerto que utilices).
*   `MONGO_URI`: Tu cadena de conexión a MongoDB.
*   `JWT_SECRET`: Tu secreto de autenticación.
*   `CORS_ORIGIN`: La URL de tu frontend en Vercel (ej. `https://mi-ayuda-tics.vercel.app`).
*   Cualquier otra variable de entorno definida en tu `.env` de producción.

## Detalles Adicionales

*   El código de producción de Typescript será compilado en la carpeta `server/dist`.
*   El comando de inicio (`pnpm run start`) ejecuta `node dist/index.js`, que es nuestro nuevo punto de entrada refactorizado para garantizar que no haya dependencias de desarrollo (`ts-node-dev`) en producción.
