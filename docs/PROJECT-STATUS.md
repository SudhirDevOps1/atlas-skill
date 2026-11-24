# PROJECT-STATUS — atlas-skill

Version: 1.1.0
Stage: public release · installable in 60+ agents
Updated: 2026-11-24

## What works

| Capability | State | Evidence |
|---|---|---|
| Master prompt (34 sections + appendix) | shipped | `ATLAS-MASTER-PROMPT.md` |
| Portable skill (`SKILL.md` + 11 references + 6 templates) | shipped | `atlas-project-architect/` |
| SSOT version tool (`bump`/`set`/`sync`/`verify`/`show`) | shipped, tested | `tests/version.test.mjs` |
| Installer (`--list`/`--agent`/`--scope`/`--dest`/`--force`/`--dry-run`) | shipped, tested | `tests/install.test.mjs` |
| Install guide for 20 agents + chat UI | shipped | `INSTALL.md` |
| Agent path matrix (60+) with sources | shipped | `docs/AGENT-COMPATIBILITY.md` |
| Worked examples | shipped | `examples/` |
| Version gate in CI | shipped | `.github/workflows/ci.yml` |
| Memory set (AGENTS/MEMORY/HANDOFF/TASKS/ASSUMPTIONS) | shipped | repo root |
| Releases | published | `v1.0.0`, `v1.1.0` |

## Not built (deliberate)

- No application runtime, database, auth or hosting — none is required.
- No PRD or design system in this repo — the deliverable is the process that produces them.
- No eval harness for skill behaviour — the only tested code is the two CLIs.
- No `--all` monorepo iteration in the version tool — documented as per-package instead.

## Tests

```text
Command: node --test tests/version.test.mjs tests/install.test.mjs
Result:  22 passed, 1 skipped, 0 failed
Env:     Node 26.13.0, Windows 11, 2026-11-24
Skip:    rollback test (directory permissions are not enforced on Windows)
```

CI matrix: Node 20 and 22 on `ubuntu-latest`. The skipped test runs there, and the
installer gets a smoke test on both versions.

Run `45378930334` (v1.0.0 commit): **success** — 15/15 on both Node versions.
Run `45382872606` (v1.1.0 commit): **success** — 23/23, 0 skipped on Node 20 and 22,
installer smoke test included.

## Security posture

- MIT licensed; no contributor agreement required.
- Private vulnerability reporting via GitHub Security Advisories (`SECURITY.md`).
- Zero dependencies → no transitive supply-chain surface.
- Actions pinned to commit SHAs resolved from the GitHub API.
- `permissions: contents: read` on CI; no secrets are used.
- The installer refuses to overwrite an existing copy without `--force` and refuses to
  install over its own source folder.
- No credentials, tokens or personal data in the repository.

## Distribution

- `git clone` + `node scripts/install-skill.mjs`
- ZIP download from the releases page
- Copy the `atlas-project-architect/` folder by hand
- Paste `SKILL.md` into a chat UI (no filesystem)

## Blockers

None.

## Next milestone

`1.2.0` — eval harness for skill behaviour (3–5 prompts, rubric, recorded output), and a
decision on `--all` for monorepos.
