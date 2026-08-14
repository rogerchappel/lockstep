import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const expected = {
  name: '@rogerchappel/lockstep',
  repository: 'git+https://github.com/rogerchappel/lockstep.git',
};
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
const failures = [];

if (pkg.name !== expected.name) failures.push(`package name must be ${expected.name}`);
if (pkg.private !== true) failures.push('package must remain private for GitHub-only distribution');
if (pkg.repository?.url !== expected.repository) failures.push(`repository must be ${expected.repository}`);

const releaseTag = process.env.RELEASE_TAG;
if (releaseTag && releaseTag !== `v${pkg.version}`) {
  failures.push(`release tag ${releaseTag} must match package version v${pkg.version}`);
}

try {
  const published = execFileSync('npm', ['view', pkg.name, 'name', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  if (published) failures.push(`${pkg.name} exists on npm; review the GitHub-only identity before releasing`);
} catch (error) {
  const stderr = error.stderr?.toString() ?? '';
  if (!stderr.includes('E404')) failures.push(`could not verify npm registry identity: ${stderr.trim()}`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`${pkg.name}@${pkg.version} is ready for GitHub-only release`);
