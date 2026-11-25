# Drishti Browser AI — fix and improve plan (no feature removal)

**Mode:** read-only audit → additive plan. Nothing in the Drishti repository was modified.
**Target:** `https://github.com/SudhirDevOps1/drishti-browser-ai.git` (`main`, HEAD `ec1ac8c`)
**Audited:** 2026-11-25, from the ATLAS repo.
**Rule for every phase below:** nothing is deleted. No tool, permission, flow, screen or
documented behaviour is removed. Changes are additive, or a rename with a deprecation path.

---

## 1. How this audit was produced

Static inspection only. Drishti's build and tests were **NOT RUN** in this session, because
the repository was explicitly out of scope for writes and execution. Every claim below is
therefore marked either **verified** (read from the file) or **claimed** (stated by the
project, not reproduced here).

| Evidence | Read | What it shows |
|---|---|---|
| `package.json` | verified | name `sudhir-browser-ai`, version `0.1.0`, `private: true`, scripts for build/test/typecheck/version/bridge/mcp/ext |
| `README.md` (290 lines) | verified | product name *Drishti Browser AI*, 37 MCP tools table, existing `<DRISHTI_AUTO_INSTALL>` prompt at line 155, badge “Tests 100% Passing”, line 278 claim “19 passed across 3 suites (1.37s)” |
| `.github/workflows/ci.yml` | verified | `actions/checkout@v4`, `pnpm/action-setup@v4`, `actions/setup-node@v4`, Node 22, `pnpm install --frozen-lockfile`, `pnpm -r run build`, `pnpm test` |
| `.github/workflows/release.yml` | verified | tag trigger `v*.*.*`, `contents: write`, same unpinned actions, zips `apps/chrome-extension/dist`, `gh release create --generate-notes` |
| `apps/chrome-extension/public/manifest.json` | verified | MV3, 8 permissions, `host_permissions: ["<all_urls>"]`, content script on `<all_urls>`, `all_frames: false`, side panel |
| `SECURITY.md` | verified | title “Sudhir Browser AI — Security Policy”, placeholder contact `security@sudhir-browser-ai.local`, threat table, `ws://127.0.0.1:7483` |
| `.gitignore` | verified | ignores `**/dist/`, `extension-ready-to-install/`, `.drishti-token`, `scratch/`, `downloads/` |
| `docs/` | verified | 8 files: agent-integrations, architecture, developer-setup, limitations, mcp-tools-reference, privacy-and-security, troubleshooting, windows-install |
| `tests/` | verified | `unit/` and `e2e/` folders exist |
| `apps/` | verified | `chrome-extension/`, `mcp-server/` present; `local-bridge` is referenced by `package.json` scripts |
| `git status --porcelain` | verified | clean; branch `main`; remote `origin` |

`NOT RUN`: `pnpm install`, `pnpm -r run build`, `pnpm test`, `pnpm typecheck`,
`pnpm version:verify`, any browser load, any MCP connection.

---

## 2. Findings

Severity: **S1** breaks trust or release safety · **S2** weakens security or CI · **S3**
polish, docs, developer experience.

| # | Sev | Finding | Evidence | Why it matters |
|---|---|---|---|---|
| F1 | S1 | Three names for one product: package `sudhir-browser-ai`, security doc “Sudhir Browser AI”, product “Drishti Browser AI” | `package.json:2`, `SECURITY.md:1`, `README.md:1` | Users cannot tell whether they installed the right thing; search and support fragment |
| F2 | S1 | Placeholder security contact `security@sudhir-browser-ai.local` | `SECURITY.md` | A `.local` address cannot receive a report; disclosure silently fails |
| F3 | S2 | CI actions are unpinned moving tags (`@v4`) | `ci.yml:13-17`, `release.yml:15-19` | A compromised tag runs in a job that has release permissions |
| F4 | S2 | CI runs build + test only — no `typecheck`, no `version:verify`, no lint | `ci.yml:21-23` | Type drift and version drift can merge green |
| F5 | S2 | Release workflow does not verify the version before packaging, and publishes without a checksum | `release.yml:23-37` | A ZIP can ship whose manifest disagrees with the tag |
| F6 | S2 | `host_permissions: ["<all_urls>"]` with no written decision record | `manifest.json:17,24` | Broad access is defensible for this product, but only if the reason and mitigations are written down |
| F7 | S2 | 37 MCP tools are documented in README, but there is no single machine-readable classification of read / write / destructive | `README.md:111-151` | Approval policy cannot be enforced consistently from prose |
| F8 | S3 | README hard-codes “19 passed across 3 suites (1.37s)” and a “100% Passing” badge | `README.md:7,278` | A number that is not regenerated becomes false on the next commit |
| F9 | S3 | `docs/mcp-tools-reference.md` is hand-maintained next to the schema | `docs/` | Two sources of truth for the same 37 tools will drift |
| F10 | S3 | No project-level `SKILL.md`; only the installed ATLAS skill under `.agents/skills/` | `glob **/SKILL.md` → none at root | A new agent gets the process, not the project's own conventions |

