import { readFile } from 'node:fs/promises';
import type { LockstepPolicy } from './types.js';

export const defaultPolicy: LockstepPolicy = {
  requiredScripts: ['test', 'check', 'build', 'smoke'],
  optionalScripts: ['lint', 'format', 'release:check', 'package:smoke'],
  validationCommands: ['npm test', 'npm run check', 'npm run build', 'npm run smoke'],
  requiredEngines: {
    node: '>=20'
  },
  allowedPackageManagers: ['npm@', 'pnpm@'],
  requirePackageManager: false,
  requireLockfile: true
};

export function normalizePolicy(input: Partial<LockstepPolicy> = {}): LockstepPolicy {
  return {
    ...defaultPolicy,
    ...input,
    requiredScripts: input.requiredScripts ?? defaultPolicy.requiredScripts,
    optionalScripts: input.optionalScripts ?? defaultPolicy.optionalScripts,
    validationCommands: input.validationCommands ?? defaultPolicy.validationCommands,
    requiredEngines: {
      ...defaultPolicy.requiredEngines,
      ...input.requiredEngines
    },
    allowedPackageManagers: input.allowedPackageManagers ?? defaultPolicy.allowedPackageManagers
  };
}

export async function loadPolicy(path?: string): Promise<LockstepPolicy> {
  if (!path) return normalizePolicy();
  const raw = await readFile(path, 'utf8');
  const parsed = JSON.parse(raw) as Partial<LockstepPolicy>;
  return normalizePolicy(parsed);
}

export function policyJson(policy: LockstepPolicy = defaultPolicy): string {
  return `${JSON.stringify(policy, null, 2)}\n`;
}
