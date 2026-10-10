# Presupuestos de rendimiento

> Aprobados 2026-10-10. Superar un presupuesto requiere aprobación y registro en DECISIONS.md.

**Aplica a este proyecto:** Web estática (sitio + Studio). API: No aplica — sin backend propio.

## Web (Core Web Vitals, percentil 75)
| Métrica | Presupuesto | Medición |
|---|---|---|
| LCP | ≤ 2.5 s | Lighthouse CI |
| INP | ≤ 200 ms | Lighthouse CI / RUM |
| CLS | ≤ 0.1 | Lighthouse CI |
| JS inicial por página (gzip) | ≤ 250 KB (medido: 11/12 páginas cumplen) | Análisis de bundle en CI |
| JS inicial Studio `studio/app.html` (gzip) | ≤ 450 KB (medido 401 KB; herramienta de escritorio, código upstream intacto) | Análisis de bundle en CI |
| CSS inicial (gzip) | ≤ 50 KB | Análisis de bundle en CI |
| Lighthouse Performance | ≥ 90 (móvil) | Lighthouse CI |

## API
No aplica (sitio estático servido por nginx).

## Otros
| Métrica | Presupuesto |
|---|---|
| Tamaño de imagen Docker (comprimida, por arquitectura) | ≤ 50 MB — medido 36.4 MB (2026-10-10) |
| Arranque contenedor → healthy | ≤ 5 s |
