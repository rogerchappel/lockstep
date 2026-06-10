# Social Hooks

## Short Posts

1. `lockstep` is a local drift check for JavaScript and TypeScript workspaces: scan package manifests, compare them with a release policy, and write a Markdown checklist before the release scramble.

2. Demo idea: two packages, one policy. One package lines up, the other is missing scripts, package manager metadata, and the expected Node engine. `lockstep` turns that into a reviewable report.

3. Release prep gets easier when script drift is visible before CI. `lockstep scan . --format markdown --output DRIFT.md` gives maintainers a plain-text checklist they can commit or attach to a PR.

## Demo CTA

```sh
npm run build
bash examples/demo-scan.sh
```

