# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | C:\Users\JuanC\.gemini\antigravity\skills\branch-pr\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | C:\Users\JuanC\.gemini\antigravity\skills\go-testing\SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | C:\Users\JuanC\.gemini\antigravity\skills\issue-creation\SKILL.md |
| When user says "judgment day", "review adversarial", "dual review". | judgment-day | C:\Users\JuanC\.gemini\antigravity\skills\judgment-day\SKILL.md |
| When user asks to create a new skill, add agent instructions. | skill-creator | C:\Users\JuanC\.gemini\antigravity\skills\skill-creator\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Follow issue-first enforcement system.
- Always link the PR to the relevant issue.
- Verify test coverage requirements before requesting a review.

### go-testing
- Follow table-driven test formats.
- For TUI testing, strictly use `teatest` and Bubbletea patterns.
- Ensure thorough test coverage of the Go routines.

### issue-creation
- Apply the issue-first enforcement rule before beginning code changes.
- Use explicit markdown issue templates.
- Define reproduction steps strictly for bug reports.

### judgment-day
- Launch two independent blind judge sub-agents simultaneously to review the target.
- Synthesize findings and apply fixes objectively.
- Re-judge until both pass. Escalate to orchestrator after 2 iterations.

### skill-creator
- Output skills matching the standard Agent Skills YAML spec.
- Incorporate explicit triggers.
- Constrain total lines below 200 to prevent context bloating.

## Project Conventions

| File | Path | Notes |
|------|------|-------|

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
