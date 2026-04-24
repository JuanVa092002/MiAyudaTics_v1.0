# Hybrid Mission OS — Operational Reference Guide

> **Version**: 1.0 — Post-compression (2026-04-24)
> **Neutral core**: `docs/agentic-os.md`
> **Architecture contract**: `docs/ARCHITECTURE.md`
> **Phase tracker**: `openspec/config.yaml`

This document is the single operational reference for engineers and agents working in the MiAyudaTIC monorepo across any IDE environment.

---

## 1. Operating in Antigravity

### How rules load
Antigravity receives context through two channels:
- **`.agent/core-rules.md`** — injected as system context at session start (architecture, HITL gates, commands, Zero Noise rule)
- **Engram memory** — persistent cross-session knowledge (decisions, bugs fixed, conventions, phase progress)

### Starting a session
1. Engram automatically surfaces recent context (decisions, open tasks, phase state)
2. Read `openspec/config.yaml` to confirm current phase
3. Declare your mission scope before writing any code

### Running a mission
```
/mission <name>            # Declare scope + boundary + verification method
/sdd-apply                 # Implement tasks from spec
/sdd-verify                # Validate against spec + design
/sdd-archive               # Close completed phase
```

### HITL enforcement
Antigravity will NOT proceed on HITL-gated actions without explicit user approval in the conversation. The gate list lives in `.agent/core-rules.md`.

### Saving to memory
After any non-trivial decision, Engram auto-saves context. This survives session compaction and IDE restarts.

---

## 2. Operating in Cursor

### How rules load

| File | Trigger | Content |
|------|---------|---------|
| `01-core.mdc` | Always (all files) | Identity, HITL gates, Zero Noise |
| `02-mission-discipline.mdc` | Always (all files) | Mission scope contract, git checkpoint, no opportunistic refactoring |
| `03-frontend.mdc` | Auto — `client/**/*` | FSD-lite layer rules, import policy, TS, style tokens |
| `04-backend.mdc` | Auto — `server/**/*` | Feature-module structure, Zod, auth, testing |
| `05-phase-discipline.mdc` | Agent-requested | Phase workflow, spec format, active technical decisions |

### Starting a session
1. Open any file — core rules activate automatically
2. Open a file in `client/` or `server/` — contextual rules attach automatically
3. Ask Cursor to load `05-phase-discipline.mdc` when doing phase/spec work

### Running a mission
1. Declare scope in the Cursor Composer: what will be touched, what will NOT be touched, how success is verified
2. Cursor will reject HITL-gated actions and ask for approval (enforced by `02-mission-discipline.mdc`)
3. After every change batch: run `pnpm -C client run build` and/or `pnpm -C server run build`

### Key reminder
Cursor has no persistent memory. Phase state must always be read from `openspec/config.yaml`, not assumed from prior conversation.

---

## 3. Operating in Kiro

### How rules load
All `.kiro/steering/` files are loaded at workspace open — no triggers needed.

| File | Content |
|------|---------|
| `product.md` | System identity, stack, deployment anchors, key commands |
| `tech-standards.md` | FSD-lite rules, backend structure, TS/Zod/Auth standards, quality gates |
| `operational-discipline.md` | Mission scope contract, HITL gates, git checkpoints, context minimization |
| `structure.md` | Root directory semantics + key file index |

### Starting a session
1. Kiro loads all steering files automatically at workspace open
2. Read `openspec/config.yaml` for current phase before any work
3. Declare mission scope before touching any file

### Running a mission
1. Scope declaration is enforced by `operational-discipline.md` — Kiro will ask for it if not provided
2. HITL gates are listed explicitly — Kiro stops and surfaces approval requests
3. After every change: both build commands must exit 0 before task is marked complete

### Kiro advantage
Kiro reads the filesystem natively. Use its file-navigation capabilities for exploring structure — do not ask it to derive structure from memory.

---

## 4. IDE Equivalence Map

