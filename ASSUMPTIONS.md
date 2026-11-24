# ASSUMPTIONS.md — atlas-skill

| # | Assumption | Why assumed | Impact if wrong | How to validate | Status |
|---|---|---|---|---|---|
| 1 | This repo is a library/tooling project, not an application | it ships text + two CLIs; no runtime surface | PRD, design system, threat model, deploy docs would be missing | ask the owner | validated |
| 2 | Node >= 18 is an acceptable floor | both CLIs use ESM + `node:` built-ins only | older runtimes cannot execute them | run on Node 18 in the CI matrix | open |
| 3 | Zero dependencies is preferable to convenience libraries | supply-chain risk and offline use matter more than ergonomics | a little more code to maintain | revisit if either CLI grows past ~700 lines | validated |
| 4 | ~~Private repo, single owner → no external security-reporting process~~ | — | — | — | **invalidated 2026-11-24**: the repo is public; `SECURITY.md` added with GitHub Security Advisories |
| 5 | Actions may be pinned to SHAs resolved from the GitHub API | tags move; SHAs are immutable | a stale pin stops receiving fixes | Dependabot or periodic re-resolution | validated — re-resolved to v5 on 2026-11-24 |
| 6 | No YAML front matter in repo docs | GitHub renders leading `---` visibly | the version line must be maintained by explicit text markers | visual check of the rendered README/docs | validated |
| 7 | ~~`1.0.0` stays the SSOT version until the next release is cut~~ | — | — | — | **invalidated 2026-11-24**: `1.1.0` cut for the public release |
| 8 | Agent skill paths are stable enough to document | vendors publish them and the spec is shared | a documented path may go stale and fail silently | re-check vendor docs before each release; the matrix records the date | open |
| 9 | Copying the skill folder is safer than symlinking it | Windows symlinks require Developer Mode or admin rights | a symlink install would fail on default Windows | tested copy path on Windows and Linux CI | validated |
| 10 | The skill does not need Node to function | it is Markdown; only the version tool and installer are code | a Node-less user loses the version tool but keeps the process | read `SKILL.md` with no Node present | validated by design |

Status: `open` · `validated` · `invalidated`.

When an assumption is invalidated, update the code and record the change in `MEMORY.md`.
