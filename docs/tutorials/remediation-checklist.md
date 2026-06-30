# Remediation Checklist Demo

This recipe shows how a maintainer can turn Lockstep's structured drift report
into a concrete release-prep checklist.

## Run it

```sh
npm install
bash examples/remediation-checklist-demo.sh
```

The script scans `examples/workspace-demo`, writes the JSON report, then derives
a Markdown checklist under `${TMPDIR:-/tmp}/lockstep-remediation-checklist`.

## What it demonstrates

- `@demo/api` matches the policy and stays quiet.
- `@demo/web` is missing required `check` and `smoke` scripts.
- `@demo/web` has a Node engine mismatch and missing package manager metadata.
- The generated checklist keeps each suggested fix tied to package, category,
  and severity.

This is useful for a short release-prep clip: show the scan, open the checklist,
and explain that Lockstep does not run package scripts or mutate manifests.
