---
name: release-readiness
description: Pre-release checklist for MiAyudaTIC — CI, smoke:prod 12/12, smoke:mobile-api, deploy gates, go/no-go. Use before Vercel/Render production deploy or tagging a release.
---

# Release Readiness (MiAyudaTIC)

## Prod URLs

- Web: `https://miayudatics.vercel.app`
- API: `https://miayudatics-v1-0.onrender.com`

## Gates (all required for prod)

| Gate | Command |
|------|---------|
| Server types + tests + build | `pnpm -C server run typecheck && pnpm -C server run test && pnpm -C server run build` |
| Client types + build | `pnpm -C client run typecheck && pnpm -C client run build` |
| Mobile (if touched) | `cd mobile/MiAyudaTIC-Mobile && pnpm typecheck` |
| Prod smoke | `pnpm run smoke:prod` → **12/12** |
| Mobile API smoke | `pnpm run smoke:mobile-api` (if auth/socket/media changed) |
| CI | `.github/workflows/ci.yml` green |

## HITL

Deploy config, env vars, new prod dependencies → Founder-CTO sign-off.

## Go/No-Go template

```markdown
## Release — [version/date]

| Check | Status |
|-------|--------|
| smoke:prod 12/12 | pass/fail |
| CI | pass/fail |
| HITL approved | yes/no |
| Rollback plan | [steps] |

**Decision:** Go / No-Go
```

## No-Go triggers

- Any P0 from `qa-premerge`
- smoke:prod red
- Uncommitted contract drift vs `@miayuda/contracts`

## References

- `docs/architecture.md` § Deployment
- `docs/operating-model.md` § Runbook
