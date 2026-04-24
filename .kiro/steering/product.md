# Product Overview — MiAyudaTIC

This steering file provides Kiro with the foundational product and system context.
It is always active. Do not remove or skip it.

> Full neutral core: `docs/agentic-os.md`
> Architecture contract: `docs/ARCHITECTURE.md`

## What This System Is

MiAyudaTIC is an institutional helpdesk platform for hardware/software support management.

**User roles:**
- **Funcionario**: Reports incidents/cases
- **Técnico**: Resolves assigned cases
- **Líder TIC**: Supervises, assigns, monitors

**System structure:**
- `client/` — React 18 + Vite SPA. Deploys to **Vercel**. Root dir: `client`.
- `server/` — Node.js + Express + TypeScript API. Deploys to **Render**. Root dir: `server`.
- Monorepo managed by **pnpm workspaces**.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Realtime | Socket.io | 
| Auth | JWT via HttpOnly cookies |
| Validation | Zod |
| Testing | Jest + Supertest (backend) |
| Package manager | pnpm (strictly — no npm, no yarn) |

## Deployment Anchors

**Frontend (Vercel)**
- Root: `client` | Build: `pnpm run build` | Output: `dist/`
- Required env: `VITE_API_URL`

**Backend (Render)**
- Root: `server` | Build: `pnpm install && pnpm run build` | Start: `pnpm run start`
- Required env: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`

## Key Commands

```bash
pnpm -C client run dev      # Start frontend dev server
pnpm -C server run dev      # Start backend dev server
pnpm -C client run build    # Build + validate frontend
pnpm -C server run build    # Compile TypeScript backend
pnpm test                   # Run backend tests
```
