import { equal, ok } from 'node:assert/strict';
import { test } from 'node:test';
import { loadPolicy } from '../src/policy.js';
import { scanWorkspace } from '../src/scanner.js';

test('scans packages and reports deterministic drift', async () => {
  const policy = await loadPolicy('tests/fixtures/workspace/lockstep.config.json');
  const report = await scanWorkspace('tests/fixtures/workspace', policy, new Date('2026-01-01T00:00:00.000Z'));
  equal(report.summary.packageCount, 3);
  ok(report.findings.some((finding) => finding.packageName === 'drifty-package' && finding.category === 'script'));
  ok(report.findings.some((finding) => finding.packageName === 'drifty-package' && finding.category === 'packageManager'));
  ok(report.findings.some((finding) => finding.packageName === 'weird-package' && finding.category === 'lockfile'));
});
