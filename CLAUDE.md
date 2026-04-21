# MiAyudaTics - Guía de Proyecto

## Descripción y Stack
Sistema de tickets para instituciones educativas centralizando reportes de hardware/software, con rápida respuesta.
**Stack:** React 18, Vite, Node/Express, MongoDB.
**Gestor de paquetes:** pnpm estricto.

## ADRs (Architecture Decision Records)
- **ADR-001:** Strict TypeScript Migration (prohibido explícitamente el uso de `any`, `allowJs` solo temporal).
- **ADR-002:** Zod para contratos en Runtime en API.
- **ADR-003:** Feature-Based Architecture (`features/auth`, etc.).
- **ADR-004:** Ecosistema Testing: Vitest (Frontend) + Jest (Backend) + Playwright (E2E).
- **ADR-005:** Migración total a pnpm y auditoría estricta de dependencias.

## Definition of Done (Fase 1)
- Código en TS con tipos explícitos (sin any).
- Tests unitarios + integración por módulo.
- Sin errores de lint (ESLint + Prettier).
- Documentación inline JSDoc donde sea necesario.
- Módulo explicable para devs de 1 mes exp.

## Non-goals (Esta fase)
- No rediseñar DB.
- No cambiar framework (permanece React 18 y Express).
- No microservicios.
- No CI/CD.

## Estado Actual de la Migración
- **Fase 1 (Setup de Calidad):** En progreso (Tarea 1.0 parcial: Dependencias del Client auditadas).
- **Fase 2:** Pendiente.

## Convenciones de Código
- Orden de Git Hook: 1. `tsc --noEmit` (aborta si falla), 2. `eslint --fix`.
- TS Estricto, uso de Zod para validación.

## Comando Dev
Frontend: `cd client && pnpm run dev`
Backend: `cd server && pnpm run dev`
