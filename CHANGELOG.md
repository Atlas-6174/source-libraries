# Changelog

All notable changes to this fork are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
