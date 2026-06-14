# MiAyudaTIC Mobile

App móvil React Native (Expo) para MiAyudaTIC — mesa de servicio TIC (auth: welcome, login, registro, recuperación de contraseña).

El backend y el frontend web viven en **otro repositorio**. Esta carpeta es solo el cliente mobile.

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- [Expo Go](https://expo.dev/go) en el dispositivo/emulador (desarrollo), o Android Studio para builds nativos

## Configuración

```bash
cp .env.example .env
```

Edita `.env` si el API no es producción:

```
EXPO_PUBLIC_API_URL=https://miayudatics-v1-0.onrender.com
```

## Instalación y ejecución

```bash
pnpm install
pnpm typecheck
pnpm start
```

- **Android (Expo Go):** escanea el QR o pulsa `a` en la terminal.
- **Android (build nativo):** primero `npx expo prebuild`, luego `pnpm android`.

## Notas

- El primer request al API en Render puede tardar 30–60 s (cold start).
- No copies `.env` a repositorios públicos; usa solo `.env.example` como plantilla.
- Carpetas `android/` e `ios/` se generan con `expo prebuild` y no van en el paquete portable.

## Estructura

```
app/          # Pantallas (Expo Router)
src/          # Auth, API, UI compartida
assets/       # Iconos SENA e imágenes de pantallas
```
