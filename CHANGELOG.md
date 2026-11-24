# Changelog

All notable changes to this repository.

## [Unreleased]

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
