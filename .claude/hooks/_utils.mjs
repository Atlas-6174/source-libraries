// Utilidades compartidas por los hooks (Node >= 18, multiplataforma).
import { spawnSync } from "node:child_process";

export async function readInput() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  try { return JSON.parse(data || "{}"); } catch { return {}; }
}

// Ejecuta un comando; devuelve null si la herramienta no está instalada.
export function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", shell: process.platform === "win32" });
  if (r.error && r.error.code === "ENOENT") return null;
  if (r.status === 127 || /not (found|recognized)/i.test(r.stderr || "")) return null;
  return { code: r.status ?? 1, out: `${r.stdout || ""}${r.stderr || ""}`.trim() };
}

export const projectDir = () => process.env.CLAUDE_PROJECT_DIR || process.cwd();
