import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ignoredDirectoryNames = new Set([
  '.git',
  '.hg',
  '.svn',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.turbo',
  '.cache'
]);

export async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

export interface DiscoveryOptions {
  ignoredDirectories?: string[];
}

export async function findPackageJsonFiles(root: string, options: DiscoveryOptions = {}): Promise<string[]> {
  const results: string[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const relativePath = join(directory.replaceAll('\\', '/').split('/').slice(root.replaceAll('\\', '/').split('/').length).join('/'), entry.name);
        const ignored = ignoredDirectoryNames.has(entry.name) || (options.ignoredDirectories ?? []).some((pattern) =>
          directoryGlobMatches(pattern, entry.name) || directoryGlobMatches(pattern, relativePath)
        );
        if (!ignored) await walk(join(directory, entry.name));
        continue;
      }
      if (entry.isFile() && entry.name === 'package.json') {
        results.push(join(directory, entry.name));
      }
    }
  }

  await walk(root);
  return results.sort();
}

function directoryGlobMatches(pattern: string, directoryName: string): boolean {
  const expression = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${expression}$`).test(directoryName);
}
