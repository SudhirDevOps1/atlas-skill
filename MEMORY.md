# MEMORY.md — atlas-skill

> Durable project knowledge. Update at each milestone. Never store secrets.

## Overview

Private repo shipping two artifacts: a master prompt for coding agents, and a portable
skill that turns "build me this" into a researched, tested, documented, deployable
project with one source of truth for versioning.

## Current state

- Version: 1.0.0
- Stage: v1 shipped; the repo now runs on its own skill (SSOT + tests + CI + memory).
- Last verified tests: 14 passed, 1 skipped, 0 failed — Node 26.13.0, Windows 11, 2026-11-24.
- Last verified CI: see `docs/PROJECT-STATUS.md`.

## Decisions

| Date | Decision | Why | Alternatives rejected |
|---|---|---|---|
| 2026-11-24 | One `version.mjs` instead of four scripts (`bump`/`set`/`sync`/`verify`) | one contract, one test file, no shared-module duplication | four files as sketched in the master prompt |
| 2026-11-24 | Zero runtime dependencies | near-zero supply-chain risk, runs offline, no lockfile to drift | commander/chalk-style CLI helpers |
| 2026-11-24 | Black-box tests through the real CLI | asserts the user-facing contract, not internals; survives refactors | unit-testing internal functions |
| 2026-11-24 | GitHub Actions pinned to commit SHAs | tags can move; SHAs were resolved via the GitHub API, not memory | `@v4` floating tags |
| 2026-11-24 | No YAML front matter in repo docs | GitHub renders leading `---` visibly; explicit `Version:` lines are cleaner | front-matter versioning in `docs/` |
| 2026-11-24 | Hand-authored SVG banner | exact text, no external asset, no image-generation drift | PNG banner, hosted image |

## Discoveries

- Windows: `rename` over a read-only file fails with `EPERM`; antivirus/indexer locks make it transient. Retry 5x, then roll back.
- PowerShell 5.1 writes a UTF-8 BOM. Any `^`-anchored regex must run on BOM-stripped text, and the BOM must be restored on write.
- shields.io: `-` separates message from colour, so a greedy `[0-9A-Za-z.-]+` eats the `-blue` suffix.
- `node --test` skips nothing silently — the skipped rollback test is explicit in output, which is the behaviour we want.
- GitHub deprecated the Node 20 runtime for Actions in late 2025; `checkout@v4` / `setup-node@v4` trigger a warning. v5 SHAs are current.

## Failed approaches

- Greedy badge regex — destroyed the badge colour on every sync.
- Inserting changelog entries at the first `## ` heading — put releases above `## [Unreleased]`.
- Creating `src/generated/version.ts` unconditionally — polluted projects that have no `src/`.
- Writing the SSOT before planning derived changes — a later failure left a half-applied release.

## Known issues

- `--all` (monorepo iteration) and `--force-channel` are specified in the master prompt but not implemented.
- Skill behaviour is prompt-level; no automated eval suite exists.
- The rollback test is skipped on Windows (directory permissions are not enforced there); the behaviour was verified manually.

## Dependencies of note

None. Deliberate.

## Next priority

1. Decide whether to implement `--all` for monorepos or delete the claim.
2. Add a minimal eval harness for the skill (3–5 prompts, rubric-based).
3. Cut `1.1.0` when the above lands.
