# TASKS.md — atlas-skill

## Done

- [x] Master prompt (34 sections + appendix) written and reviewed.
- [x] Skill built: `SKILL.md`, 11 references, 6 templates.
- [x] `version.mjs` implemented and hardened (transactional, BOM-safe, idempotent).
- [x] Manual end-to-end verification of the version tool on Windows.
- [x] Repo created, private, banner + README + license + `v1.0.0` release.
- [x] Repo put under its own skill: SSOT, 15 tests, CI, memory set.
- [x] First CI run green on Node 20 and 22 (run `45378930334`).
- [x] Actions re-pinned to `v5` SHAs after the Node 20 runtime deprecation warning.

## In progress

- [ ] None.

## Pending

- [ ] Decide `--all` monorepo support: implement it or delete the claim from the master prompt.
- [ ] Minimal eval harness for skill behaviour (3–5 prompts, rubric-based).
- [ ] Cut `1.1.0` once the two items above land.

## Blocked

| Task | Blocked by | Owner |
|---|---|---|
| none | — | — |

## Proposed (not approved)

| Task | Benefit | Cost | Risk |
|---|---|---|---|
| SHA-256 release checksums | tamper evidence for downloaded artifacts | low | none |
| Second banner variant for light mode | better contrast on light GitHub theme | low | visual drift |
| Split references into per-topic files | smaller context per phase | medium | link churn |

## Acceptance criteria (current milestone)

- [x] `node --test tests/version.test.mjs` → 0 failures.
- [x] `version:verify` → no drift.
- [x] `sync` twice → no diff.
- [x] CI pins actions to commit SHAs.
- [x] A stranger can continue from `HANDOFF.md` alone.
