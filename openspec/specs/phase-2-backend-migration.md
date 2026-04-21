# Phase 2 — Migración de Backend a TypeScript Estricto

## Objetivo
Migrar progresivamente todos los archivos de JavaScript a TypeScript en el directorio `/server`, eliminando el uso implícito de `any` y desactivando `allowJs` una vez completada la migración. Se refactorizará la validación en runtime reemplazando Joi por Zod.

## Stack involucrado
Node.js, Express, TypeScript, Zod, Mongoose, Jest

## ADRs relacionados
- ADR-001: Strict TypeScript Migration
- ADR-002: Zod para contratos en Runtime en API

## Task Breakdown (pendiente de detallar)
- [ ] 2.1 Migración de Modelos Mongoose
- [ ] 2.2 Migración de Rutas y Controladores
- [ ] 2.3 Reemplazo de Joi por Zod en validadores
- [ ] 2.4 Refactorización de utilidades y middlewares
- [ ] 2.5 Eliminación de `allowJs: true` en `server/tsconfig.json` y limpieza de warnings

## Acceptance Criteria
- 100% de los archivos del backend son `.ts`.
- Ningún endpoint pierde funcionalidad durante la migración (verificable vía endpoints manuales/automáticos).
- Zod valida todos los esquemas correctamente.

## Definition of Done
- No quedan archivos `.js` en `server/src` o rutas principales (solo en configuraciones raíz).
- El servidor arranca sin errores de compilación (`tsc --noEmit` exitoso) y sin warnings temporales de eslint.

## Estado: 🔜 Pendiente
