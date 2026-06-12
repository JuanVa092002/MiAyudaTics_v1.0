# Feature-Based Architecture (Frontend)

Cada feature es un módulo encapsulado. Todo lo que pertenece a un dominio vive dentro de su carpeta.

## Estructura

```
features/nombre-feature/
├── api/           # Llamadas HTTP (usa @/shared/api/axios)
├── components/    # UI del dominio
├── context/       # Estado local del dominio (opcional)
├── hooks/         # Hooks del dominio
├── types.ts       # Tipos específicos (opcional; preferir @/shared/types)
└── index.ts       # Barrel export — API pública de la feature
```

## Features actuales

| Feature | Responsabilidad |
|---------|-----------------|
| `auth` | Login, registro, sesión, recuperación de contraseña |
| `tickets` | Solicitudes, resolución de casos, nav técnico |
| `users` | Técnicos, nav admin, perfil |
| `ambientes` | Ambientes de formación |
| `estadisticas` | Gráficas admin |
| `notifications` | Notificaciones y hook `useNotificaciones(enabled)` |

## Reglas de dependencias (FSD-lite)

```
app → pages → features → shared
```

- Una feature **solo** importa de `shared/`
- **Prohibido** cross-import entre features
- Lógica compartida entre features → sube a `shared/` o se orquesta en `app/`
- Imports públicos vía `index.ts` (barrel)

## Capas hermanas

- `shared/` — UI kit, axios, tipos globales
- `pages/` — Composición por ruta (sin lógica de negocio pesada)
- `app/` — Router, layouts, providers globales