Nothing in the audit justifies removing a feature. F6 in particular must be **documented
and mitigated**, not narrowed blindly — a general browser-automation product genuinely needs
arbitrary origins.

---

## 3. Phased plan

Each phase is independently shippable, additive, and reversible. Do them in order: P0 makes
the repo trustworthy, P1 hardens it, P2 makes the contract machine-checkable, P3 polishes.

### P0 — Trust and release safety (no behaviour change)

**Goal:** green CI means something, and a release cannot ship a mismatched version.

1. **Pin every action to a commit SHA** in `ci.yml` and `release.yml`; add
   `permissions: contents: read` at workflow level and `contents: write` only on the release
   job.
2. **Add gates after `pnpm test`:** `pnpm typecheck`, `pnpm version:verify`, and `pnpm lint`
   if the lint script passes locally. Add `concurrency` with `cancel-in-progress`.
3. **Release preflight:** run `pnpm version:verify`, assert
   `apps/chrome-extension/dist/manifest.json` exists, and use `gh release create --verify-tag`.
4. **Add a SHA-256 checksum** next to the ZIP and mention it in the release notes.
5. **Name the product once.** Keep `Drishti Browser AI` as the user-facing name. Rename the
   npm package only if you accept a lockfile churn; otherwise add a README line that
   `sudhir-browser-ai` is the historical package id. Replace the `.local` security address
   with a real, monitored contact (GitHub Security Advisories is enough).

