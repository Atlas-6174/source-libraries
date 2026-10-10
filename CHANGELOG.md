# Changelog

All notable changes to this fork are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/Atlas-6174/source-libraries/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Atlas-6174/source-libraries/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Atlas-6174/source-libraries/releases/tag/v0.1.0
