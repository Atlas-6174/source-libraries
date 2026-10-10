# Changelog

All notable changes to this fork are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2026-10-10

### Changed
- The navigation's GitHub button links to and shows the star count of
  github.com/Atlas-6174/source-libraries instead of the upstream repository;
  accessibility issue reports go to this repository too.
- Build stage on Node 24.21.0 (Alpine 3.23), the current Node 24 LTS patch
  level; the Alpine 3.22 variant no longer receives Node 24 releases.
- Dependabot proposes only Node 24.x and nginx 1.30.x (stable) patch
  updates; moves to a new LTS or stable branch are deliberate.

### Security
- Dev tooling updated to the versions proposed by Dependabot: postcss 8.5.29,
  nanoid 3.3.20, brace-expansion 1.1.21/2.1.7, browserslist 4.29.3,
  baseline-browser-mapping 2.11.28, sharp 0.35.5, wrangler 4.149.0. Runtime
  dependencies had no advisories; the site output is unchanged.
- vite stays on 5.x for now; its dev-server advisories do not affect the
  image, which never runs the dev server.

### Removed
- Upstream directories this fork does not ship: native iOS/React Native ports,
  the standalone beam/gooey/orbs demo sites, `services/`, `cli/`, `skills/`,
  `Package.swift` and `.node-version`. This drops the lockfiles behind most
  Dependabot alerts; none of it was part of the image.
- An unused nested lockfile in `packages/metal-fx`.
- Maintainer tooling (`.claude/`, `CLAUDE.md`) and working notes
  (`docs/memory/`) are no longer published.

## [0.1.1] - 2026-10-10

### Added
- Maintainer credit for Atlas-6174 in the site footer, terms, README,
  LICENSE, NOTICE and the image's OCI `authors` label.

### Fixed
- CI browser check: 90 s DevTools timeout, since software WebGL on
  GPU-less runners keeps `/image` busy for about 45 s.

## [0.1.0] - 2026-10-10

### Added
- Docker image (Node 24 build, unprivileged nginx 1.30 runtime) and hardened
  `docker-compose.yml`: read-only filesystem, all capabilities dropped,
  resource and process limits, health check.
- nginx configuration: clean URLs, cache policy, Content-Security-Policy and
  security headers.
- Offline `pro-client.js` shim. It keeps the `window.LibrariesPro` API without
  any network calls.
- CI (typecheck, image build, vulnerability scan, browser network/CSP check),
  multi-arch release to GHCR, and Dependabot.
- Generic privacy notice and terms for self-hosted deployments.

- Source Libraries branding: wordmark, bookshelf mark and favicon, page
  titles and metadata; a visible footer credit to the original author and
  project.
- Studio, home, how-to-use and skill pages describe the free self-hosted
  Studio instead of paid plans.

### Security
- Runtime image applies Alpine security updates at build time (fixes
  CVE-2026-4775 in `tiff` from the nginx base image).

### Changed
- The Studio is open to everyone. Its presets are stored in the browser.
- Contact and feedback go to this repository's GitHub Issues.

### Removed
- Pricing, account, activation and checkout pages, and the Cloudflare gate
  function.
- GoatCounter analytics.
- All calls to the hosted `api.libraries.dev` service.
- Upstream deployment and npm publishing workflows.
- Pricing, sign-in and "Get Pro" entry points; the Pro skill and Pro commands
  sections.
- Upstream logo, Open Graph images, customer logos and testimonials, which
  would imply endorsement of this fork.

### Fixed
- Developer tuning panels no longer appear on localhost or LAN hosts, where
  self-hosted users run the site. They now show only under `vite dev` or with
  `?dev`.

[Unreleased]: https://github.com/Atlas-6174/source-libraries/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/Atlas-6174/source-libraries/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Atlas-6174/source-libraries/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Atlas-6174/source-libraries/releases/tag/v0.1.0
