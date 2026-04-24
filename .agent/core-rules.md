# MiAyudaTics - Core Rules & Context (Hybrid Mission OS)

## 1. Project Context & Stack
- **Purpose**: Mesa de ayuda institucional (Soporte técnico, hardware/software).
- **Stack**: React 18, Vite, Node/Express, MongoDB, Socket.io.
- **Roles**: Funcionario (reporta), Técnico (resuelve), Líder TIC (supervisa).
- **Commands**:
  - Dev Frontend: `cd client && pnpm run dev`
  - Dev Backend: `cd server && pnpm run dev`
  - Full Test: `pnpm test` (Backend: Jest & Supertest, Frontend: None yet)
  - Build/Lint: `pnpm run build` / `pnpm run lint`

## 2. Technical Standards & Architecture Contract
> [!IMPORTANT]
> La ÚNICA fuente de verdad arquitectónica del proyecto es **`docs/ARCHITECTURE.md`**. Todas las decisiones de capas, imports, reglas de monorepo y FSD-lite deben seguir ese contrato estrictamente.

- **TypeScript**: Backend 100% migrado a TS. Migración progresiva de Frontend mandatoria.
- **Architecture**: FSD-lite estricto en Frontend (`app`, `pages`, `features`, `shared`). Monorepo con `pnpm` (`client` / `server`). Path Alias `@/` obligatorio.
- **Git Hooks**: 1. `tsc --noEmit` -> 2. `eslint --fix`.
- **CORS**: Local (`localhost:*`, `127.0.0.1:*` dinámico). Producción (whitelist). Auth usa cookies `HttpOnly` (`credentials: true` obligatorio).

## 3. Decisiones Activas Explícitas (Vigentes)
> [!IMPORTANT]
> Estas decisiones técnicas se mantienen activas y no deben removerse ni alterarse sin reevaluación.
- **allowJs: true**: Todavía activo temporalmente en el TSConfig hasta asegurar la estabilización total de la Fase 2/3.
- **Zod Obligatorio**: Validadores Zod en runtime para contratos de la API son innegociables.
- **Token Hash**: Token de reset viaja crudo por email pero se guarda con hash SHA-256 en BD.
- **Strict TDD**: El modo estricto de Test-Driven Development está `true` en el config (Jest backend).

## 4. UX/UI Philosophy (AyudaTIC 2026)
- **Visuals**: Minimalismo funcional de alta gama ("Zero Noise"). Bordes hairline, glassmorphism.
- **Colors**: Primario `#1B2A4A`, Acento `#39A900`. Fondo `#EEF0F5`, Superficie `#FFFFFF`. No saturados fuera del sistema.
- **Tailwind**: NUNCA usar `group`, `peer`, `has-[]` dentro de `@apply` en CSS. Siempre directo en el JSX.
- **Feedback**: Preferir inline. `Toasts` solo para acciones globales (éxito/error de red).

## 5. Operational Gating & Safety (Hybrid Mission OS)
> [!WARNING]
> Reglas críticas de operación para maximizar velocidad y seguridad.
- **No Historical Noise**: El historial vive en `openspec/archive/`. NO leer historial muerto sin justificación forense.
- **Misiones Aisladas**: Todo trabajo se guía por la plantilla `/mission` y los Artifacts efímeros en memoria (`task.md`).
- **Git Checkpoints Agresivos**: Debe realizarse un `git commit` como checkpoint ANTES de iniciar cualquier fase de implementación (`apply`), no solo al inicio de la misión.
- **Browser Gate Estricto**: El uso del tool de Browser está estrictamente limitado a QA visual real. NUNCA usar para debugging de código puro.
- **HITL Check**: Modificaciones en Auth, BD o Autorización requieren aprobación humana explícita.
- **Cero Warnings**: Tareas no se cierran si introducen errores de Linter o fallos de compilación TS.
