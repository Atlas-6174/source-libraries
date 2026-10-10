# Registro de decisiones

| Fecha | Decisión | Motivo | Alternativas descartadas | ADR |
|---|---|---|---|---|
| YYYY-MM-DD | | | | |
| 2026-10-10 | /doctor: recortadas tablas derivables de CLAUDE.md (§4.6, §10, §14, §15) y movido el detalle de §17 a `.claude/commands/licenses.md` | Reducir contexto residente (~600-900 tokens est.); contenido deducible o de carga diferida | Mantener CLAUDE.md sin cambios | — |
| 2026-10-10 | Eliminado `.mcp.json` del proyecto; MCP_DOCKER se define solo en ámbito de usuario (`--profile software_development`) | Evitar definición duplicada y divergente | Mantener la de proyecto (perfil por defecto) | — |
| 2026-10-10 | Fork self-hosted MIT de Jakubantalik/Libraries.dev con Studio abierto, sin backend de pago | Código del Studio es MIT en el repo; objetivo de despliegue local en Docker | Extraer contenido Pro de api.libraries.dev (descartado: propietario, eludiría control de acceso) | [ADR-0001](../adr/0001-fork-scope.md) |
| 2026-10-10 | Sitio estático en nginx no root, multi-stage, multi-arch, publicado en GHCR; presets en localStorage | Sin PII ni cuentas; despliegue trivial para usuarios externos | Backend propio con cuentas; servidor Node | — |
| 2026-10-10 | Historia de upstream preservada: `main` parte de `upstream/main`; remoto upstream solo lectura | Sincronización barata con mejoras de las librerías | Snapshot sin historia | — |
| 2026-10-10 | Presupuesto JS propio para Studio ≤ 450 KB gzip (resto ≤ 250 KB) | Workbench de escritorio; dividir el código divergiría de upstream | Code-splitting por librería en el fork | — |
| 2026-10-10 | `pro-client.js` sustituido por shim offline con la misma API `window.LibrariesPro` (todos con acceso, presets en localStorage, sin red) en lugar de editar ~17 páginas | Diff mínimo frente a upstream: sincronizar sigue siendo barato | Borrar pro-client.js y editar cada página/consumidor | — |
| 2026-10-10 | Eliminada analítica GoatCounter (20 páginas) y feedback redirigido a mismo origen (503) | Brief: sin analítica ni datos personales hacia terceros (enviaba visitas/emails al autor upstream) | Bloquear solo por CSP | — |
| 2026-10-10 | CSP con `script-src 'unsafe-inline'` (sin `unsafe-eval`); connect-src limitado a self + api.npmjs.org + api.github.com; Google Fonts permitido | Upstream usa 42 scripts inline y 16 handlers on*; refactor divergiría de upstream. Sin eval, el código inyectable vía preset no ejecuta | Hashes CSP (no cubren handlers on*); self-hosting de fuentes (propuesto) | — |
| 2026-10-10 | Canal de contacto/feedback del fork = GitHub Issues de Atlas-6174/source-libraries (sustituye mailto del autor upstream) | Auditoría inc. 2 (medio): datos del usuario dirigidos a un tercero que no opera el despliegue | Formulario con backend propio; ocultar feedback | — |
| 2026-10-10 | Hook post-edit: npm 11 'npx canceled due to missing packages' = herramienta ausente (aviso), no error | Falso positivo bloqueante (LESSONS 2026-10-10); aprobado por el usuario | Instalar eslint | — |
| 2026-10-10 | `main` = rama de integración del fork; sincronización con upstream vía PR `chore/sync-upstream-*` | `main` diverge al integrar PRs del fork; un espejo ff-only sería imposible | `main` espejo + rama `fork` separada | — |
| 2026-10-10 | CI solo en ubuntu-latest (+ arm64 vía QEMU en release) | El entregable es un contenedor Linux; runners Windows/macOS no ejecutan contenedores Linux. Desviación declarada de §11 (matriz multi-SO) | Matriz multi-SO | — |
| 2026-10-10 | Trivy ejecutado desde imagen oficial fijada por digest sobre tarball (no trivy-action); `apk upgrade` en runtime | Precaución ante incidente de supply chain recordado en trivy-action [NO VERIFICADO]; CVE-2026-4775 (tiff) presente en la base | trivy-action fijado por SHA; esperar a nueva base | — |
