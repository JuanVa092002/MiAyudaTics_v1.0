---
name: mobile-field-ux
description: Field UX patterns for MiAyudaTIC Expo app — solicitud create, camera/evidence, multipart upload, socket reconnect, offline draft strategy. Use for mobile/MiAyudaTIC-Mobile screens and native workflows.
---

# Mobile Field UX (MiAyudaTIC)

## Scope

`mobile/MiAyudaTIC-Mobile/` only — never web SPA patterns.

## Auth

- `expo-secure-store` for JWT
- `EXPO_PUBLIC_API_URL` — never hardcode `miayudatics-v1-0.onrender.com` in source

## Field bar

| Requirement | Target |
|-------------|--------|
| Photo evidence | < 3 taps from list to capture |
| Lists | Virtualized for técnico casos |
| Errors | Alert + retry, not silent fail |
| Cold start | Socket reconnect with backoff |
| Líder admin | Blocked at app layer |

## Multipart

Follow `docs/architecture.md` § Mobile API integration for evidencias upload.

## Stage 1 (current priority)

1. Funcionario: create solicitud + photo
2. Técnico: casos list, update estado, solucionCaso

## Verify

```bash
cd mobile/MiAyudaTIC-Mobile && pnpm typecheck
```

Manual test on emulator/device — document OS in handoff.

## Server coordination

API changes → `product-engineer-platform` handoff first; do not edit `server/` from mobile workstream.

## Reuse

`mobile/MiAyudaTIC-Mobile/src/shared/ui/*` before new components.
