#!/usr/bin/env node
// End-to-end check of a running Source Libraries container in headless Chrome.
//
// For every page it records requests to other hosts, CSP violations, console
// errors and uncaught exceptions, and it checks that the Studio workbench opens
// without a session. It fails when:
//   - a request goes to a host outside ALLOWED_HOSTS (e.g. api.libraries.dev,
//     analytics),
//   - the browser reports a CSP violation or an uncaught exception,
//   - the Studio shows its locked screen instead of the workbench.
//
// It speaks the Chrome DevTools Protocol directly over WebSocket, so it has
// no npm dependencies (Node >= 22).
//
// Usage: node scripts/verify-site.mjs [baseUrl] [chromePath]
//   baseUrl     default http://127.0.0.1:8080
//   chromePath  default $CHROME_PATH, or a well-known path for the OS

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ALLOWED_HOSTS = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "api.npmjs.org",
  "api.github.com",
]);
const PAGES = ["/", "/beam", "/orbs", "/bots", "/gooey", "/voice", "/metal", "/image",
  "/studio", "/studio/app", "/skill", "/how-to-use", "/introduction", "/accessibility",
  "/terms", "/privacy"];
const SETTLE_MS = Number(process.env.VERIFY_SETTLE_MS) || 3500;

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];

const base = (process.argv[2] || "http://127.0.0.1:8080").replace(/\/$/, "");
const chrome = process.argv[3] || process.env.CHROME_PATH || CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("verify-site: no Chrome found; pass its path or set CHROME_PATH.");
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "verify-site-"));
// Port 0: Chrome picks a free port and writes it to DevToolsActivePort.
const args = ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"];
// Hosted CI runners may not allow Chrome's user-namespace sandbox.
if (process.env.CI) args.push("--no-sandbox");
const proc = spawn(chrome, [...args, "about:blank"], { stdio: "ignore" });

async function connect() {
  for (let i = 0; i < 75; i++) {
    try {
      const [port, path] = readFileSync(join(profile, "DevToolsActivePort"), "utf8").split("\n");
      const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
      await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
      return ws;
    } catch {
      await sleep(200);
    }
  }
  throw new Error("Chrome did not expose DevTools");
}

let ws;
async function cleanup() {
  try { ws?.close(); } catch { /* already closed */ }
  proc.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}

try {
  ws = await connect();
} catch (err) {
  console.error(`verify-site: ${err.message}`);
  await cleanup();
  process.exit(2);
}

let nextId = 0;
const pending = new Map();
const listeners = new Set();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else {
    listeners.forEach((fn) => fn(msg));
  }
};
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++nextId;
  const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
  pending.set(id, (msg) => { clearTimeout(timer); resolve(msg); });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});

const siteHost = new URL(base).host;
const failures = [];

try {
  for (const path of PAGES) {
    const { result: { targetId } } = await send("Target.createTarget", { url: "about:blank" });
    const { result: { sessionId } } = await send("Target.attachToTarget", { targetId, flatten: true });
    const hosts = new Set();
    const errors = [];
    let status = null;
    const onEvent = (m) => {
      if (m.sessionId !== sessionId) return;
      if (m.method === "Network.requestWillBeSent") {
        const url = new URL(m.params.request.url);
        if (/^https?:$/.test(url.protocol) && url.host !== siteHost) hosts.add(url.host);
      } else if (m.method === "Network.responseReceived" && m.params.type === "Document" && status === null) {
        status = m.params.response.status;
      } else if (m.method === "Log.entryAdded" && m.params.entry.level === "error") {
        errors.push(m.params.entry.text);
      } else if (m.method === "Runtime.exceptionThrown") {
        const d = m.params.exceptionDetails;
        errors.push(`Uncaught: ${d.exception?.description || d.text}`);
      }
    };
    listeners.add(onEvent);
    for (const domain of ["Network", "Log", "Runtime", "Page"]) await send(`${domain}.enable`, {}, sessionId);
    // The Studio shows a "desktop only" screen below its breakpoint.
    await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
    await send("Page.navigate", { url: base + path }, sessionId);
    await sleep(SETTLE_MS);
    const probe = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: "({ locked: !!document.querySelector('.st-locked'), workbench: !!document.querySelector('.st-main') })",
    }, sessionId);
    listeners.delete(onEvent);
    await send("Target.closeTarget", { targetId });

    const page = probe.result?.result?.value || {};
    const problems = [];
    if (status !== 200) problems.push(`HTTP ${status}`);
    const foreign = [...hosts].filter((h) => !ALLOWED_HOSTS.has(h));
    if (foreign.length) problems.push(`requests to non-allowed hosts: ${foreign.join(", ")}`);
    for (const e of errors) {
      if (/Content Security Policy|Uncaught/i.test(e)) problems.push(e.slice(0, 200));
    }
    if (path === "/studio/app" && (page.locked || !page.workbench)) problems.push("Studio workbench did not open");

    console.log(`${problems.length ? "FAIL" : "ok  "} ${path}${problems.length ? `\n       ${problems.join("\n       ")}` : ""}`);
    if (problems.length) failures.push(path);
  }
} catch (err) {
  console.error(`verify-site: ${err.message}`);
  await cleanup();
  process.exit(2);
}

await cleanup();

console.log(failures.length ? `\n${failures.length} page(s) failed.` : `\nAll ${PAGES.length} pages passed.`);
process.exit(failures.length ? 1 : 0);
