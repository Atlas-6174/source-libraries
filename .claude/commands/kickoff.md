---
description: Entrevista de descubrimiento multiángulo y creación del brief del proyecto
argument-hint: [idea o descripción breve del proyecto]
---
Inicia el descubrimiento del proyecto según §2.2 de CLAUDE.md. Idea inicial del usuario: $ARGUMENTS

1. Si ya existe `docs/memory/PROJECT_STATE.md`, resúmelo y pregunta si se trata de un proyecto nuevo o de una redefinición.
2. Haz la entrevista en lotes de máximo 5 preguntas, priorizadas por impacto, cada una con un valor por defecto sugerido. Cubre: objetivo, usuarios, alcance/MVP, stack, datos y privacidad, seguridad, despliegue y SO, UI/UX, operación.
3. En el último lote incluye: modelo de negocio y forma de entrega (para §17 licencias) y si hay UI web o API (para §16 rendimiento).
4. Adapta cada lote a las respuestas anteriores: no preguntes lo ya respondido ni lo deducible.
5. Al terminar:
   - Escribe el brief en `docs/memory/PROJECT_STATE.md`.
   - Propón `PERF_BUDGETS.md` y `LICENSE_POLICY.md` a partir de las plantillas y las respuestas.
   - Propón estructura de repositorio, stack y primeros 3 incrementos.
6. Pide confirmación antes de crear cualquier código o estructura.
