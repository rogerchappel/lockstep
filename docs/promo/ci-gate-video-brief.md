# Lockstep CI Gate Video Brief

## Angle

Lockstep turns package-script drift into a release checklist. The CI gate demo
shows a clean API package beside a deliberately drifting web package, then
proves `scan --fail-on-drift` exits non-zero for the fixture.

## 60-Second Flow

1. Open `examples/workspace-demo` and show the two package manifests.
2. Run `bash examples/ci-gate-demo.sh`.
3. Open the generated Markdown report and highlight the web package drift.
4. Run `bash examples/remediation-checklist-demo.sh`.
5. Show the checklist entries for script, engine, and package manager fixes.

## On-Screen Commands

```sh
npm install
npm run build
bash examples/ci-gate-demo.sh
bash examples/remediation-checklist-demo.sh
```

## Honest Limits

- Lockstep scans manifests and writes reports only when asked.
- It does not install dependencies, execute package scripts, mutate packages, or
  collect telemetry.
- The CI gate is a local evidence step; maintainers still choose which
  suggested remediation to apply.
