// PostToolUse (Edit|Write|MultiEdit): linter + escaneo de secretos del archivo editado.
// Exit 2 => Claude recibe stderr y debe corregir. Herramientas ausentes => aviso sin bloquear.
import { extname, relative } from "node:path";
import { readInput, run, projectDir } from "./_utils.mjs";

const input = await readInput();
const file = input?.tool_input?.file_path;
if (!file) process.exit(0);
const cwd = projectDir();
const ext = extname(file).toLowerCase();
const problems = [], missing = [];

const linters = {
  ".js": ["npx", ["--no-install", "eslint", file]], ".jsx": ["npx", ["--no-install", "eslint", file]],
  ".ts": ["npx", ["--no-install", "eslint", file]], ".tsx": ["npx", ["--no-install", "eslint", file]],
  ".mjs": ["npx", ["--no-install", "eslint", file]], ".vue": ["npx", ["--no-install", "eslint", file]],
  ".py": ["ruff", ["check", file]],
  ".go": ["gofmt", ["-l", file]],
  ".rs": ["rustfmt", ["--check", file]],
  ".sh": ["shellcheck", [file]],
};

if (linters[ext]) {
  const [cmd, args] = linters[ext];
  const r = run(cmd, args, cwd);
  if (r === null) missing.push(cmd === "npx" ? "eslint" : cmd);
  else if (r.code !== 0 && !/could not determine executable|ESLint couldn't find a config/i.test(r.out))
    problems.push(`Linter (${cmd === "npx" ? "eslint" : cmd}):\n${r.out.slice(0, 3000)}`);
  else if (ext === ".go" && r.out) problems.push(`gofmt: el archivo no está formateado.`);
}

// gitleaks >= 8.19 usa "dir"; versiones anteriores usan "detect --no-git".
let g = run("gitleaks", ["dir", file, "--no-banner", "--redact"], cwd);
if (g && /unknown command/i.test(g.out)) g = run("gitleaks", ["detect", "--no-git", "--source", file, "--no-banner", "--redact"], cwd);
if (g === null) missing.push("gitleaks");
else if (g.code !== 0) problems.push(`gitleaks detectó posibles secretos en ${relative(cwd, file)}. Elimínalos y usa variables de entorno.`);

if (problems.length) {
  console.error(`[post-edit] Corrige antes de continuar:\n\n${problems.join("\n\n")}`);
  process.exit(2);
}
if (missing.length) console.log(`[post-edit] Herramientas no instaladas: ${[...new Set(missing)].join(", ")}. Considera proponer su instalación.`);
process.exit(0);
