# Changelog

All notable changes to this repository.

## [Unreleased]

### Added

- `package.json` — repository SSOT (`version: 1.0.0`), zero dependencies, scripts wired to the bundled tool.
- `tests/version.test.mjs` — 15 black-box tests over the real CLI.
- `.github/workflows/ci.yml` — syntax, tests, `version:verify`, and a "sync is a no-op" gate on Node 20 and 22.
- Memory set: `AGENTS.md`, `MEMORY.md`, `HANDOFF.md`, `TASKS.md`, `ASSUMPTIONS.md`.
- `docs/PROJECT-STATUS.md`, `docs/TESTING.md`.

### Changed

- `README.md` — version badge (now a sync target), updated repo map, "runs on ATLAS" section.

### Verified

- `node --test tests/version.test.mjs` → 14 passed, 1 skipped, 0 failed.
- `version:verify` → no drift; `sync` twice → no diff.

## [1.0.0] - 2026-11-24

### Added

- `ATLAS-MASTER-PROMPT.md` — the full rulebook: 34 sections + appendix.
- `atlas-project-architect/` — portable skill: `SKILL.md`, 11 phase references, 6 templates.
- `scripts/version.mjs` — zero-dependency SSOT version tool (`bump` / `set` / `sync` / `verify` / `show`), transactional and BOM-safe.
- `assets/banner.svg` — hand-authored repository hero.
- `LICENSE` — personal use, no redistribution.

### Verified

- `version.mjs`: bump, set, sync, verify, show, `--dry-run`, drift detection, rollback on write failure, BOM preservation, both SSOT modes.

### Known limits

- `--all` monorepo iteration and `--force-channel` are specified in the master prompt but not implemented in the bundled script.
- Skill behaviour is prompt-level; no automated eval suite has been run.
