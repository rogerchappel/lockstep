# Contributing to Lockstep

Thanks for helping keep package fleets marching together.

## Development loop

```sh
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Change guidelines

- Keep changes local-first and deterministic.
- Add or update fixtures for parser and reporting behavior.
- Prefer suggestions over mutation; if mutation is added later, it must be opt-in and previewable.
- Avoid dependencies unless they remove more risk than they add.
- Document new policy fields in the README and `docs/orchestration.json`.

## Pull request checklist

- [ ] Tests cover the behavior change.
- [ ] The CLI help and README still match reality.
- [ ] Reports remain deterministic for fixture workspaces.
- [ ] Security implications are called out for new file reads or writes.
