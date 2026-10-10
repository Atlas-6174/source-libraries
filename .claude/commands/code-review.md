---
description: Revisión integral del cambio actual (calidad, seguridad, rendimiento, licencias)
argument-hint: [alcance opcional: archivo, carpeta o rama]
---
Revisa el cambio actual. Alcance: $ARGUMENTS (si está vacío, usa `git diff` y `git diff --staged`).

1. **Calidad:** cumplimiento de la DoD (§4.6), legibilidad, manejo de errores, tests que cubran el cambio.
2. **Seguridad y privacidad:** delega al subagente `security-auditor` si el cambio toca auth, datos personales, dependencias, criptografía o infraestructura.
3. **Rendimiento:** compara contra `docs/memory/PERF_BUDGETS.md`; mide si hay riesgo de degradación.
4. **Licencias:** verifica dependencias nuevas contra `docs/memory/LICENSE_POLICY.md`.
5. **Accesibilidad** (si hay UI): WCAG 2.2 AA.
6. Ejecuta linter, type-check y tests; reporta resultados reales.

Formato: hallazgos como `[CRÍTICO|ALTO|MEDIO|BAJO] título — archivo:línea — corrección`, y veredicto final: APROBADO / APROBADO CON OBSERVACIONES / CAMBIOS REQUERIDOS. No modifiques archivos: solo reporta y propone.
