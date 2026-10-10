---
description: Define o reevalúa interactivamente la política de licencias de dependencias
argument-hint: [motivo opcional: ej. "pasamos a SaaS comercial"]
---
Gestiona la política de licencias según §17 de CLAUDE.md. Motivo: $ARGUMENTS

**Cuándo activarla:**
- Al ejecutar `/kickoff` o `/licenses`.
- Automáticamente, antes de agregar la primera dependencia si `LICENSE_POLICY.md` no existe.
- Cuando cambie el contexto: el proyecto pasa a comercial, se distribuye a clientes, se ofrece como SaaS, cambia la licencia propia o se incorpora un cliente con requisitos legales.

**Cómo construirla (preguntas, con default sugerido):**
1. ¿Modelo del proyecto? (personal / open source / comercial cerrado / interno de empresa)
2. ¿Forma de entrega? (SaaS / binario o app distribuida / librería / solo uso interno)
3. ¿Licencia propia del proyecto? (MIT, Apache-2.0, GPL-3.0, propietaria…)
4. ¿Restricciones del cliente o la organización? (listas aprobadas, requisitos de auditoría)

Con las respuestas, clasifica en tres listas: **Permitidas**, **Requieren aprobación**, **Prohibidas**. Referencia orientativa:
- Comercial cerrado y distribuido → copyleft fuerte (GPL, AGPL) prohibido; LGPL/MPL requieren aprobación.
- SaaS cerrado → AGPL y SSPL prohibidas; GPL requiere aprobación.
- Open source → compatible con la licencia propia del proyecto.

Pasos:

1. Lee `docs/memory/PROJECT_STATE.md` y, si existe, `docs/memory/LICENSE_POLICY.md`.
2. Deduce lo que puedas del contexto (licencia del repo, README, brief). Pregunta solo lo que falte, máximo 4 preguntas, con default sugerido:
   modelo del proyecto, forma de entrega, licencia propia, restricciones del cliente u organización.
3. Si la política ya existe, identifica qué cambió y qué reglas se ven afectadas.
4. Propón la política en tres listas (Permitidas / Requieren aprobación / Prohibidas) con una línea de justificación por categoría.
5. Si hay herramientas disponibles (p. ej. `license-checker`, `pip-licenses`, `cargo-deny`, `go-licenses`), audita las dependencias actuales y lista las que violan la nueva política.
6. Tras la aprobación del usuario, escribe `docs/memory/LICENSE_POLICY.md` y registra el cambio en `DECISIONS.md`.

Aclara que es una guía técnica, no asesoría legal.
