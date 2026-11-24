# PROJECT-STATUS — atlas-skill

Version: 1.0.0
Stage: v1 shipped · repository now self-managed under the ATLAS skill
Updated: 2026-11-24

## What works

| Capability | State | Evidence |
|---|---|---|
| Master prompt (34 sections + appendix) | shipped | `ATLAS-MASTER-PROMPT.md` |
| Portable skill (`SKILL.md` + 11 references + 6 templates) | shipped | `atlas-project-architect/` |
| SSOT version tool (`bump`/`set`/`sync`/`verify`/`show`) | shipped, tested | `tests/version.test.mjs` |
| Version gate in CI | shipped | `.github/workflows/ci.yml` |
| Memory set (AGENTS/MEMORY/HANDOFF/TASKS/ASSUMPTIONS) | shipped | repo root |
| Release `v1.0.0` | published | GitHub Releases |

## Not built (deliberate)

- No application runtime, database, auth or hosting — none is required.
- No PRD or design system — the deliverable is documentation and one CLI.
- No external security-reporting process — private repo, single owner.

## Tests

```text
Command: node --test tests/version.test.mjs
Result:  14 passed, 1 skipped, 0 failed
Env:     Node 26.13.0, Windows 11, 2026-11-24
Skip:    rollback test (directory permissions are not enforced on Windows)
```

CI matrix: Node 20 and 22 on `ubuntu-latest`. The skipped test runs there.

## Security posture

- Zero dependencies → no transitive supply-chain surface.
- Actions pinned to commit SHAs resolved from the GitHub API (not from memory).
- `permissions: contents: read` on CI; no secrets are used.
- No credentials, tokens or personal data in the repository.

## Deploy state

Not applicable. Distribution is `git clone` plus copy the skill folder.

## Blockers

None.

## Next milestone

`1.1.0` — after the `--all` decision and a minimal eval harness.
