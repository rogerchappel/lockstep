# Warning Gate Demo

This demo shows the stricter adoption gate for maintainers who want warnings to
fail before release work starts.

## Run it

```sh
bash examples/warning-gate-demo.sh
```

The script builds the local CLI, scans `examples/workspace-demo`, writes a
Markdown report, and verifies that `--fail-on-warnings` exits non-zero for the
deliberately drifting `@demo/web` package.

## What it checks

- The demo workspace report includes `@demo/web`.
- The report calls out package manager drift.
- `lockstep scan --fail-on-warnings` can be used as a stricter local or CI gate.

## Expected output

The script prints the temporary Markdown report path. The non-zero warning gate
is expected for this fixture and is handled by the demo script.
