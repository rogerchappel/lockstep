# Lockstep

Lockstep is the quiet floor manager for folders full of JavaScript and TypeScript packages. It walks the workspace, reads every `package.json`, and tells you which projects have drifted away from the scripts and toolchain policy you expect.

It is local-first, deterministic, and intentionally boring: no SaaS, no telemetry, no surprise mutations. Just a crisp map before release work.

## Install

```sh
npm install
npm run build
npm link
```

Or run from a checkout:

```sh
node dist/src/cli.js scan .
```

## Quick start

Create a policy:

```sh
lockstep init --write-policy
```

Scan a workspace:

```sh
lockstep scan /Users/me/Developer --policy lockstep.config.json
```

Write Markdown for a release checklist:

```sh
lockstep scan . --format markdown --output DRIFT.md
```

Fail CI only when required-script errors are present:

```sh
lockstep scan . --fail-on-drift
```

Use stricter adoption gates when any warning should fail:

```sh
lockstep scan . --fail-on-warnings
```

## Runnable demo

The repository includes a small two-package workspace that shows a clean API package beside a web package with deliberate policy drift.

```sh
npm run build
bash examples/demo-scan.sh
```

The script writes a Markdown drift report to a temporary file and prints the first section for review.

To show the same fixture as a CI gate:

```sh
npm run build
bash examples/ci-gate-demo.sh
```

That script verifies the Markdown report contains the expected web package drift
and confirms `scan --fail-on-drift` exits non-zero for the fixture.

For structured output:

```sh
npm run build
bash examples/json-report-demo.sh
```

That script writes a JSON drift report and verifies the deliberately drifting
`@demo/web` package is present.

To turn the same JSON report into a maintainer checklist:

```sh
bash examples/remediation-checklist-demo.sh
```

That script writes a Markdown checklist from the fixture findings and verifies
the `@demo/web` script, engine, and package manager suggestions. See
[Remediation Checklist Demo](docs/tutorials/remediation-checklist.md).

For a stricter adoption gate that fails on warnings:

```sh
bash examples/warning-gate-demo.sh
```

That script writes a Markdown report and verifies `scan --fail-on-warnings`
exits non-zero for the deliberately drifting fixture. See
[Warning Gate Demo](docs/tutorials/warning-gate.md).

## What Lockstep checks

- Required scripts such as `test`, `check`, `build`, and `smoke`
- Validation commands that reference scripts that do not exist
- `engines.node` consistency
- `packageManager` presence and allowed manager prefixes
- Lockfile presence beside each manifest
- Additional ignored directory names from policy

## Policy example

```json
{
  "requiredScripts": ["test", "check", "build", "smoke"],
  "optionalScripts": ["lint", "release:check"],
  "validationCommands": ["npm test", "npm run check", "npm run build", "npm run smoke"],
  "requiredEngines": { "node": ">=20" },
  "allowedPackageManagers": ["npm@", "pnpm@"],
  "requirePackageManager": false,
  "requireLockfile": true,
  "ignoredDirectories": ["node_modules", "dist"]
}
```

## Safety posture

Lockstep scans files and writes reports only when you pass `--output` or `init --write-policy`. It does not execute package scripts, install dependencies, post results, collect secrets, or mutate packages.

## Package contents

The npm package allowlist includes the runtime files plus the public support
documents needed for release review: `README.md`, `LICENSE`, `SECURITY.md`, `SAFETY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
Run `npm run package:smoke` or `npm pack --dry-run` before publishing to
confirm those files are still present in the tarball.

## Verification

Run the package checks before opening a release PR:

```sh
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Small, fixture-backed changes are strongly preferred.

## Security

See [SECURITY.md](SECURITY.md). Please do not paste private manifests or secrets into public issues.

## License

MIT
