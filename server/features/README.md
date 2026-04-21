# Feature-Based Architecture

## Regla principal
Cada feature es un módulo completamente encapsulado.
Todo lo que pertenece a una feature vive dentro de su carpeta.

## Estructura interna de cada feature

### Backend (/server/features/nombre-feature/)
nombre-feature/
├── nombre-feature.routes.ts    ← endpoints Express
├── nombre-feature.controller.ts ← lógica HTTP (request/response)
├── nombre-feature.service.ts   ← lógica de negocio
├── nombre-feature.model.ts     ← schema Mongoose
├── nombre-feature.schema.ts    ← schema Zod (validación)
├── nombre-feature.types.ts     ← interfaces y tipos TS
└── nombre-feature.test.ts      ← tests unitarios e integración

### Frontend (/client/src/features/nombre-feature/)
nombre-feature/
├── components/     ← componentes React de esta feature
├── hooks/          ← custom hooks
├── services/       ← llamadas a la API
├── types.ts        ← interfaces TS
└── index.ts        ← barrel export (exportaciones públicas)

## Regla de dependencias
- Una feature PUEDE importar desde features/shared/
- Una feature NO PUEDE importar directamente de otra feature
- Si dos features necesitan algo en común → va a shared/
- Los imports siempre van por el index.ts (barrel), nunca directos

## Por qué esta arquitectura
Cuando quieras agregar una nueva feature, creas su carpeta,
sigues la estructura y no tocas nada de las demás features.
Cuando quieras eliminar una feature, borras su carpeta y listo.
Esto hace que el proyecto sea extremadamente fácil de extender
y de entender para alguien nuevo.
