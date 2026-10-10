# Source Libraries

A self-hosted build of the seven open-source React effect libraries from
[Libraries.dev](https://github.com/Jakubantalik/Libraries.dev) by Jakub Antalik,
with their playgrounds and the Studio workbench open to everyone. It runs as a single
static container: no accounts, no payments, no analytics, no backend.

| Library | npm |
| --- | --- |
| Border beam | `border-beam` |
| Thinking orbs | `thinking-orbs` |
| Bot avatars | `bot-avatars` |
| Gooey | `liquid-gooey` |
| Voice | `voice-glow` |
| Metal | `metal-fx` |
| Image | `img-fx` |

> This is an independent fork. It is not affiliated with or endorsed by
> Libraries.dev. Pro content from the hosted Libraries.dev service (Pro presets,
> recipes, the Pro skill) is proprietary and is **not** included. See
> [ADR-0001](docs/adr/0001-fork-scope.md).

## Maintainer

Source Libraries is created and maintained by [Atlas-6174](https://github.com/Atlas-6174). It is
the self-hosted fork with the Studio open to everyone. The libraries and the
original site were created by [Jakub Antalik](https://github.com/Jakubantalik).

## Requirements

- Docker Engine 25+ with Compose v2 (Docker Desktop on macOS and Windows; WSL2
  backend on Windows).
- Images are built for `linux/amd64` and `linux/arm64`.

## Run it

```bash
cp .env.example .env        # optional: change the port or bind address
docker compose up -d --build
docker compose ps           # wait for "healthy"
```

Open <http://127.0.0.1:8080>. The Studio is at <http://127.0.0.1:8080/studio/app>
(desktop browsers).

To run a published image instead of building:

```bash
IMAGE=ghcr.io/atlas-6174/source-libraries:<version> docker compose up -d --no-build
```

Stop with `docker compose down`.

### Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `HOST_BIND` | `127.0.0.1` | Interface the port binds to. Use `0.0.0.0` only behind a TLS reverse proxy. |
| `HOST_PORT` | `8080` | Host port. |
| `IMAGE` | `ghcr.io/atlas-6174/source-libraries:local` | Image to build or run. |

### Exposing it publicly

The container serves plain HTTP on port 8080. Put it behind a reverse proxy that
terminates TLS and sets `Strict-Transport-Security`. Before sharing it, edit
`sites/home/privacy.html` and `sites/home/terms.html` to name yourself as the
operator.

## What differs from upstream

- The Studio gate is off, and `pro-client.js` is replaced by an offline shim, so
  no request reaches `api.libraries.dev`. Studio presets are kept in the
  browser's local storage.
- Pricing, account and checkout pages are removed (their URLs redirect to the
  Studio). The analytics tag is removed. Feedback goes to this repo's GitHub
  Issues.
- The Studio's AI agent needs a backend and an Anthropic API key, so it is
  disabled; manual controls work fully.
- Served by unprivileged nginx with a Content-Security-Policy and hardened
  Compose settings.

## Development

```bash
npm ci
npm run build:site-home       # every library + the site
npm run dev -w @sites/home    # dev server
npm run typecheck
node scripts/verify-site.mjs http://127.0.0.1:8080 "<path to Chrome>"   # network/CSP check
```

Use Node 24 (LTS), the version the container build uses.

## Syncing with upstream

`main` is this fork's integration branch: upstream history plus the fork's
changes. Upstream updates arrive through a pull request:

```bash
git remote add upstream https://github.com/Jakubantalik/Libraries.dev.git   # once
git remote set-url --push upstream DISABLED                                  # once
git fetch upstream
git checkout -b chore/sync-upstream-YYYY-MM-DD main
git merge upstream/main      # resolve conflicts in the fork's files
# verify (see Development), then open a pull request to main
```

This fork removes upstream directories it does not ship: native ports
(`packages/*/ports`), the standalone demo sites (`sites/beam`, `sites/gooey`,
`sites/orbs`), `services/`, `cli/`, `skills/` and `Package.swift`. When a sync
reports a modify/delete conflict on them, keep the deletion:

```bash
git status --short | awk '$1=="DU"||$1=="UD"{print $2}' | xargs git rm -q
```

The fork keeps its changes to upstream files small so that syncing stays cheap:
`pro-client.js`, a few lines in `site.js`, `src/studio/main.tsx`, `agent.ts` and
`vite.config.ts`, and the legal pages.

## License

MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE). The original copyright belongs to
Jakub Antalik. `metal-fx` includes Paper Shaders (Apache-2.0).
