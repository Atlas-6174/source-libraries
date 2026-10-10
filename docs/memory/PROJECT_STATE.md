# Estado del proyecto

## Brief (aprobado 2026-10-10)
- **Qué es:** fork self-hosted y rebrandeado **Source Libraries** (wordmark tipográfico; aviso legal genérico) del monorepo MIT `Jakubantalik/Libraries.dev` (upstream analizado: commit `bcaf88f`, 2026-10-09).
- **Problema que resuelve:** el sitio en la nube exige suscripción Pro para abrir el Studio (workbench de personalización); el código del Studio es MIT y se publica abierto, sin backend de pago, desplegable con Docker.
- **Usuarios:** el mantenedor y usuarios finales externos que lo levantan en local con `docker compose`.
- **Criterio de éxito:** `docker compose up -d` sirve el sitio + Studio abierto en Linux/macOS/Windows; sin llamadas a `api.libraries.dev`; presupuestos de `PERF_BUDGETS.md` cumplidos; imagen publicada en GHCR.
- **Alcance MVP:** 7 librerías (`packages/*`), sitio `sites/home` con playgrounds y Studio con `GATE_ENABLED=false`; presets de usuario en `localStorage`; UI en inglés, diseño original, solo rebranding.
- **Fuera de alcance:** contenido Pro alojado en `api.libraries.dev` (presets/recetas/variantes/Pro skill: propietario, no está en el repo); auth, billing, cuentas; agente IA del Studio (incremento opcional futuro, requiere `ANTHROPIC_API_KEY` propia); uso de la marca/dominio Libraries.dev.
- **Licencia del fork:** MIT, conservando copyright de Jakub Antalik + nuevo titular; `metal-fx` conserva su `NOTICE` (Paper Shaders, Apache-2.0).
- **Datos personales:** ninguno (sin cuentas, sin backend, sin analítica).
- **Repositorio:** público en cuenta personal de GitHub; remoto `upstream` de solo lectura; sincronización manual documentada.

## Stack
- Node 20, npm workspaces, React 18, Vite 5, TypeScript 5, three 0.149 (heredado de upstream).
- Docker multi-stage: build Node 20 → runtime nginx no root (multi-arch amd64/arm64).
- CI: GitHub Actions (typecheck, build, escaneo de imagen, publicación a GHCR).

## Estado actual (2026-10-10)
- Git inicializado: `main` = `upstream/main` (bcaf88f); remotos `upstream` (push deshabilitado) y `origin` = github.com/Atlas-6174/source-libraries (vacío, sin push aún).
- Incremento 1 en rama `chore/bootstrap` (commits 2a312ca + fixes de auditoría: Node 24 LTS, digests, --ignore-scripts, pids): Dockerfile multi-stage, nginx no root, compose endurecido. Build OK; smoke test OK (rutas limpias, redirect /avatars, headers, healthy ~1 s); imagen 36.4 MB gzip.
- Incremento 2 en rama `feat/open-studio`: Studio abierto (shim offline de pro-client.js), sin llamadas a api.libraries.dev ni analítica, páginas de pago eliminadas (redirigen a /studio/app), CSP. Verificado en Chrome headless: 16 páginas, 0 peticiones a libraries.dev/goatcounter, 0 violaciones CSP; typecheck OK. Auditoría inc. 2: APROBADA con observaciones; corregidos feedback/contacto, fallback de agent.ts y CSP sin blob:.
- Incremento 3a en rama `chore/publishable-repo`: privacy/terms genéricos, README/LICENSE/NOTICE/CHANGELOG/SECURITY/CONTRIBUTING, ADR-0001, CI (typecheck, presupuesto de imagen, Trivy, verify-site) + release GHCR multi-arch + Dependabot; workflows upstream eliminados; hook post-edit corregido.
- Auditoría 3a aplicada (fix/audit-3a, adeb622). Incremento 3b en rama `feat/rebrand`: rebranding completo, copy sin Pro, logos/testimonios eliminados, paneles dev solo en `vite dev`/`?dev`. verify-site 16/16, typecheck OK, presupuestos OK (Studio 389/450 KB, máx. 195/250 KB, imagen 36.5/50 MB).

## Próximo paso
- Push de ramas a origin y PR(s) a main (requiere confirmación del usuario); tras merge y CI verde, tag v0.1.0 → release GHCR.

## Bloqueos / preguntas abiertas
- [NO VERIFICADO jurídicamente] `terms.html` de upstream describe el Studio como contenido Pro aunque su código esté bajo MIT en el repo; recomendado validar con el autor o un abogado antes de difundir públicamente.