| Concept | Antigravity | Cursor | Kiro |
|---------|-------------|--------|------|
| Always-on rules | `.agent/core-rules.md` (system prompt) | `01-core.mdc` + `02-mission-discipline.mdc` | All 4 steering files |
| Context-aware rules | Engram search | `03-frontend.mdc` / `04-backend.mdc` (glob) | Filesystem navigation |
| On-demand rules | Skills (`/sdd-apply`, `/sdd-verify`, etc.) | `05-phase-discipline.mdc` (agent-requested) | Specs in `openspec/specs/` |
| Persistent memory | Engram (cross-session) | `.cursor/rules/` (file-based, static) | `.kiro/steering/` (file-based, static) |
| Phase tracker | `openspec/config.yaml` via Engram | `openspec/config.yaml` (must read explicitly) | `openspec/config.yaml` (must read explicitly) |
| HITL enforcement | Conversation gate | `02-mission-discipline.mdc` rule | `operational-discipline.md` rule |
| Mission template | `.agent/mission-template.md` | Declared in Composer | Declared in task |
| Architecture source | `docs/ARCHITECTURE.md` | `docs/ARCHITECTURE.md` | `docs/ARCHITECTURE.md` |
| Git checkpoint | Before every apply batch | Before every apply batch | Before every apply batch |

---

## 5. Context Load Validation

### Cursor — Verify rules are active
Open any `client/` file in Cursor and check the "Rules" panel. Expect:
- `01-core.mdc` ✓ (always)
- `02-mission-discipline.mdc` ✓ (always)
- `03-frontend.mdc` ✓ (auto-attached)

Open any `server/` file. Expect:
- `01-core.mdc` ✓ (always)
- `02-mission-discipline.mdc` ✓ (always)
- `04-backend.mdc` ✓ (auto-attached)

Ask: *"What are the HITL gates for this project?"*
Expected: List from `01-core.mdc` (Auth changes, FSD layer moves, deployment config, new dependencies).

Ask: *"What can `shared/` import from?"*
Expected: *"Nothing — shared has zero dependencies on any other layer."*

### Kiro — Verify steering is loaded
Open Kiro workspace. Check steering context panel. Expect all 4 files visible:
- `product.md` ✓
- `tech-standards.md` ✓
- `operational-discipline.md` ✓
- `structure.md` ✓

Ask: *"Where does new domain logic go in the backend?"*
Expected: `server/src/features/<feature-name>/`

Ask: *"What is the current phase?"*
Expected: *"I need to check `openspec/config.yaml` for the current phase."* (not a hardcoded answer)

### Antigravity — Verify Engram context
Start a session. Engram should surface recent decisions and phase context.
Ask: *"What's the architecture contract?"*
Expected: FSD-lite summary with pointer to `docs/ARCHITECTURE.md`.

---

## 6. Next Safe Phase: Phase 3.1 — Legacy Cleanup

### Status
**Awaiting explicit human approval.** Do not begin without go-ahead.

### Scope
Remove legacy folder remnants from the pre-FSD v0 structure after confirming the refactored code is the live path.

### Legacy folders identified (transitional, not yet cleaned)
```
client/src/components/     → should migrate to shared/ or features/
client/src/layouts/        → should migrate to shared/ or pages/
client/src/services/       → should migrate to features/<name>/api/
client/src/context/        → already migrated to app/providers/ (safe to delete)
```

### Pre-conditions before cleanup
- [ ] Smoke test passes: `pnpm -C client run build` exits 0
- [ ] All imports in `app/`, `pages/`, `features/`, `shared/` use `@/` alias
- [ ] No file in `app/`, `pages/`, `features/`, `shared/` still imports from legacy folders
- [ ] Git checkpoint commit exists

### Cleanup protocol (when approved)
1. Run `pnpm -C client run build` → confirm 0 errors
2. Verify grep: `grep -r "from.*components/" client/src/app client/src/pages client/src/features client/src/shared` → must return 0 results
3. Same check for `layouts/`, `services/`, `context/`
4. If checks pass → delete legacy folders
5. Run build again → must still exit 0
6. Commit: `chore: remove legacy v0 folders — FSD-lite cleanup complete`

### Risk
**Low** — if pre-conditions are met, these folders are dead code. If any import is missed, the build will immediately catch it.

### HITL gate
Moving files between FSD layers requires human approval. Deleting confirmed-dead folders after all checks pass = **approved as part of this entry** once you give the go-ahead.

---

## Maintenance Protocol

When OS-level policy changes:
1. Edit `docs/agentic-os.md` (neutral core)
2. Propagate relevant changes to the affected adapter(s)
3. Never make policy changes directly in IDE adapters — they are read-only projections
4. Commit: `docs: update agentic-os + adapters — <what changed>`

When phase state changes:
1. Update `openspec/config.yaml` only
2. No changes needed in OS adapters (they point to the tracker, not hardcode state)
