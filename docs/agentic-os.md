# MiAyudaTIC — Agentic Operating System (Neutral Core)

> **This document is IDE-agnostic.** It defines the philosophy, principles, and persistent operational knowledge that all AI agents (Antigravity, Cursor, Kiro) consume via their native adapters.
>
> - **Antigravity** reads this via `.agent/core-rules.md` + Engram memory
> - **Cursor** reads this via `.cursor/rules/`
> - **Kiro** reads this via `.kiro/steering/`
>
> Do NOT edit IDE-specific adapters — edit this document. Adapters are read-only projections of this core.

---

## 1. System Identity

**Project**: MiAyudaTIC v1.0  
**Type**: Institutional helpdesk (Mesa de Ayuda). Hardware/software support.  
**Roles**: Funcionario (reporter), Técnico (resolver), Líder TIC (supervisor).  
**Monorepo**: `client/` (React/Vite → Vercel) + `server/` (Node/Express/TS → Render)  
**Package Manager**: `pnpm` — strictly. No `npm`, no `yarn`.

---

## 2. Architecture Contract

**Source of truth**: `docs/ARCHITECTURE.md` — all structural decisions live there.

### Frontend (FSD-lite)
Layer dependency flows **strictly downward**. No upward imports. No circulars.

```
app → pages → features → shared
```

| Layer | Can import from | Cannot import from |
|-------|----------------|-------------------|
| `shared/` | nothing | features, pages, app |
| `features/` | shared | other features, pages, app |
| `pages/` | features, shared | other pages, app |
| `app/` | pages, features, shared | (no business logic here) |

**Critical rules**:
- Path alias `@/` is mandatory. No `../../../` imports.
- `app/` contains zero business logic — only providers, router, global config.
- Cross-feature imports are forbidden. Promote to `shared/` instead.
- `pages/` are sovereign routing leaves — no page imports another page.

### Backend (Feature-based)
```
server/src/
├── core/        → express app + route registry
├── features/    → domain modules (controllers, models, routes)
├── shared/      → middleware, utils, validators, config, types
└── index.ts     → entrypoint (boots server + DB)
```

---

## 3. Technical Standards

| Standard | Rule |
|----------|------|
| TypeScript | Backend: 100% TS. Frontend: progressive migration, all NEW files must be `.tsx` |
| Imports | `@/` alias mandatory. Never `any`. |
| Validation | Zod is mandatory for all API runtime contracts |
| Auth | Cookies `HttpOnly`. `credentials: true`. Never `origin: *` with credentials. |
| CORS | Dev: `localhost:*` + `127.0.0.1:*` via regex. Prod: closed whitelist. |
| Token security | Reset token hashed SHA-256 in DB. Raw token only in email. |
| Testing | Backend: Jest + Supertest. `strict_tdd: true`. Frontend: pending. |
| Git hooks | 1. `tsc --noEmit` → 2. `eslint --fix`. Both must pass. |

---

## 4. Commands

```bash
# Frontend
cd client && pnpm run dev          # dev server
pnpm -C client run build           # production build
pnpm -C client run lint            # linter

# Backend
cd server && pnpm run dev          # dev server (ts-node-dev)
pnpm -C server run build           # tsc compile → dist/
pnpm -C server run start           # node dist/index.js

# Monorepo
pnpm test                          # backend tests (Jest)
```

---

## 5. Operational Principles (Hybrid Mission OS)

These principles govern how agents operate regardless of IDE:

### 5.1 Mission Isolation
Each unit of work is a **Mission**: a focused, bounded task with a declared scope. Agents must:
- Declare what they will do before doing it.
- Work within the declared scope — no opportunistic refactoring.
- Stop and report when scope expands unexpectedly.

### 5.2 Context Minimization
Load **only** what the current mission requires. Never read dead history without forensic justification. Stable context lives in this document — volatile context lives in working memory only.

### 5.3 HITL Gates (Human-In-The-Loop)
The following actions require **explicit human approval** before execution:
- Changes to Auth, Authorization, or DB schema
- Structural refactoring of `client/src/` or `server/src/` root layers
- Any migration that moves files between FSD layers
- Deployment configuration changes

### 5.4 Git Checkpoint Policy
A `git commit` checkpoint is **mandatory** before starting any `apply` phase. Not at the start of the session — before each implementation batch.

### 5.5 Zero Noise Rule
A task is not complete until:
- `pnpm build` exits with **0 errors** and **0 unresolved imports**
- No new linter errors introduced
- TypeScript compilation passes cleanly

### 5.6 Verification Before Cleanup
Never clean legacy files without a prior smoke test confirming the refactored code compiles and routes correctly.

---

## 6. Phase State

**Source of truth**: `openspec/config.yaml` — always read from there, never derive from memory.

Do not hardcode phase status in this document. Agents must check `openspec/config.yaml` before any phase-related work.

---

## 7. Active Decisions (Do Not Override Without Review)

| Decision | Rationale |
|----------|-----------|
| `allowJs: true` in client tsconfig | Temporary — pending full `.jsx` → `.tsx` migration |
| No shared `@miayuda/types` package yet | Simplicity for Vercel/Render dual-deploy. Review at Phase 4. |
| `pages/` is an official FSD layer | Separation between routing intent and domain capability |
| Socket.io present but not migrated | Deferred to Phase 4 |

---

## 8. UX/UI System

| Token | Value |
|-------|-------|
| Primary | `#1B2A4A` |
| Accent | `#39A900` |
| Background | `#EEF0F5` |
| Surface | `#FFFFFF` |
| Philosophy | Zero Noise — hairline borders, glassmorphism, no saturated colors outside system |
| Feedback | Inline preferred. Toasts only for global network actions. |
| Tailwind | Never use `group`, `peer`, `has-[]` inside `@apply`. Always direct in JSX. |

---

## 9. Deployment Anchors

### Frontend → Vercel
- Root Directory: `client`
- Build: `pnpm run build`
- Output: `dist/`
- Env: `VITE_API_URL`

### Backend → Render
- Root Directory: `server`
- Build: `pnpm install && pnpm run build`
- Start: `pnpm run start` (→ `node dist/index.js`)
- Env: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`

---

## 10. Key File Index

| File | Purpose |
|------|---------|
| `docs/ARCHITECTURE.md` | Authoritative architecture contract |
| `docs/agentic-os.md` | This file — neutral OS core |
| `.agent/core-rules.md` | Antigravity adapter (do not edit for other IDEs) |
| `.cursor/rules/` | Cursor adapter |
| `.kiro/steering/` | Kiro adapter |
| `.atl/skill-registry.md` | Skill registry for Antigravity delegations |
| `openspec/config.yaml` | SDD phase tracker |
| `openspec/specs/` | Phase specifications |
| `.agent/mission-template.md` | Mission launch template |
