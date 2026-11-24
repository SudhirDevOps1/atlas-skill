# TESTING — atlas-skill

## Commands

```bash
# everything CI runs
pnpm run verify

# or individually
node --check atlas-project-architect/scripts/version.mjs
node --test tests/version.test.mjs
node atlas-project-architect/scripts/version.mjs verify
```

## What the suite covers

`tests/version.test.mjs` is black-box: every test builds a throwaway project in the OS
temp directory and runs the real CLI as a child process.

| # | Behaviour |
|---|---|
| 1 | `show --json` reports version, channel, versionCode and next versions |
| 2 | `bump patch` updates every derived surface, badge colour intact |
| 3 | Android `versionCode` formula across alpha → beta → rc → stable |
| 4 | `sync` is idempotent (byte-identical second run) |
| 5 | `verify` passes clean, fails on a hand-edited surface |
| 6 | `verify --json` returns structured drift |
| 7 | invalid versions and unknown commands exit non-zero with the right code |
| 8 | downgrade blocked without `--allow-downgrade` |
| 9 | `--dry-run` writes nothing |
| 10 | `version.json` works as the SSOT when `package.json` is absent |
| 11 | projects without `src/` or `public/` are not given empty scaffolding |
| 12 | changelog entries land under `## [Unreleased]`, never duplicated |
| 13 | prerelease numbers are capped at 99 |
| 14 | a UTF-8 BOM in the SSOT is preserved |
| 15 | a failed write rolls back the SSOT and every already-written file |

## Current result

```text
Command: node --test tests/version.test.mjs
Result:  14 passed, 1 skipped, 0 failed
Time:    4.7s
Env:     Node 26.13.0, Windows 11, 2026-11-24
```

The skipped test is #15. Windows does not enforce directory permissions, so a write
failure cannot be simulated portably there. It runs on the Linux CI matrix and the
behaviour was verified manually on Windows with a read-only file (`EPERM` on rename).

## Known gaps

- No test for `--all` / `--force-channel` — neither is implemented.
- No performance or large-repo test; the tool is O(number of surfaces).
- No test for concurrent runs; the tool is not designed for them (single writer).

## Reproducing a failure

```bash
node --test tests/version.test.mjs --test-name-pattern="<test name>"
```

The temp fixtures are deleted after the run. To keep one for inspection, comment out
the `after()` cleanup and re-run.
