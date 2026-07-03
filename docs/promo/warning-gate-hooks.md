# Warning Gate Social Hooks

Grounding: `examples/warning-gate-demo.sh` scans `examples/workspace-demo`,
writes a Markdown report, and verifies `--fail-on-warnings` fails for the
drifting fixture.

## Hooks

1. Sometimes a release checklist should stop on warnings, not only hard errors.
   `lockstep scan --fail-on-warnings` turns package drift into an early gate.

2. Demo beat: run `bash examples/warning-gate-demo.sh`, open the printed report,
   and show the deliberately drifting `@demo/web` package.

3. `lockstep` does not run package scripts while scanning. It reads manifests,
   compares them with policy, and writes reports when asked.

## Clip beats

1. Show `examples/workspace-demo/lockstep.config.json`.
2. Run the warning gate demo.
3. Open the Markdown report.
4. Explain why this fixture is expected to fail the stricter gate.
