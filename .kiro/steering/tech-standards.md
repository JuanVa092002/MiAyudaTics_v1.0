# Technical Standards & Architecture

This steering file enforces non-negotiable technical rules.
It is always active.

> Architecture source of truth: `docs/ARCHITECTURE.md`

## Frontend Architecture — FSD-lite

Layer dependency is **strictly unidirectional**. No exceptions.

```
app → pages → features → shared
```

### Layer Rules

**`shared/`** — Foundation
- Zero dependencies on any other layer
- Contains: generic UI components, pure utilities, design tokens, generic hooks
- If something needs to know about features or pages → it doesn't belong in shared

**`features/`** — Domain
- Only imports from `shared`
- Cross-feature imports are **forbidden**
- If two features share logic → promote it to `shared`
- Contains: controllers, domain state, API calls, feature-specific components

**`pages/`** — Composition (Official layer)
- Imports from `features` and `shared`
- A page CANNOT import another page
- Contains: route-level composition of layouts and features

**`app/`** — Orchestration (Special layer)
- Imports from `pages`, `features`, `shared`
- Contains ZERO business logic
- Contains: providers, router setup, global CSS, app-level config

**Import syntax — mandatory:**
```ts
// ✅ Correct
import { AuthContext } from '@/app/providers/Auth.context'
import { Button } from '@/shared/components/Button'

// ❌ Forbidden
import { AuthContext } from '../../../context/Auth.context'
import { Button } from '../../components/Button'
```

## Backend Architecture

```
server/src/
├── core/        → Express factory + route registry
├── features/    → domain modules (controllers, models, routes)
├── shared/      → middleware, utils, validators, config, types
└── index.ts     → entrypoint
```

- New domain logic → `server/src/features/<name>/`
- Cross-feature logic → `server/src/shared/`
- `core/` → wire-up only, never business logic

## TypeScript Rules

- Backend: 100% TypeScript. `allowJs: false`.
- Frontend: all NEW files must be `.tsx`. Existing `.jsx` migrated progressively.
- `any` is forbidden everywhere.
- Use proper interfaces or `unknown` + type guards.

## Validation Rules
- Zod schemas mandatory for all API runtime contracts
- Validate request body, params, and query before any DB operation
- Co-locate Zod schemas with the feature that owns them

## Auth & Security Rules
- JWT stored in `HttpOnly` cookies only — never `localStorage` or `sessionStorage`
- CORS dev: dynamic `localhost:*` + `127.0.0.1:*` via regex
- CORS prod: explicit whitelist only
- Never use `origin: '*'` with `credentials: true`
- Reset tokens: raw token in email, SHA-256 hash stored in DB

## Quality Gates
Every task is complete only when:
1. `pnpm -C client run build` exits 0
2. `pnpm -C server run build` exits 0
3. Zero new linter errors
4. TypeScript compiles without errors
