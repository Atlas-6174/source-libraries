---
description: Define o ajusta los presupuestos de rendimiento del proyecto
argument-hint: [tipo de proyecto opcional: web, api, móvil, cli]
---
Gestiona los presupuestos de rendimiento según §16 de CLAUDE.md. Contexto: $ARGUMENTS

1. Lee `docs/memory/PROJECT_STATE.md` y, si existe, `docs/memory/PERF_BUDGETS.md`.
2. Determina qué aplica (web, API, móvil, CLI o "No aplica"). Pregunta solo lo que falte: usuarios y dispositivos objetivo, red típica, escala esperada.
3. Propón presupuestos partiendo de los valores por defecto de la plantilla, ajustados al contexto y justificados.
4. Indica cómo se medirá cada métrica (herramienta y, si es posible, paso de CI).
5. Tras la aprobación, escribe `docs/memory/PERF_BUDGETS.md` y registra la decisión en `DECISIONS.md`.
