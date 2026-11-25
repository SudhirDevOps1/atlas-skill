# Project setup — one command, one project, approval first

`scripts/setup-project.mjs` installs the portable ATLAS stack into **one existing
project directory**:

1. the `atlas-project-architect` skill,
2. the 15 generated sub-agent files for OpenCode and Antigravity,
3. four MCP server entries — `context7`, `playwright`, `github`, `supabase`. Three are
   read-only by construction; Playwright is a **local browser-automation process**, not a
   read-only server.

It is a zero-dependency Node 22+ CLI. It never touches global config, never writes a
token, and never modifies a repository other than the one passed to `--project`.

> **Approval rule:** a preview writes nothing. A write requires an explicit
> `--apply`. Never run it across many repositories without a separate, scoped
> approval for each one.

---

## Usage

```bash
# 1. preview (default — always safe)
node scripts/setup-project.mjs --project /path/to/project

# 2. apply after reviewing the preview
node scripts/setup-project.mjs --project /path/to/project --apply

# 3. only if you intentionally want to replace local edits (backups are made)
node scripts/setup-project.mjs --project /path/to/project --apply --force

# inspect the supported paths and endpoints
node scripts/setup-project.mjs --list

# narrow the scope
node scripts/setup-project.mjs --project /path/to/project --hosts opencode --components agents
```

Flags: `--project <dir>`, `--hosts <opencode,antigravity>`,
`--components <skill,agents,mcp>`, `--apply`, `--dry-run`, `--force`, `--list`,
`--help`.

Exit codes: `0` success, `1` validation/target error, `2` usage error.

---

## What is written

All paths are relative to `--project`. The target directory must already exist.

| Component | OpenCode | Antigravity |
|---|---|---|
| Skill | `.agents/skills/atlas-project-architect/` | same shared folder |
| Agents | `.opencode/agents/<id>.md` (15 files) | `.agents/agents/<id>.md` (15 files) |
| MCP config | `opencode.json` → `mcp.servers.<name>` | `.agents/mcp_config.json` → `mcpServers.<name>` |

The skill lives in `.agents/skills/` because both hosts discover that path.
Agent files are host-specific and are generated from
`atlas-project-architect/agent-roles.json`; do not hand-edit them.

Verified against vendor documentation on **2026-11-24**:

- OpenCode skills/agents: <https://opencode.ai/docs/skills/>, <https://opencode.ai/docs/agents/>
- OpenCode MCP (`mcp.servers`, not names directly under `mcp`): <https://opencode.ai/docs/mcp-servers/>
- Antigravity agents: <https://antigravity.google/docs/subagents>
- Antigravity MCP (`.agents/mcp_config.json`, `serverUrl`/`command`): <https://antigravity.google/docs/mcp>
- Agent path matrix: <https://github.com/vercel-labs/skills/blob/HEAD/docs/agents.md>

If a vendor changes a path, the vendor's documentation wins.

---

## Three MCP servers are read-only; Playwright is local automation

| Server | Endpoint / command | What it can do by default |
|---|---|---|
| `context7` | `https://mcp.context7.com/mcp` | Documentation lookups only; no project write tools. |
| `playwright` | `npx -y @playwright/mcp@0.0.86` | **Not read-only.** A local stdio browser process that can click, type and navigate. Pinned to an exact version so a re-run cannot silently pull a new build. No credentials are written to config. |
| `github` | `https://api.githubcopilot.com/mcp/readonly` | Official remote **read-only** toolset. OAuth is done in the host. |
| `supabase` | `https://mcp.supabase.com/mcp?read_only=true&features=database,docs` | Queries run as a read-only Postgres user; only database + docs tool groups. |

Sources checked 2026-11-24:
<https://opencode.ai/docs/mcp-servers/>,
<https://raw.githubusercontent.com/github/github-mcp-server/main/docs/remote-server.md>
(the `/readonly` path and `X-MCP-Readonly` header),
<https://supabase.com/docs/guides/getting-started/mcp> (`read_only=true`,
`features=...`), and <https://antigravity.google/docs/mcp>.

The script deliberately does **not** add:

- a Postgres server or `DATABASE_URI` (no secret is written; Postgres stays disabled),
- write-enabled GitHub or Supabase endpoints,
- Sentry, Figma or other unapproved integrations,
- any global/user-level MCP configuration.

Existing servers with the same name are **kept unchanged**. If you already
configured `github` with your own toolsets or auth, the script will not replace
it — use a different project or manage that connection manually.

---

## Safety behaviour

- **Default is preview.** Without `--apply` the CLI prints the plan and writes
  nothing.
- **Preflight before planning.** Invalid JSON, a non-object `mcp.servers` /
  `mcpServers`, an existing `opencode.jsonc`, or a file where the tool needs a
  directory causes an error before any write. Every existing segment of the
  target path is checked, not just the final folder.
- **BOM-safe.** A config saved by PowerShell 5.1 starts with a UTF-8 BOM; it is
  parsed and written back with the BOM intact instead of being rejected.
- **No clobber.** Existing skill folders, agent files and MCP entries are kept
  unless `--force` is passed.
- **No no-op churn.** If every requested server already exists, the file is not
  reformatted and no backup is made.
- **Backups.** Any replacement under `--force` is copied to
  `.atlas-setup/backups/<timestamp>/` before the write. That folder contains a
  `.gitignore` with `*`, so a backup holding an existing config with credentials
  never reaches git.
- **Secret guard.** Config values are checked for token-like patterns before
  being written. No PAT, OAuth client secret, DSN or project ref is accepted.
- **Source guard.** The ATLAS source repository and its subfolders are refused
  as targets — this tool installs *into* projects, not over its own source.
- **Idempotent.** Running it twice makes no changes the second time.
- **Resumable, not transactional.** If a write fails mid-run, the actions already
  completed stay in place and the error names the count and the backup folder.
  Re-run the same command to resume. Only `version.mjs` rolls back.

---

## After applying

1. Open a **new** agent session so the host re-scans skills, agents and MCP.
2. In OpenCode, run `opencode mcp list` or `/mcps`; in Antigravity use the MCP
   Servers manager. If GitHub or Supabase shows `needs authentication`, sign in
   through the host — no token goes into the project file.
3. Invoke the skill explicitly (`@atlas-project-architect`) or let the host load
   it by description. Sub-agents are available as responsibility boundaries;
   the parent agent remains the sole coordinator unless the host actually loads
   the sub-agent files.

---

## Verification

From the ATLAS repository:

```bash
node --check scripts/setup-project.mjs
node --test tests/setup-project.test.mjs
pnpm run verify
```

`tests/setup-project.test.mjs` is black-box: it runs the real CLI against
throwaway directories and checks the dry-run, install counts, nested OpenCode
`mcp.servers` shape, the four endpoints (three read-only), idempotence, BOM handling, no-op
rewrites, the backup `.gitignore`, preflight refusals and `--force`.

For a real project, start with the preview and read every line before adding
`--apply`.
