import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { deepEqual, equal, match, ok, rejects } from 'node:assert/strict';
import { test } from 'node:test';

const execFileAsync = promisify(execFile);

test('cli writes policy and markdown drift report', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'lockstep-test-'));
  try {
    const policyPath = join(temp, 'lockstep.config.json');
    await execFileAsync(process.execPath, ['dist/src/cli.js', 'init', '--write-policy', '--output', policyPath]);
    const policy = await readFile(policyPath, 'utf8');
    match(policy, /requiredScripts/);

    const outputPath = join(temp, 'DRIFT.md');
    await execFileAsync(process.execPath, ['dist/src/cli.js', 'scan', 'tests/fixtures/workspace', '--policy', 'tests/fixtures/workspace/lockstep.config.json', '--format', 'markdown', '--output', outputPath]);
    const report = await readFile(outputPath, 'utf8');
    match(report, /Lockstep Drift Report/);
    match(report, /drifty-package/);
    ok(report.includes('suggestion') || report.includes('Suggestion'));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});


test('cli exposes strict warning failure option in help', async () => {
  const result = await execFileAsync(process.execPath, ['dist/src/cli.js', '--help']);
  match(result.stdout, /--fail-on-warnings/);
});


test('parser handles flags and positionals deterministically', async () => {
  const cli = await import('../src/cli.js');
  const parsed = cli.parseArgs(['workspace', '--format', 'json', '--fail-on-drift']);
  equal(parsed.positionals[0], 'workspace');
  equal(parsed.values.format, 'json');
  equal(parsed.values['fail-on-drift'], true);
});

test('init rejects unknown flags and operands before writing output', async () => {
  const cli = await import('../src/cli.js');
  const temp = await mkdtemp(join(tmpdir(), 'lockstep-test-'));
  const output = join(temp, 'nested', 'policy.json');
  try {
    await rejects(cli.run(['init', '--ouptut', output]), /Unknown option "--ouptut"/);
    await rejects(cli.run(['init', '--format', 'json']), /Unknown option "--format"/);
    await rejects(cli.run(['init', 'extra', '--write-policy', '--output', output]), /Too many operands for init/);
    await rejects(readFile(output, 'utf8'), { code: 'ENOENT' });
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('scan rejects unknown flags and surplus operands before loading policy', async () => {
  const cli = await import('../src/cli.js');
  const missingPolicy = join(tmpdir(), 'lockstep-policy-that-does-not-exist.json');
  await rejects(cli.run(['scan', '.', '--polciy', missingPolicy]), /Unknown option "--polciy"/);
  await rejects(cli.run(['scan', '.', '--write-policy']), /Unknown option "--write-policy"/);
  await rejects(cli.run(['scan', '.', 'extra', '--policy', missingPolicy]), /Too many operands for scan/);
});

test('scan ignores npm built-ins while validating npm script commands', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'lockstep-validation-'));
  try {
    await writeFile(join(temp, 'package.json'), JSON.stringify({ name: 'fixture', scripts: { test: 'node --test' } }));
    const policy = join(temp, 'lockstep.config.json');
    await writeFile(policy, JSON.stringify({
      requiredScripts: [], optionalScripts: [],
      validationCommands: ['npm ci', 'npm install', 'npm exec tsc', 'npm --silent test', 'npm run --if-present check']
    }));
    const result = await execFileAsync(process.execPath, ['dist/src/cli.js', 'scan', temp, '--policy', policy, '--format', 'json']);
    const report = JSON.parse(result.stdout);
    deepEqual(report.findings.filter((item: { category: string }) => item.category === 'validation').map((item: { message: string }) => item.message), [
      'Validation command "npm run --if-present check" cannot run because script "check" is absent.'
    ]);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
