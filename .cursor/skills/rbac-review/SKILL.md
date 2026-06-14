---
name: rbac-review
description: Reviews and implements RBAC for MiAyudaTIC — authMiddleware, checkRol, session, Bearer/cookie dual auth. Use when adding endpoints, changing roles, JWT, or permission matrix.
---

# RBAC Review (MiAyudaTIC)

## Roles

`funcionario` | `tecnico` | `lider`

## Checklist (every new protected route)

- [ ] `authMiddleware` applied
- [ ] `checkRol([...])` with minimum required roles
- [ ] Zod validates body/query/params
- [ ] IDOR: user can only access own resources unless líder/tecnico rules apply
- [ ] Vitest: 401 unauthenticated, 403 wrong role, 200/201 happy path

## Auth surfaces

| Surface | Mechanism |
|---------|-----------|
| Web `client/` | Cookie session (`withCredentials`) |
| Mobile | Bearer JWT in SecureStore |
| Server | Supports both |

## HITL

Auth, JWT secrets, session schema → Founder-CTO approval before merge.

## Workflow

1. Read `docs/contracts.md` § RBAC matrix
2. Find pattern in `server/src/shared/middleware/rol.ts`
3. Mirror tests in neighboring route test files
4. Invoke `qa-premerge` subagent before merge

## Common failures

- RBAC only in React — must be on server
- `lider` routes exposed to mobile
- Missing `activo` / `estado` checks for técnico

## Verify

```bash
pnpm -C server run test -- --grep auth
pnpm -C server run typecheck
```
