# Lecciones aprendidas

<!-- Formato: - YYYY-MM-DD — Error: … | Causa: … | Regla para evitarlo: … -->

- 2026-10-10 — Compose v5 rechaza `pids_limit` junto a `deploy.resources.limits` ("can't set distinct values"). Usar `deploy.resources.limits.pids`. Validar siempre con `docker compose config -q`.
- 2026-10-10 — `docker image ls` muestra tamaño descomprimido (containerd store); para presupuestos de imagen medir comprimido (`docker save | gzip | wc -c` o tamaño de capas en el registro).
- 2026-10-10 — Hook `post-edit.mjs`: con npm 11, `npx --no-install eslint` sin eslint instalado devuelve "npx canceled due to missing packages", que el hook no reconoce como herramienta ausente y bloquea (falso positivo). Propuesta de corrección pendiente de aprobación.
- 2026-10-10 — Chrome headless usa viewport 800×600: el Studio muestra "desktop only" (`.st-locked`), no el gate. Fijar 1440×900 vía `Emulation.setDeviceMetricsOverride` en pruebas.
- 2026-10-10 — En nginx, regex de rutas sin anclar (`^/(me|...)`) captura `/metal`; anclar siempre con `$` o `/`.
- 2026-10-10 — `docker run ... | tail` oculta el exit code del comando; verificar con `>/dev/null; echo $?` o `pipefail`.
- 2026-10-10 — Dependabot no actualiza imágenes referenciadas vía `ARG` en `FROM`; ponerlas literales en `FROM` con tag@digest.
