# ASSUMPTIONS.md — atlas-skill

| # | Assumption | Why assumed | Impact if wrong | How to validate | Status |
|---|---|---|---|---|---|
| 1 | This repo is a library/tooling project, not an application | it ships text + one CLI; no runtime surface | PRD, design system, threat model, deploy docs would be missing | ask the owner | validated (owner confirmed "ye bhi ek project hai") |
| 2 | Node >= 18 is an acceptable floor | `version.mjs` uses ESM + `node:` built-ins only | older runtimes cannot execute the tool | run on Node 18 in CI matrix | open |
| 3 | Zero dependencies is preferable to convenience libraries | supply-chain risk and offline use matter more than ergonomics | a little more code to maintain | revisit if the CLI grows past ~700 lines | validated |
| 4 | Private repo, single owner → no external `SECURITY.md` reporting process | no outside reporters exist | a leaked secret has no stated channel | add `SECURITY.md` if the repo ever goes public | validated |
| 5 | Actions may be pinned to the SHAs resolved from the GitHub API | tags move; SHAs are immutable | a stale pin stops receiving fixes | Dependabot or periodic re-resolution | validated — re-resolved to v5 on 2026-11-24 after a Node 20 runtime deprecation warning |
| 6 | No YAML front matter in repo docs | GitHub renders leading `---` visibly | version line must be maintained by explicit text markers | visual check of the rendered README/docs | validated |
| 7 | `1.0.0` stays the SSOT version until the next release is cut | matches the published tag; unreleased work belongs under `## [Unreleased]` | version badge looks behind the work | cut `1.1.0` when tasks close | validated |

Status: `open` · `validated` · `invalidated`.

When an assumption is invalidated, update the code and record the change in `MEMORY.md`.
