---
name: ticket-lifecycle
description: Guides solicitud ticket lifecycle — states, asignación, solucionCaso, socket events. Use when implementing or reviewing solicitud, tipoCaso, solucionCaso, ticket estado, or consecutivoCaso in web, API, or mobile.
---

# Ticket Lifecycle (MiAyudaTIC)

## State machine (invariant)

```
solicitado → asignado → pendiente → finalizado
```

Enum: `solicitado | asignado | pendiente | finalizado`

## Role permissions

| Action | Rol |
|--------|-----|
| Create solicitud | `funcionario` |
| Assign técnico | `lider` |
| Post solucionCaso | `tecnico` |
| Delete solicitud | `lider` |

## Key paths

| Layer | Location |
|-------|----------|
| Contract | `packages/contracts/` |
| API | `server/src/features/tickets/` |
| Web | `client/src/features/` (solicitud flows) |
| Mobile | `mobile/MiAyudaTIC-Mobile/src/features/` |

## Socket events

Check `RealtimeEvents` in contracts — e.g. `actualizarSolicitud`, `nuevaNotificacion`.

## Workflow

1. Read `docs/contracts.md` § Ticket state machine
2. Update `@miayuda/contracts` if payload changes
3. Implement API with Zod + RBAC tests
4. Wire web (cookies) or mobile (Bearer) consumer
5. Verify state transitions cannot skip roles

## Tests required

- funcionario cannot assign
- tecnico cannot create solicitud for another user
- invalid state transition returns 422/403

## References

- `docs/contracts.md`
- `server/src/features/tickets/models/solicitud.ts`
