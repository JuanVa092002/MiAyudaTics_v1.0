# Reglas de Proyecto Cursor (MiAyudaTics)
Ver contexto completo en CLAUDE.md en la raÃ­z.
1. STACK: React 18, Node/Express, MongoDB, pnpm estricto.
2. TDD: Jest (Backend), Vitest (Frontend). Escribir test primero.
3. TYPESCRIPT: Strict mode obligatorio. Prohibido `any`. `allowJs` es deuda temporal.
4. ARQUITECTURA: Feature-based folders (ej. features/auth).
5. VALIDACIÃ“N: Usar Zod para todo contrato de runtime.
6. GIT HOOKS: tsc --noEmit debe pasar y abortar en caso de fallo antes de eslint.
7. ESTADO: MigraciÃ³n JS->TS en Fase 1 (Setup de calidad).

