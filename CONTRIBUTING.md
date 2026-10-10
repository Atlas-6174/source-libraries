# Contributing

Thanks for helping. A few rules keep this fork easy to sync with upstream:

1. **Library fixes belong upstream.** Changes to `packages/*` should go to
   <https://github.com/Jakubantalik/Libraries.dev>. Here, only patch what the
   self-hosted build needs.
2. **Keep diffs to upstream files small.** Prefer configuration (nginx, the
   `pro-client.js` shim) over editing many pages.
3. **Never add hosted Pro content** (Pro presets, recipes, the Pro skill) or code
   that fetches it. See [ADR-0001](docs/adr/0001-fork-scope.md).

## Workflow

- Branch from `main`: `feat/…`, `fix/…`, `chore/…` or `docs/…`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) in English, in
  the imperative.
- Before opening a pull request:

  ```bash
  npm ci && npm run typecheck
  docker compose build
  docker compose up -d && node scripts/verify-site.mjs http://127.0.0.1:8080 "<Chrome path>"
  ```

- Update `CHANGELOG.md` under *Unreleased*.

## Licensing

By contributing, you agree that your contributions are licensed under the MIT
License. New dependencies must use a permissive license (MIT, BSD, Apache-2.0, ISC or
similar). Copyleft (GPL, AGPL, SSPL) and source-available licenses are not
accepted.
