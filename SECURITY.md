# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| `1.x` | Yes |
| `< 1.0` | No |

Only the latest `1.x` release receives fixes.

## Reporting a vulnerability

**Do not open a public issue for a security problem.**

Use GitHub's private reporting channel:

1. Go to <https://github.com/SudhirDevOps1/atlas-skill/security/advisories/new>
2. Describe the issue, the affected file, and the impact.
3. Include a reproduction (command, input, observed output) if you have one.

If the form is unavailable, open a minimal public issue that says only
"security report — please contact me privately" with no technical detail.

## What to expect

- Acknowledgement: best effort, aim within 7 days. There is no SLA.
- If confirmed, a fix and a coordinated advisory. Credit is given unless you
  ask otherwise.
- If declined, a short explanation of why.

## Scope

In scope:

- `atlas-project-architect/scripts/version.mjs` — path traversal, unintended
  file writes, rollback failure, command injection through crafted input.
- `scripts/install-skill.mjs` — writing outside the requested destination,
  overwriting without `--force`, following a symlink out of the target, or
  deleting its own source through a case-variant path.
- `scripts/setup-project.mjs` — writing outside the target project, touching
  global agent config, clobbering an existing server or file without `--force`,
  leaking a secret into a generated config, or leaving a backup readable by git.
- `scripts/generate-agents.mjs` — emitting a file outside `agents/`, or writing a
  permission broader than the role SSOT declares.
- Prompt content that could cause an agent to exfiltrate secrets, run
  untrusted code, or destroy data without approval.

Out of scope:

- The behaviour of third-party agents (Claude Code, Codex, Cursor, Antigravity,
  OpenCode, …). Report those to their vendors.
- A model ignoring the skill's instructions. Models are not deterministic; the
  skill reduces risk, it does not enforce it.
- The MCP servers the setup tool configures (`context7`, Playwright, GitHub,
  Supabase). They are third-party processes; this repository only writes the
  connection entry.
- Findings that require an already-compromised machine or a malicious local
  user with write access to the repository.

## Safe harbour

Security research on this repository is welcome when it stays inside it: do
not attack GitHub, the agents listed above, or any third-party service, and do
not access data that is not yours. Good-faith research that follows this policy
will not be pursued.

## Secrets

The repository contains no credentials and needs none. If you find one, report
it privately and do not copy it into the report body.
