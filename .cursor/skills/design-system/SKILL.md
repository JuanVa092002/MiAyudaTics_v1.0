---
name: design-system
description: SENA design tokens and premium UI bar for MiAyudaTIC web and mobile shared UI. Use for new screens, components, tokens, loading/empty/error states, or design-system.md updates.
---

# Design System (MiAyudaTIC)

## Tokens (mandatory)

| Token | Hex |
|-------|-----|
| primary | `#04324d` |
| accent | `#39a900` |

Never `#1B2A4A` or ad-hoc palette.

## Every screen

- Loading state
- Empty state (actionable copy)
- Error with retry
- One primary CTA (green accent)

## Web (`client/`)

- Reuse `.premium-table`, `.premium-card`, `.badge-base` in `client/src/index.css`
- react-hook-form + Zod for forms
- FSD: components live in correct layer

## Mobile (`shared/ui`)

- Reuse `mobile/MiAyudaTIC-Mobile/src/shared/ui/*`
- Match RGB tokens to web brand

## Language

Spanish (Colombia), institutional — **AyudaTIC** / **MiAyudaTIC**

## Workflow

1. Read `docs/design-system.md`
2. Check mockups: `client/src/assets/mockups/`
3. Implement states before polish
4. `pnpm -C client run build` or mobile typecheck

## Reject

Placeholder screens in prod without roadmap date; mixed ES/EN; broken images.
