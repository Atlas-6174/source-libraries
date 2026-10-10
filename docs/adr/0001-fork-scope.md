# ADR-0001: Fork scope and the Pro content boundary

- **Status:** Accepted
- **Date:** 2026-10-10

## Context

Libraries.dev publishes seven React effect libraries and its website, including
the Studio workbench, under the MIT License. The hosted service gates the Studio
behind a paid plan and serves extra Pro content (presets, variants, recipes and
the Pro skill) from a private API (`api.libraries.dev`), under separate,
non-redistributable terms. The goal is a free, self-hosted deployment of the open
code.

## Decision

- Fork the MIT repository and keep upstream history on `main`.
- Open the Studio by turning off its client gate and replacing `pro-client.js`
  with an offline shim. Remove the pricing, account and checkout pages and the
  edge gate function.
- Ship only what the repository publishes under MIT. Never fetch, proxy, scrape
  or redistribute content from `api.libraries.dev`, and do not use the
  Libraries.dev brand except to credit the original project.
- Run without a backend: Studio presets live in `localStorage`, there are no
  accounts or analytics, and the AI agent is disabled.

## Consequences

- Users get every library, playground and Studio control for free, with no
  personal data processed by the operator beyond web server logs.
- Pro presets and recipes are not available. If upstream ever releases them
  under an open license, they can be added without architectural changes.
- Fork changes to upstream files are kept minimal, so syncing upstream stays
  cheap.
- [Not legally verified] The upstream terms describe the Studio as paid content,
  although its code is published under MIT. Validate this with the author or a
  lawyer before wide distribution.
