# Lecciones aprendidas

<!-- Formato: - YYYY-MM-DD — Error: … | Causa: … | Regla para evitarlo: … -->

- 2026-10-10 — Compose v5 rechaza `pids_limit` junto a `deploy.resources.limits` ("can't set distinct values"). Usar `deploy.resources.limits.pids`. Validar siempre con `docker compose config -q`.
- 2026-10-10 — `docker image ls` muestra tamaño descomprimido (containerd store); para presupuestos de imagen medir comprimido (`docker save | gzip | wc -c` o tamaño de capas en el registro).
