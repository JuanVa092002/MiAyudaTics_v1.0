# MiAyudaTIC

Monorepo de la mesa de ayuda institucional SENA (CTPI-Cauca).

## Requisitos

- Node.js 22+
- pnpm 9+
- MongoDB Atlas

## Inicio rápido

```bash
pnpm install
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edita server/.env y client/.env

pnpm -C server run dev    # http://localhost:8000
pnpm -C client run dev    # http://localhost:5173
```

Seed del líder inicial (solo desarrollo):

```bash
cd server && npx ts-node --transpile-only src/scripts/seed-lider.ts
```

## Calidad

```bash
pnpm -C server run typecheck && pnpm -C server run test && pnpm -C server run build
pnpm -C client run typecheck && pnpm -C client run test && pnpm -C client run build
```

## Despliegue

- Frontend: Vercel (`client/`) — ver `docs/deployment/vercel.md`
- Backend: Render (`server/`) — ver `docs/deployment/render.md`
- CI: `.github/workflows/ci.yml`

## Documentación operativa

- `docs/SECURITY.md` — reporte de vulnerabilidades
- `docs/RUNBOOK.md` — operaciones e incidentes
- `docs/DATA-HANDLING.md` — tratamiento de datos
- `docs/ARCHITECTURE.md` — contrato técnico
