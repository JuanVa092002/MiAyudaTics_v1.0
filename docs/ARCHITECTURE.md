# Contrato Arquitectónico Oficial MiAyudaTIC v1.0

Este documento es la **ÚNICA FUENTE DE VERDAD** técnica y arquitectónica del proyecto. Cualquier decisión de diseño, estructura de carpetas, o refactorización debe obedecer estrictamente a estas reglas.

## 1. Official Architecture Contract

1.  **Modelo de Repositorio (MANDATORIO)**: El proyecto es un **Monorepo gestionado por pnpm workspaces**. No se permiten instalaciones con `npm` o `yarn` que generen lockfiles secundarios.
2.  **Aislamiento de Entornos (MANDATORIO)**: El código de `client` y `server` debe permanecer física y lógicamente separado. Ningún archivo de `server` puede importar de `client` ni viceversa.
3.  **Tipado Estricto (MANDATORIO)**: Todo nuevo archivo debe ser `.ts` o `.tsx`. Se prohíbe explícitamente el uso de `any`.
4.  **Invariabilidad del Root (OBLIGATORIO)**: El directorio raíz solo contiene configuración de orquestación. El código fuente vive exclusivamente en `/client/src` o `/server/src`.
5.  **Consistencia de Datos (TEMPORAL)**: Se permite la duplicación de Interfaces entre frontend y backend hasta la creación de un paquete `@miayuda/types` (Sujeto a revisión en Fase 4).

## 2. Layer Rules (Frontend)

El Frontend adopta una estructura de capas rígida basada en FSD-lite, con restricciones de cruce innegociables. El flujo de dependencias es estrictamente unidireccional y jerárquico.

*   **`shared/` (Fundación)**: UI Kit agnóstico, utilidades puras, hooks genéricos.
    *   **Restricción**: **No puede depender de NINGUNA otra capa del sistema** (ni de `features`, ni de `pages`, ni de `app`). Su independencia debe ser total.
*   **`features/` (Dominio)**: Lógica de negocio, estados locales y componentes atados a un caso de uso (ej. `auth`, `tickets`).
    *   **Dependencia**: Solo puede depender de `shared`.
    *   **Restricción**: **Prohibido el cross-importing entre features**. Una feature no puede importar absolutamente nada de otra feature. (Si dos features comparten lógica, esta sube a `shared` o se orquesta en `app`).
*   **`pages/` (Composición y Enrutamiento)**: Punto de entrada por ruta. Responsable de ensamblar el Layout y las Features. Es una **capa oficial y definitiva**.
    *   **Dependencia**: Puede importar de `features` y `shared`.
    *   **Restricción**: **Una `page` no puede importar de otra `page`**. Las páginas son hojas independientes del árbol de rutas.
*   **`app/` (Orquestación y Configuración Global)**: El "pegamento" que inicializa la aplicación (Providers, Router, Global CSS, Layouts Base).
    *   **Dependencia**: Puede importar de `pages`, `features` y `shared`.
    *   **Restricción**: **No puede contener lógica de negocio**. Solo debe poseer lógica de inicialización y orquestación.

> [!CAUTION]
> **Toda importación circular está estrictamente prohibida**. `App` y `Shared` son capas especiales: `App` conoce a todo el mundo pero nadie conoce a `App`. `Shared` no conoce a nadie, pero todo el mundo conoce a `Shared`.

## 3. Frontend Migration Policy

La migración de `client/src` se ejecutará bajo el siguiente esquema:
*   **Definitivo**: Estructura bajo `src/app`, `src/shared`, `src/features` y `src/pages`.
*   **Transitional**: Archivos `.jsx` o `.js` movidos a las nuevas carpetas pero pendientes de refactor a `.tsx`.
*   **Legacy**: Carpetas de la estructura v0 (`src/routes/`, `src/context/`, `src/components/`, `src/layouts/`). Serán vaciadas paulatinamente.
*   **Candidatos a Eliminación**: Archivos legacy cuyo código haya sido portado a un nuevo componente bajo `features` o `shared`.

## 4. TypeScript Migration Policy

1.  **Fase 1 (Entrypoints)**: Migrar `main.jsx` y `App.jsx`.
2.  **Fase 2 (Shared UI)**: Migrar componentes base.
3.  **Fase 3 (Features/Pages)**: Migrar lógica de dominio y rutas.
4.  **Validación Definitiva**: Un archivo solo se considera "Migrado" cuando tiene extensión `.tsx`, no contiene `any`, y `pnpm run typecheck` pasa limpiamente para ese archivo aislado.

## 5. Deployment Policy

La arquitectura productiva en la nube se basa en las siguientes anclas estáticas:
*   **Frontend (Vercel)**
    *   **Root Directory**: `client`
    *   **Build**: `pnpm run build` (Salida a `dist/`)
    *   **Env Variables**: Requiere `VITE_API_URL`.
*   **Backend (Render Web Service)**
    *   **Root Directory**: `server`
    *   **Build**: `pnpm install && pnpm build`
    *   **Start**: `pnpm run start` (Llama a `node dist/index.js`)
*   **CI/CD**: Las intervenciones manuales en los dashboards de Vercel o Render para alterar builds están prohibidas; todo se parametriza en el repo.

## 6. Mobile API Platform (Fase 4)

El backend expone una superficie **stack-agnóstica** para apps nativas futuras:

*   **Auth:** JWT vía `Authorization: Bearer` en REST y `auth.token` en Socket.IO (cookies opcionales para web).
*   **Realtime:** Socket.IO con rooms `user:{id}`; eventos tipados en `packages/contracts` (`@miayuda/contracts`).
*   **Medios:** `POST /api/media/upload` y multipart en solicitudes; Cloudinary en producción; HEIC/JPEG hasta `MEDIA_MAX_BYTES`.
*   **Documentación:** `docs/mobile-integration.md`, spec `openspec/specs/phase-4-mobile-platform.md`.
*   **Validación:** `pnpm run smoke:mobile-api` y `pnpm run smoke:mobile-client` (con credenciales de prueba).

## 7. Enforcement Rules

1.  **Alias Exclusivo (`@/`)**: Es el único alias permitido. Prohibido usar `../../../` para evitar fragilidad en el refactor.
2.  **CSS Modular**: Prohibido importar componentes a partir de `index.css` locales de manera anidada. Estilizar via Tailwind classes directamente.
3.  **Aprobación Pre-Refactor**: Antes de cualquier cambio estructural que involucre carpetas raiz en `client/src/` o `server/src/`, es obligatorio crear/actualizar un spec en `openspec/` y aprobarlo explícitamente.
4.  **Zero Warnings Rule**: Toda fase o tarea debe finalizar con `pnpm build` lanzando **0 errors** y **0 resolve warnings**. Un build sucio es un merge cancelado.