**Files:** `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `package.json`,
`README.md`, `SECURITY.md`.
**Verify:** push to a branch, read the run; `pnpm version:verify`; `git check-ignore -v
.drishti-token`.
**Rollback:** revert the two workflow files; no product code touched.

### P1 — Security hardening (additive)

**Goal:** the threat model in `SECURITY.md` is enforced in code, not only described.

1. **Decision record for `<all_urls>`** — the block from
   `references/12-browser-extension-mcp.md` §2.1, filled in with the real mitigations.
   Keep the permission.
2. **Token path audit:** confirm constant-time compare, `storage.session` (not
   `storage.local`) for the cached token, no token in logs, no token in a URL.
3. **Prompt-injection boundary:** wrap page text in an explicit data delimiter before it
   reaches the model; add the injection string test from the pack's §8 to the unit suite.
4. **Action budget:** make the documented limit (default 50) a tested constant, not a
   comment. Add a test that the 51st action is refused with a clear code.
5. **Dangerous-action confirmation:** assert that write/destructive tools cannot fire from
   a page-originated event alone.

**Files:** `SECURITY.md`, bridge auth module, content-script extraction, policy module,
`tests/unit/`.
**Verify:** `pnpm test` plus the six-item regression set in the pack §8.
**Rollback:** each item is a separate commit; revert individually.

### P2 — MCP contract (single source of truth)

**Goal:** 37 tools described once, classified once, tested once.

1. **One tool registry** (schema + `read | navigate | write | destructive` + description)
   that generates `docs/mcp-tools-reference.md` and the README table. Delete neither the
   docs nor the table — generate them.
2. **Error envelope** everywhere: `code`, `message`, `retryable`, optional `hint`. No stack
   traces to the model.
3. **Protocol version + tool count** reported at startup; unknown tool returns
   `UNKNOWN_TOOL`.
4. **Contract tests:** every tool validates a good payload and rejects a bad one; a snapshot
   test freezes the tool names so a rename fails CI.
5. **Deprecation policy:** names are frozen. A future rename adds `<name>_v2` and marks the
   old one deprecated with a removal date.

**Files:** `apps/mcp-server/src/**`, generated `docs/mcp-tools-reference.md`,
`tests/unit/mcp-contract.*`.
**Verify:** tool count printed equals 37; snapshot test passes; README table matches the
generated doc byte-for-byte.
**Rollback:** generation is additive; the old doc stays until the generated one is reviewed.

### P3 — UX, accessibility, docs, E2E

**Goal:** the surfaces a human touches are usable and the claims are reproducible.

1. **A11y pass** on popup, options and side panel: visible focus, full keyboard path,
   `aria-live` for connection status, 4.5:1 text contrast, `prefers-reduced-motion`
   respected, no icon-only button without a label.
2. **Status honesty:** replace the hard-coded test numbers with a command + date line, or a
   CI badge. Keep the “100% Passing” badge only if CI enforces it.
3. **E2E that actually loads the extension:** Playwright persistent context with
   `--load-extension=apps/chrome-extension/dist`, assert the service worker exists, then
   navigate/click/read DOM. A headless run without the extension is not evidence.
4. **Troubleshooting doc:** add the three failures users actually hit — bridge port taken,
   wrong token, extension not reloaded after rebuild.
5. **Optional, later:** `optional_host_permissions` onboarding for the curated top sites.
   This changes UX, so it needs its own approval and must keep `<all_urls>` as the fallback.

**Files:** `apps/chrome-extension/src/{popup,options,sidepanel}/**`, `README.md`, `docs/`,
`tests/e2e/`.
**Verify:** keyboard-only walkthrough; axe or equivalent report; `pnpm test:e2e` with the
real extension loaded; screenshot of the side panel in both themes.
**Rollback:** UI commits are independent; revert per screen.

---

## 4. Guardrails (non-negotiable)

- **37 MCP tools stay.** Count is asserted in a test; a rename is a deprecation, never a
  deletion.
- **No permission is removed without a replacement and an approval.** `<all_urls>` stays,
  documented.
- **No flow is removed** — popup, options, side panel, bridge, token setup, Ping, and the
  unpacked-install path all remain.
- **No secret in the repo.** `.drishti-token` stays ignored; a test asserts it.
- **No publish, tag or store submission** from an unapproved pipeline.
- **No “fix” that weakens a test** to make CI green.

---

## 5. Acceptance criteria

| Phase | Done when |
|---|---|
| P0 | CI pins SHAs, runs typecheck + version verify, and a tag build refuses a version mismatch; security contact is real |
| P1 | injection string is treated as data in a test; bad token closes the socket; action 51 is refused; `<all_urls>` has a written record |
| P2 | one registry generates both docs; contract tests cover 37 tools; names frozen by a snapshot |
| P3 | keyboard-only pass, axe report, E2E with the real extension, README numbers reproducible |

---

## 6. Out of scope

- Any write to the Drishti repository from this audit.
- Store publication, signing, or paid distribution.
- Removing `<all_urls>`, any permission, any tool, or any screen.
- Claims about Drishti's test results — those need a real run on the target machine.

---

## 7. How to use the skill pack

Load `atlas-project-architect/references/12-browser-extension-mcp.md` before touching a
manifest, the bridge, or a tool schema. It carries the MV3 lifecycle rules, the permission
budget, the message envelope, the bridge handshake, the MCP error shape, the six-test
regression set, and the anti-pattern table.

Delegate with the ATLAS team like this:

```text
Use the atlas-project-architect skill and references/12-browser-extension-mcp.md.

Task: implement P0 only from docs/DRISHTI-BROWSER-AI-PLAN.md.
Delegate:
- devops-engineer → pin actions, add typecheck + version:verify gates
- supply-chain-engineer → SHA pins and checksum, read-only review
- code-reviewer → final diff review

Rules: no feature, tool or permission removed. Every claim carries command + real output.
No commit, push or tag until I approve.
```

For P1 use `security-engineer` + `qa-engineer`; for P2 use `api-architect` +
`backend-engineer`; for P3 use `ui-ux-designer` + `accessibility-engineer` + `qa-engineer`.
Two to four roles per phase — never all 15.
