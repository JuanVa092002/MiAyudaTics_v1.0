# Operational Discipline — Mission OS

This steering file translates Hybrid Mission OS principles to Kiro.
It is always active.

> Full principles: `docs/agentic-os.md` §5

## Core Philosophy
- Agent = strategic brain, not autonomous executor
- Every task is a **Mission**: bounded, declared, verifiable
- Context is a resource — minimize it aggressively
- Human approval gates protect the system from cascading damage

## Before Starting Any Work

Declare explicitly:
1. **Scope**: what files/modules will be touched
2. **Boundary**: what will NOT be touched
3. **Verification**: how success will be confirmed

If scope expands unexpectedly → **STOP**. Report. Get approval. Then continue.

## HITL Gates — Mandatory Human Approval Before

- Modifying Auth, sessions, or JWT logic
- Changing DB schema or Mongoose models
- Moving files between FSD layers
- Modifying deployment configuration
- Installing new npm/pnpm dependencies
- Any change to `server/src/core/` or root middleware

## Git Checkpoint Policy

A `git commit` checkpoint is **mandatory before any implementation batch**.
Do not start writing code without a clean baseline commit.

Suggested message format:
```
checkpoint: before <mission-name> implementation
```

## Context Loading Policy

- Load **only** files required for the declared mission
- Do not speculatively explore the codebase
- Stable knowledge is in `docs/agentic-os.md` — do not re-derive it from source files
- Historical specs live in `openspec/archive/` — do not read them without forensic reason

## Verification Protocol

After every change batch:
1. Run `pnpm -C client run build` (frontend)
2. Run `pnpm -C server run build` (backend)  
3. Confirm: 0 errors, 0 unresolved imports
4. Do not report task complete until both pass

## No Opportunistic Work

If you notice something outside mission scope that "could be improved":
- Do NOT implement it
- Do NOT refactor it
- Document it as a future note if it's genuinely important
- Stay in scope

## Phase State Awareness

Always check `openspec/config.yaml` for current phase before planning work.
Do not start new phase work without confirming current phase is complete.

Current state:
- Phase 3 Frontend Migration: 🔄 In Progress
- Next: Phase 3.1 Legacy cleanup (pending approval)
