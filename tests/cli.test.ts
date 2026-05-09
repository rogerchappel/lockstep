import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { match, ok } from 'node:assert/strict';
import { test } from 'node:test';

const execFileAsync = promisify(execFile);

test('cli writes policy and markdown drift report', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'lockstep-test-'));
  try {
    const policyPath = join(temp, 'lockstep.config.json');
    await execFileAsync(process.execPath, ['dist/cli.js', 'init', '--write-policy', '--output', policyPath]);
    const policy = await readFile(policyPath, 'utf8');
    match(policy, /requiredScripts/);

    const outputPath = join(temp, 'DRIFT.md');
    await execFileAsync(process.execPath, ['dist/cli.js', 'scan', 'tests/fixtures/workspace', '--policy', 'tests/fixtures/workspace/lockstep.config.json', '--format', 'markdown', '--output', outputPath]);
    const report = await readFile(outputPath, 'utf8');
    match(report, /Lockstep Drift Report/);
    match(report, /drifty-package/);
    ok(report.includes('suggestion') || report.includes('Suggestion'));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});


test('cli exposes strict warning failure option in help', async () => {
  const result = await execFileAsync(process.execPath, ['dist/cli.js', '--help']);
  match(result.stdout, /--fail-on-warnings/);
});
