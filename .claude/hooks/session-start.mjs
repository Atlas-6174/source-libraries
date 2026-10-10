// SessionStart: inyecta la memoria y las políticas activas en el contexto.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { projectDir } from "./_utils.mjs";

const mem = join(projectDir(), "docs", "memory");
const files = ["PROJECT_STATE.md", "PERF_BUDGETS.md", "LICENSE_POLICY.md"];
const parts = [];
for (const f of files) {
  const p = join(mem, f);
  if (existsSync(p)) parts.push(`--- ${f} ---\n${readFileSync(p, "utf8").slice(0, 4000)}`);
  else parts.push(`--- ${f} --- (no existe; sugiere ${f === "PROJECT_STATE.md" ? "/kickoff" : f === "PERF_BUDGETS.md" ? "/perf-budget" : "/licenses"})`);
}
console.log(`[Memoria del proyecto]\n${parts.join("\n\n")}`);
