# MiAyudaTics - GuÃ­a de Proyecto

## DescripciÃ³n y Stack
Sistema de tickets para instituciones educativas centralizando reportes de hardware/software, con rÃ¡pida respuesta.
**Stack:** React 18, Vite, Node/Express, MongoDB.
**Gestor de paquetes:** pnpm estricto.

## ADRs (Architecture Decision Records)
- **ADR-001:** Strict TypeScript Migration (prohibido explÃ­citamente el uso de `any`, `allowJs` solo temporal).
- **ADR-002:** Zod para contratos en Runtime en API.
- **ADR-003:** Feature-Based Architecture (`features/auth`, etc.).
- **ADR-004:** Ecosistema Testing: Vitest (Frontend) + Jest (Backend) + Playwright (E2E).
- **ADR-005:** MigraciÃ³n total a pnpm y auditorÃ­a estricta de dependencias.

## Definition of Done (Fase 1)
- CÃ³digo en TS con tipos explÃ­citos (sin any).
- Tests unitarios + integraciÃ³n por mÃ³dulo.
- Sin errores de lint (ESLint + Prettier).
- DocumentaciÃ³n inline JSDoc donde sea necesario.
- MÃ³dulo explicable para devs de 1 mes exp.

## Non-goals (Esta fase)
- No rediseÃ±ar DB.
- No cambiar framework (permanece React 18 y Express).
- No microservicios.
- No CI/CD.

## Estado Actual de la MigraciÃ³n
- **Fase 1 (Setup de Calidad):** En progreso (Tarea 1.0 parcial: Dependencias del Client auditadas).
- **Fase 2:** Pendiente.

## Convenciones de CÃ³digo
- Orden de Git Hook: 1. `tsc --noEmit` (aborta si falla), 2. `eslint --fix`.
- TS Estricto, uso de Zod para validaciÃ³n.

## Commands
- **Dev**: `pnpm run dev` (from /server)
- **Test**: `pnpm test` (full suite), `pnpm run test:watch` (watch mode)
- **Coverage**: `pnpm run test:coverage`
- **Build**: `pnpm run build`
- **Lint**: `pnpm run lint` / `pnpm run format`
- **Typecheck**: `pnpm run typecheck`

## Comando Dev
Frontend: `cd client && pnpm run dev`
Backend: `cd server && pnpm run dev`

## ?? Deuda Técnica Activa
- allowJs: true ? eliminar al 100% de migración (Tarea 2.0)
- SKIP_PRE_COMMIT bypass ? eliminar al terminar Tarea 1.3
