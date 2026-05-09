import { readdir, readFile } from 'node:fs/promises';
import { dirname, relative } from 'node:path';
import type { PackageRecord } from './types.js';

const lockfileNames = new Set(['package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb']);

interface PackageJsonShape {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  engines?: Record<string, string>;
  packageManager?: string;
  private?: boolean;
}

export async function readPackage(root: string, packageJsonPath: string): Promise<PackageRecord> {
  const raw = await readFile(packageJsonPath, 'utf8');
  const parsed = JSON.parse(raw) as PackageJsonShape;
  const directory = dirname(packageJsonPath);
  const entries = await readdir(directory, { withFileTypes: true });
  const lockfiles = entries.filter((entry) => entry.isFile() && lockfileNames.has(entry.name)).map((entry) => entry.name).sort();
  const relativePath = relative(root, directory) || '.';

  return {
    name: parsed.name ?? relativePath,
    version: parsed.version,
    relativePath,
    packageJsonPath,
    scripts: parsed.scripts ?? {},
    engines: parsed.engines ?? {},
    packageManager: parsed.packageManager,
    lockfiles,
    private: parsed.private
  };
}
