# Vercel Deployment Guide (Frontend)

Este documento describe la configuración de despliegue para el frontend en Vercel, optimizado para nuestra arquitectura de monorepo con `pnpm`.

## Configuración de Proyecto en Vercel

1.  **Framework Preset:** Vite
2.  **Root Directory:** `client` (Este es el paso más crítico para que Vercel no intente buildear el backend).
3.  **Build Command:** `pnpm run build` (Opcional, Vercel suele detectarlo, pero es mejor forzarlo).
4.  **Output Directory:** `dist`
5.  **Install Command:** `pnpm install`

## Manejo del Monorepo

Vercel detectará el archivo `pnpm-lock.yaml` en la raíz del repositorio. Dado que hemos configurado el `Root Directory` como `client`, Vercel instalará las dependencias necesarias.

## Variables de Entorno

Configura en Vercel (Settings → Environment Variables):

| Variable | Ejemplo producción |
|----------|-------------------|
| `VITE_BACKEND_URL` | `https://miayudatics-api.onrender.com` |

Alternativa compatible: `VITE_API_URL` con `/api` al final  
(`https://miayudatics-api.onrender.com/api`).

Copia `client/.env.example` para local y `client/.env.production.example` como referencia.

## Rewrite Rules (Si usas React Router)

Si experimentas errores 404 al recargar la página en rutas específicas, asegúrate de crear un archivo `client/vercel.json` con lo siguiente:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
*(Nota: En Vite SPA, este es el comportamiento por defecto de la plataforma Vercel, pero se incluye por si fuera necesario).*
