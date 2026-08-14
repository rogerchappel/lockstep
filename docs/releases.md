# Releases

Lockstep is distributed through GitHub Releases, not the npm registry. Its
manifest identity is `@rogerchappel/lockstep` and `private: true` is intentional:
it prevents an accidental npm publication or collision with the unrelated
unscoped `lockstep` package.

Before tagging, run `npm run release:check`. The identity check verifies the
manifest, repository, npm registry status, and (when `RELEASE_TAG` is set) that
the tag is exactly `v<package version>`. The release workflow attaches the
packed tarball to the matching GitHub release.

Install a release directly from GitHub:

```sh
npm install github:rogerchappel/lockstep#v0.1.0
```
