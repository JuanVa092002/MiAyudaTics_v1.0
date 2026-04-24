# Repository Structure

> Kiro reads the filesystem directly — this file anchors semantics, not content.
> Full index: `docs/agentic-os.md` §10

## Root

| Directory / File | Role |
|------------------|------|
| `client/` | React/Vite SPA → Vercel |
| `server/` | Node/Express/TS API → Render |
| `docs/ARCHITECTURE.md` | Architecture contract ⭐ |
| `docs/agentic-os.md` | Neutral OS core ⭐ |
| `openspec/config.yaml` | Phase tracker (source of truth for current phase) ⭐ |
| `openspec/specs/` | Phase specifications |
| `openspec/archive/` | Completed phase history (forensic only) |
| `.agent/` | Antigravity adapter — do not edit |
| `.cursor/rules/` | Cursor adapter |
| `.kiro/steering/` | Kiro adapter (here) |
| `pnpm-workspace.yaml` | Monorepo workspace config |

## Key File Index

| Need | File |
|------|------|
| Architecture rules | `docs/ARCHITECTURE.md` |
| Current phase status | `openspec/config.yaml` |
| OS principles | `docs/agentic-os.md` |
| Vercel deploy | `docs/deployment/vercel.md` |
| Render deploy | `docs/deployment/render.md` |
| Mission template | `.agent/mission-template.md` |
