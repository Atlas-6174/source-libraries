// PreToolUse (Bash): si el comando es "git commit", escanea lo staged con gitleaks y bloquea si hay secretos.
import { readInput, run, projectDir } from "./_utils.mjs";

const input = await readInput();
const cmd = input?.tool_input?.command || "";
if (!/\bgit\s+commit\b/.test(cmd)) process.exit(0);

let g = run("gitleaks", ["git", "--staged", "--no-banner", "--redact"], projectDir());
if (g && /unknown command/i.test(g.out)) g = run("gitleaks", ["protect", "--staged", "--no-banner", "--redact"], projectDir());
if (g === null) {
  console.error("[pre-commit-guard] gitleaks no está instalado: no se puede verificar que el commit esté libre de secretos. Pide al usuario instalar gitleaks o que haga el commit manualmente.");
  process.exit(2);
}
if (g.code !== 0) {
  console.error(`[pre-commit-guard] Commit bloqueado: posibles secretos en cambios staged.\n${g.out.slice(0, 2000)}`);
  process.exit(2);
}
process.exit(0);
