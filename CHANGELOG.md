# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Changed

- Toolchain alignment: TypeScript now declared at `^7.0.2` (latest stable
  compiler) and `@types/node` at the Node 24 LTS line (`^24.13.3`).
  `npm pack` already rebuilds `dist` via the `prepack` hook, so packaged
  output is always current.

### Added

- Initial project setup.

## Release Links

- Unreleased:
  `https://github.com/rogerchappel/lockstep/compare/...HEAD`
- Latest release:
  `https://github.com/rogerchappel/lockstep/releases/latest`

Replace placeholder links once the first release tag exists.
