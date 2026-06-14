# MiAyudaTIC — Agent Operating System

> Cursor entrypoint. Canonical detail lives in `docs/`. Code wins on conflict.

## Cursor project layout

| Settings | Path | Purpose |
|----------|------|---------|
| **Project instructions** | `AGENTS.md` (this file) | Persistent project context |
| **Rules** | [`.cursor/rules/`](.cursor/rules/) | Always-on + file-scoped guardrails |
| **Subagents** | [`.cursor/agents/`](.cursor/agents/) | 6 roles + QA subprocess |
| **Skills** | [`.cursor/skills/`](.cursor/skills/) | Domain workflows on demand |
| **Hooks** | [`.cursor/hooks.json`](.cursor/hooks.json) | Lint, contract sync, handoff reminder |

## Start here

| Read first | Purpose |
|------------|---------|
| [`docs/product.md`](docs/product.md) | What & why — ICP, metrics, roadmap |
| [`docs/contracts.md`](docs/contracts.md) | Invariants & RBAC |
| [`docs/architecture.md`](docs/architecture.md) | System, deploy, security, mobile API |
| [`docs/agents.md`](docs/agents.md) | 6 roles + review matrix |
| [`docs/handoff-template.md`](docs/handoff-template.md) | Required output on every workstream |

**Also:** [`docs/design-system.md`](docs/design-system.md), [`docs/analytics.md`](docs/analytics.md), [`docs/quality-bar.md`](docs/quality-bar.md)

**Code truth:** [`archive/audits/`](archive/audits/) when docs conflict.

## Three surfaces (never mix in one workstream)

| Surface | Path | Rule | Subagent |
|---------|------|------|----------|
| Web | `client/` | `60-web-scope` | `product-engineer-web` |
| Platform | `server/`, `packages/contracts/` | `70-platform-scope` | `product-engineer-platform` |
| Mobile native | `mobile/MiAyudaTIC-Mobile/` | `50-mobile-scope` | `mobile-engineer` |

Cross-surface work → split PRs or invoke `founder-cto` for sequencing.

## Six roles (one per chat)

Invoke by name in Cursor chat or delegate to the subagent:

| # | Role | Subagent file | Primary scope |
|---|------|---------------|---------------|
| 1 | Founder-CTO | [`founder-cto.md`](.cursor/agents/founder-cto.md) | Architecture, HITL, release go/no-go |
| 2 | Design Engineer | [`design-engineer.md`](.cursor/agents/design-engineer.md) | Premium UX/UI web + shared mobile UI |
| 3 | Product Engineer Web | [`product-engineer-web.md`](.cursor/agents/product-engineer-web.md) | Vertical web features + metrics |
| 4 | Product Engineer Platform | [`product-engineer-platform.md`](.cursor/agents/product-engineer-platform.md) | API, contracts, RBAC |
| 5 | Mobile Engineer | [`mobile-engineer.md`](.cursor/agents/mobile-engineer.md) | Expo field experience |
| 6 | AI Ops | [`ai-ops.md`](.cursor/agents/ai-ops.md) | Rules, skills, hooks, CI, docs OS |

Full definitions: [`docs/agents.md`](docs/agents.md)

### Example invocation

```
Use the mobile-engineer subagent to implement funcionario solicitud create.
Context: docs/contracts.md, branch feature/mobile-solicitud
Boundary: mobile/MiAyudaTIC-Mobile only
```

## QA / Review (subagent — not a permanent role)

Invoke **`qa-premerge`** before merge when the change touches: auth, RBAC, contracts, mobile, deploy, or >200 LOC.

```
Use the qa-premerge subagent on this branch diff.
```

Output: P0/P1/P2 list and Go/No-Go. **P0 must be zero to merge.**

For deep security/reliability passes, also use user-level `review-risk` + `review-reliability` (Task tool).

## Non-negotiables

1. Declare **role + scope** (in/out) before editing.
2. Complete [`docs/handoff-template.md`](docs/handoff-template.md) when done.
3. **HITL stop** — auth, JWT, schema, deploy, new deps, contract breaks → ask Founder-CTO.
4. pnpm only. No Flutter legacy (`mobile_flutter/`).
5. One workstream per chat; prefer PRs < 200 LOC.

## Repo map

| Path | Surface |
|------|---------|
| `client/` | Web (Vercel) |
| `server/` | API (Render) |
| `mobile/MiAyudaTIC-Mobile/` | Official mobile (Expo) |
| `packages/contracts/` | `@miayuda/contracts` |

## Verify (before handoff)

```bash
pnpm -C server run typecheck && pnpm -C server run test && pnpm -C server run build   # if server
pnpm -C client run typecheck && pnpm -C client run build                               # if client
cd mobile/MiAyudaTIC-Mobile && pnpm typecheck                                          # if mobile
```

## Skills

Project skills in [`.cursor/skills/`](.cursor/skills/). Invoke by name or trigger in your prompt:

| Skill | Use when |
|-------|----------|
| `ticket-lifecycle` | solicitud, estados, asignación, solucionCaso |
| `rbac-review` | auth, checkRol, nuevo endpoint |
| `mobile-field-ux` | solicitud móvil, cámara, multipart |
| `design-system` | UI, tokens SENA, premium bar |
| `release-readiness` | deploy, smoke, go/no-go |
| `docs-handoff` | cerrar workstream, transferir |

## Rules index

| Rule | Scope |
|------|-------|
| `00-founder-os` | Always — roles, repo map |
| `10-product-context` | Always — ICP, mobile policy |
| `30-handoffs` | Always — delivery discipline |
| `20-engineering-standards` | `client/`, `server/`, `mobile/`, `packages/` |
| `40-design-system` | Web + mobile UI |
| `50-mobile-scope` | `mobile/MiAyudaTIC-Mobile/**` |
| `60-web-scope` | `client/**` |
| `70-platform-scope` | `server/**`, `packages/**` |

## Prod URLs

- Web: `https://miayudatics.vercel.app`
- API: `https://miayudatics-v1-0.onrender.com`
