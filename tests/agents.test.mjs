/**
 * Black-box tests for the ATLAS sub-agent team.
 *
 * Runs the real generator in --check mode and validates the generated
 * frontmatter against the host formats published by OpenCode and Antigravity.
 * No dependencies: node:test + node:assert only.
 *
 * Run: node --test tests/agents.test.mjs
 */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const SKILL = path.join(REPO, 'atlas-project-architect');
const DATA = path.join(SKILL, 'agent-roles.json');
const AGENTS = path.join(SKILL, 'agents');
const GENERATOR = path.join(REPO, 'scripts', 'generate-agents.mjs');
const ROLE_MAP = path.join(REPO, 'ATLAS_AGENT_ROLE_MAP.md');
const REFERENCE = path.join(SKILL, 'references', '11-agent-team.md');

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const allowedTools = new Set(['view_file', 'grep_search', 'replace_file_content', 'run_command']);
const legacyFields = ['temperature', 'top_p', 'prompt', 'permission', 'tools', 'maxSteps'];

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  assert.ok(text.startsWith('---\n'), file + ': frontmatter must start the file');
  const end = text.indexOf('\n---\n', 4);
  assert.ok(end > 0, file + ': closing frontmatter delimiter missing');
  return { raw: text.slice(4, end), body: text.slice(end + 5) };
}

function run(args) {
  return spawnSync(process.execPath, [GENERATOR, ...args], {
    cwd: REPO,
    encoding: 'utf8',
    timeout: 30000
  });
}

test('agent-roles.json defines 15 unique, valid role IDs', () => {
  assert.equal(data.roles.length, 15);
  const ids = data.roles.map((r) => r.id);
  assert.deepEqual(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test('every role has a complete persona and a known preset', () => {
  for (const role of data.roles) {
    for (const key of ['title', 'description', 'activation', 'handoff']) {
      assert.equal(typeof role[key], 'string', role.id + ': ' + key);
      assert.ok(role[key].trim().length > 0, role.id + ': empty ' + key);
    }
    for (const key of ['reads', 'expertise', 'process', 'output', 'constraints', 'checklist']) {
      assert.ok(Array.isArray(role[key]) && role[key].length > 0, role.id + ': ' + key);
    }
    assert.ok(data.presets[role.preset], role.id + ': unknown preset');
  }
});

test('presets keep write and shell actions gated, never blanket allow', () => {
  for (const [name, preset] of Object.entries(data.presets)) {
    assert.equal(preset.opencode[0].action, '*');
    assert.equal(preset.opencode[0].effect, 'deny');
    for (const rule of preset.opencode) {
      if (rule.action === 'edit' || rule.action === 'shell') {
        assert.equal(rule.effect, 'ask', name + ': ' + rule.action + ' must ask');
      }
    }
    for (const tool of preset.antigravityTools) {
      assert.ok(allowedTools.has(tool), name + ': unverified tool ' + tool);
    }
  }
});

test('generator --check is a clean read-only drift gate', () => {
  const r = run(['--check']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /check OK: 30 agent files/);
});

test('generator rejects unknown arguments with usage exit 2', () => {
  const r = run(['--write-everywhere']);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Usage: node scripts\/generate-agents\.mjs/);
});

test('all 30 generated agent files exist with the five required sections', () => {
  const needed = ['## Activation', '## ATLAS contract', '## Prompt Defense Baseline', '## Handoff to parent', '## Quality checklist'];
  for (const host of ['opencode', 'antigravity']) {
    for (const role of data.roles) {
      const file = path.join(AGENTS, host, role.id + '.md');
      assert.ok(fs.existsSync(file), file + ' missing');
      const { body } = frontmatter(file);
      for (const section of needed) assert.ok(body.includes(section), file + ': ' + section + ' missing');
      assert.ok(body.includes('AUTO-GENERATED — DO NOT EDIT'), file + ': marker missing');
      assert.ok(body.includes('Never commit, push, deploy, publish'), file + ': approval boundary missing');
    }
  }
});

test('OpenCode frontmatter uses the verified V2 shape only', () => {
  for (const role of data.roles) {
    const file = path.join(AGENTS, 'opencode', role.id + '.md');
    const { raw } = frontmatter(file);
    assert.match(raw, /^description: "/m, role.id);
    assert.match(raw, /^mode: subagent$/m, role.id);
    assert.match(raw, /^permissions:$/m, role.id);
    assert.match(raw, /- action: "*"/, role.id);
    assert.match(raw, /effect: deny/, role.id);
    assert.ok(!/^model:/m.test(raw), role.id + ': model must be inherited');
    for (const field of legacyFields) {
      assert.ok(!new RegExp('^' + field + ':', 'm').test(raw), role.id + ': legacy field ' + field);
    }
  }
});

test('Antigravity frontmatter uses only documented fields and tool names', () => {
  for (const role of data.roles) {
    const file = path.join(AGENTS, 'antigravity', role.id + '.md');
    const { raw } = frontmatter(file);
    assert.match(raw, /^name: [a-z0-9-]+$/m, role.id);
    assert.match(raw, /^description: "/m, role.id);
    assert.match(raw, /^mainAgent: false$/m, role.id);
    assert.match(raw, /^subagent: true$/m, role.id);
    assert.match(raw, /^model: inherit$/m, role.id);
    assert.match(raw, /^commandExecutionPolicy: (off|sandbox)$/m, role.id);
    const tools = raw.split('tools:\n')[1].split('mainAgent:')[0]
      .split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.replace(/^-\s*/, ''));
    assert.ok(tools.length > 0, role.id + ': no tools');
    for (const tool of tools) assert.ok(allowedTools.has(tool), role.id + ': bad tool ' + tool);
  }
});

test('role map and agent-team reference are present and agree on 15 roles', () => {
  assert.ok(fs.existsSync(ROLE_MAP));
  assert.ok(fs.existsSync(REFERENCE));
  const map = fs.readFileSync(ROLE_MAP, 'utf8');
  const ref = fs.readFileSync(REFERENCE, 'utf8');
  for (const role of data.roles) {
    assert.ok(map.includes(role.id), 'role map missing ' + role.id);
    assert.ok(ref.includes(role.id), 'reference missing ' + role.id);
  }
});

after(() => {
  // --check and the usage test are read-only; nothing to clean up.
});
