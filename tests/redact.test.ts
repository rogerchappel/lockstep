import { equal } from 'node:assert/strict';
import { test } from 'node:test';
import { redactText } from '../src/redact.js';

test('redacts common token shapes', () => {
  equal(redactText('token npm_abcdefghijklmnopqrstuvwxyz'), 'token [REDACTED]');
  equal(redactText('remote https://user:secret@example.com/repo'), 'remote https://[REDACTED]example.com/repo');
});
