/**
 * Black-box tests for scripts/setup-project.mjs
 *
 * Every test runs the real CLI as a child process against throwaway
 * directories. No dependencies: node:test + node:assert only.
 *
 * Run: node --test tests/setup-project.test.mjs
 */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const CLI = path.join(REPO, 'scripts', 'setup-project.mjs');

const temps = [];
after(() => {
  for (const dir of temps) fs.rmSync(dir, { recursive: true, force: true });
});

function tmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-setup-'));
  temps.push(dir);
  return dir;
}

function project() {
  const dir = path.join(tmp(), 'demo');
  fs.mkdirSync(dir);
  return dir;
}

function run(args, { cwd = REPO } = {}) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
  });
  return { code: r.status, out: `${r.stdout || ''}${r.stderr || ''}` };
}

const exists = (...p) => fs.existsSync(path.join(...p));
const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(...p), 'utf8'));

function allFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? allFiles(full) : [full];
  });
}

test('--list prints the verified paths and read-only endpoints', () => {
  const r = run(['--list']);
  assert.equal(r.code, 0);
  for (const text of [
    'COMPONENTS',
    '.agents/skills',
    '.opencode/agents',
    '.agents/agents',
    'opencode.json',
    '.agents/mcp_config.json',
    'https://mcp.context7.com/mcp',
    'https://api.githubcopilot.com/mcp/readonly',
    'read_only=true',
  ]) {
    assert.match(r.out, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${text}`);
  }
  for (const component of ['skill', 'agents', 'mcp']) {
    assert.match(r.out, new RegExp(`^  ${component}$`, 'm'), `missing component ${component}`);
  }
});

test('default run is a dry-run and writes nothing', () => {
  const dir = project();
  const r = run(['--project', dir]);
  assert.equal(r.code, 0);
  assert.match(r.out, /\[dry-run\] PLAN/);
  assert.equal(allFiles(dir).length, 0);
});

test('--apply installs the skill once, 15 agents per host and read-only MCP configs', () => {
  const dir = project();
  const r = run(['--project', dir, '--apply']);
  assert.equal(r.code, 0, r.out);

  assert.ok(exists(dir, '.agents', 'skills', 'atlas-project-architect', 'SKILL.md'));
  assert.equal(allFiles(path.join(dir, '.agents', 'skills', 'atlas-project-architect')).length, 52);
  assert.equal(fs.readdirSync(path.join(dir, '.opencode', 'agents')).filter((f) => f.endsWith('.md')).length, 15);
  assert.equal(fs.readdirSync(path.join(dir, '.agents', 'agents')).filter((f) => f.endsWith('.md')).length, 15);

  const oc = readJSON(dir, 'opencode.json');
  assert.equal(oc.$schema, 'https://opencode.ai/config.json');
  assert.deepEqual(Object.keys(oc.mcp.servers).sort(), ['context7', 'github', 'playwright', 'supabase']);
  assert.equal(oc.mcp.servers.github.url, 'https://api.githubcopilot.com/mcp/readonly');
  assert.match(oc.mcp.servers.supabase.url, /read_only=true/);
  assert.deepEqual(oc.mcp.servers.playwright.command, ['npx', '-y', '@playwright/mcp@latest']);

  const ag = readJSON(dir, '.agents', 'mcp_config.json');
  assert.deepEqual(Object.keys(ag.mcpServers).sort(), ['context7', 'github', 'playwright', 'supabase']);
  assert.equal(ag.mcpServers.github.serverUrl, 'https://api.githubcopilot.com/mcp/readonly');
  assert.match(ag.mcpServers.supabase.serverUrl, /read_only=true/);

  for (const file of ['opencode.json', path.join('.agents', 'mcp_config.json')]) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    assert.doesNotMatch(text, /gh[pousr]_|sk-[A-Za-z0-9_-]{16}|AKIA|Bearer\s+\S|DATABASE_URI/);
  }
});

test('a second apply is idempotent', () => {
  const dir = project();
  assert.equal(run(['--project', dir, '--apply']).code, 0);
  const r = run(['--project', dir, '--apply']);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /new files:\s+0/);
  assert.match(r.out, /kept files:\s+31/);
  assert.match(r.out, /existing servers kept: 8/);
  assert.equal(exists(dir, '.atlas-setup', 'backups'), false);
});

test('existing MCP servers and unrelated config keys are preserved', () => {
  const dir = project();
  fs.writeFileSync(path.join(dir, 'opencode.json'), JSON.stringify({
    model: 'example/model',
    mcp: { servers: { github: { type: 'remote', url: 'https://custom.example/mcp', oauth: false } } },
  }, null, 2));

  const r = run(['--project', dir, '--apply']);
  assert.equal(r.code, 0, r.out);
  const oc = readJSON(dir, 'opencode.json');
  assert.equal(oc.model, 'example/model');
  assert.equal(oc.mcp.servers.github.url, 'https://custom.example/mcp');
  assert.equal(oc.mcp.servers.github.oauth, false);
  assert.equal(oc.mcp.servers.context7.type, 'remote');
});

test('invalid existing JSON is refused during dry-run', () => {
  const dir = project();
  const config = path.join(dir, '.agents', 'mcp_config.json');
  fs.mkdirSync(path.dirname(config), { recursive: true });
  fs.writeFileSync(config, '{ "mcpServers": oops }');

  const r = run(['--project', dir]);
  assert.equal(r.code, 1);
  assert.match(r.out, /not valid strict JSON/);
  assert.equal(exists(dir, '.agents', 'skills'), false);
  assert.equal(exists(dir, '.opencode', 'agents'), false);
});

test('a non-object container is refused', () => {
  const dir = project();
  fs.writeFileSync(path.join(dir, 'opencode.json'), '{ "mcp": "nope" }');
  const r = run(['--project', dir]);
  assert.equal(r.code, 1);
  assert.match(r.out, /mcp\.servers must be an object/);
});

test('an existing opencode.jsonc blocks the merge instead of being guessed', () => {
  const dir = project();
  fs.writeFileSync(path.join(dir, 'opencode.jsonc'), '{\n  // comment\n  "model": "x"\n}');
  const r = run(['--project', dir, '--apply']);
  assert.equal(r.code, 1);
  assert.match(r.out, /opencode\.jsonc exists/);
  assert.equal(exists(dir, 'opencode.json'), false);
});

test('--components and --hosts limit what is written', () => {
  const dir = project();
  const r = run(['--project', dir, '--apply', '--hosts', 'opencode', '--components', 'agents']);
  assert.equal(r.code, 0, r.out);
  assert.equal(exists(dir, '.opencode', 'agents', 'api-architect.md'), true);
  assert.equal(exists(dir, '.agents'), false);
  assert.equal(exists(dir, 'opencode.json'), false);
});

test('--force replaces a local edit and keeps a backup', () => {
  const dir = project();
  assert.equal(run(['--project', dir, '--apply']).code, 0);
  const agent = path.join(dir, '.opencode', 'agents', 'api-architect.md');
  fs.writeFileSync(agent, 'local edit\n');

  const kept = run(['--project', dir, '--apply']);
  assert.equal(kept.code, 0);
  assert.equal(fs.readFileSync(agent, 'utf8'), 'local edit\n');

  const forced = run(['--project', dir, '--apply', '--force']);
  assert.equal(forced.code, 0, forced.out);
  assert.match(forced.out, /backup:/);
  assert.doesNotMatch(fs.readFileSync(agent, 'utf8'), /^local edit$/m);
  assert.ok(allFiles(path.join(dir, '.atlas-setup', 'backups')).some((f) =>
    fs.readFileSync(f, 'utf8') === 'local edit\n'));
});

test('bad usage and unsafe targets are rejected', () => {
  assert.equal(run([]).code, 2);
  assert.equal(run(['--project']).code, 2);
  assert.equal(run(['--project', REPO]).code, 1);
  assert.equal(run(['--project', path.join(REPO, 'atlas-project-architect')]).code, 1);
  assert.equal(run(['--project', path.join(tmp(), 'missing')]).code, 1);

  const dir = project();
  assert.equal(run(['--project', dir, '--hosts', 'nope']).code, 2);
  assert.equal(run(['--project', dir, '--components', 'nope']).code, 2);
  assert.equal(run(['--project', dir, '--bogus']).code, 2);
});
