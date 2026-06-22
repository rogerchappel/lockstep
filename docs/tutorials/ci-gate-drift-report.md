# CI gate drift report demo

This recipe uses the checked-in `examples/workspace-demo` fixture to show both
sides of a release-readiness workflow: a Markdown report for humans and a
non-zero `--fail-on-drift` exit for CI.

## What the demo proves

- `lockstep scan` can write a Markdown drift report from fixture manifests.
- The report names the package with deliberate policy drift, `@demo/web`.
- The same scan can be run with `--fail-on-drift` to make required-script drift
  visible to CI.
- The demo runs locally and does not execute package scripts inside the scanned
  workspace.

## Run it from a checkout

```sh
npm install
npm run build
bash examples/ci-gate-demo.sh
```

The script writes its report to `${TMPDIR:-/tmp}/lockstep-ci-gate-drift.md`,
checks that expected drift text is present, then verifies that
`--fail-on-drift` exits non-zero for the fixture. The Markdown report command
itself exits zero after writing the report.

## Manual commands

```sh
node dist/src/cli.js scan examples/workspace-demo \
  --policy examples/workspace-demo/lockstep.config.json \
  --format markdown \
  --output /tmp/lockstep-ci-gate-drift.md

node dist/src/cli.js scan examples/workspace-demo \
  --policy examples/workspace-demo/lockstep.config.json \
  --fail-on-drift
```

## Promotion angle

This is a strong short demo because it shows Lockstep's two audiences in under a
minute: maintainers get a readable checklist, while CI gets an exit code that
stops release work when required scripts drift from policy.
