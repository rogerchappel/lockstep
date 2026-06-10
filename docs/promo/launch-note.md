# Launch Note Draft

`lockstep` scans JavaScript and TypeScript package workspaces and reports drift from the scripts and toolchain policy maintainers expect before release work.

The current demo uses `examples/workspace-demo`: an API package that matches policy beside a web package missing `check`, `smoke`, the expected Node engine, and package manager metadata.

## What to Show

- `npm run build`
- `bash examples/demo-scan.sh`
- The Markdown drift report with package inventory and suggested fixes.

## Limits

- Lockstep reads package manifests and writes reports.
- It does not run package scripts.
- It is a pre-release visibility tool, not a replacement for CI or package tests.

