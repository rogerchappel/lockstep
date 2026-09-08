import { deepEqual, equal } from 'node:assert/strict';
import { test } from 'node:test';
import { analyzePackage, npmScriptFromValidationCommand } from '../src/drift.js';
import { normalizePolicy } from '../src/policy.js';
import type { PackageRecord } from '../src/types.js';

const packageRecord: PackageRecord = {
  name: 'example',
  relativePath: 'packages/example',
  packageJsonPath: 'packages/example/package.json',
  scripts: {
    test: 'node --test',
    check: 'tsc --noEmit'
  },
  engines: {
    node: '>=20'
  },
  packageManager: 'npm@10.0.0',
  lockfiles: ['package-lock.json']
};

function validationFindings(commands: string[]) {
  return analyzePackage(packageRecord, normalizePolicy({
    requiredScripts: [],
    validationCommands: commands
  })).filter((finding) => finding.category === 'validation');
}

test('accepts npm validation commands with trailing script arguments', () => {
  deepEqual(validationFindings([
    'npm test -- --runInBand',
    'npm run check -- --pretty false'
  ]), []);
});

test('reports a missing npm script when its validation command has arguments', () => {
  const findings = validationFindings(['npm run missing -- --verbose']);

  equal(findings.length, 1);
  equal(
    findings[0]?.message,
    'Validation command "npm run missing -- --verbose" cannot run because script "missing" is absent.'
  );
});

test('recognizes npm script syntaxes and supported flags', () => {
  equal(npmScriptFromValidationCommand('npm test'), 'test');
  equal(npmScriptFromValidationCommand('npm run check'), 'check');
  equal(npmScriptFromValidationCommand('npm --silent run check'), 'check');
  equal(npmScriptFromValidationCommand('npm run --if-present check'), 'check');
  equal(npmScriptFromValidationCommand('npm --workspace packages/example test'), 'test');
});

test('ignores built-ins and malformed or ambiguous commands', () => {
  for (const command of [
    'npm ci', 'npm install', 'npm exec tsc', 'npm run',
    'npm --unknown run check', 'npm run check && npm run test'
  ]) {
    equal(npmScriptFromValidationCommand(command), undefined, command);
  }
});

test('does not report npm built-ins as missing package scripts', () => {
  deepEqual(validationFindings(['npm ci', 'npm install', 'npm exec tsc']), []);
});
