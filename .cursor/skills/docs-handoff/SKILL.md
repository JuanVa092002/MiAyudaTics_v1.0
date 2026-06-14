---
name: docs-handoff
description: Completes MiAyudaTIC workstream handoffs per handoff-template.md. Use when closing a chat, transferring work to another role, or before merge when handoff is incomplete.
---

# Docs Handoff (MiAyudaTIC)

## Rule

**Incomplete handoff = task not done.**

## Start contract (before coding)

State in chat:
1. Role
2. Goal (one sentence)
3. In scope / Out of scope
4. Verify commands

## End contract (required output)

Copy structure from `docs/handoff-template.md`:

- Goal, Why, Constraints, Files touched
- Decisions made, Risks, Open questions
- Next owner, Acceptance criteria
- Verification commands (actual pass/fail)
- Reviewer sign-off if merge-ready

## Review matrix

| Change | Reviewer |
|--------|----------|
| UI/UX | PE Web |
| API/RBAC | Founder-CTO |
| Mobile screen | Design Engineer |
| Contracts | Founder-CTO |
| CI/OS docs | Founder-CTO |

## Hook reminder

`.cursor/hooks/handoff-reminder.sh` fires on `stop` — ensure handoff is in the conversation.

## Transfer phrase

```
Next owner: [role subagent name]
Task: [one sentence]
Context: [link to handoff section]
```
