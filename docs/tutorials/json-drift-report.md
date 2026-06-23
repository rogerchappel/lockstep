# JSON Drift Report

This tutorial shows the same two-package demo workspace as the Markdown
tutorial, but writes JSON for dashboards, release scripts, or review bots that
need structured drift data.

## Run the Demo

```sh
npm install
bash examples/json-report-demo.sh
```

The script builds the CLI, scans `examples/workspace-demo`, writes a temporary
JSON report, and verifies that the report includes the deliberately drifting
`@demo/web` package.

## What to Show

Use the JSON report when the demo audience cares about automation. The summary
shows package and finding counts, while each package entry keeps the concrete
policy findings reviewable without executing package scripts.

## Boundary

Lockstep reads manifests and policy files. It does not install dependencies,
run package scripts, publish packages, or mutate workspace packages during a
scan.
