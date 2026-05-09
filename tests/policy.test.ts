import { deepEqual, equal, match } from 'node:assert/strict';
import { test } from 'node:test';
import { normalizePolicy, policyJson } from '../src/policy.js';

test('normalizes partial policy with safe defaults', () => {
  const policy = normalizePolicy({ requiredScripts: ['test'] });
  deepEqual(policy.requiredScripts, ['test']);
  equal(policy.requiredEngines?.node, '>=20');
  equal(policy.requireLockfile, true);
});

test('serializes a policy suitable for lockstep init', () => {
  const rendered = policyJson();
  match(rendered, /"requiredScripts"/);
  match(rendered, /"validationCommands"/);
});
