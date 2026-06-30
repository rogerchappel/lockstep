# Remediation Checklist Hooks

Pair these drafts with `bash examples/remediation-checklist-demo.sh`.

## Short Posts

1. `lockstep` does not just say a workspace drifted. The JSON report gives
   package, category, severity, and suggested fix fields that can become a
   release-prep checklist.

2. Demo angle: scan the two-package fixture, then open the generated checklist.
   `@demo/api` is quiet; `@demo/web` needs `check`, `smoke`, Node `>=20`, and
   package manager metadata.

3. Before a release branch turns into CI archaeology, run a local policy scan
   and hand maintainers a plain Markdown list of package fixes.

## Clip CTA

```sh
bash examples/remediation-checklist-demo.sh
```

Show the JSON report first, then the generated Markdown checklist.
