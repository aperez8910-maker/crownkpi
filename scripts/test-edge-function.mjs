#!/usr/bin/env node
/**
 * Local Edge Function Tester
 * ---------------------------
 * Invokes a deployed (or locally served) edge function with a JSON body and
 * pretty-prints the request, response, timing and any structured logs.
 *
 * Usage:
 *   node scripts/test-edge-function.mjs <function-name> [--body '<json>'] [--body-file path] [--local]
 *
 * Examples:
 *   node scripts/test-edge-function.mjs scrape-website --body '{"url":"https://lnpplumbing.com"}'
 *   node scripts/test-edge-function.mjs analyze-website --body-file ./scripts/fixtures/analyze.json
 *   node scripts/test-edge-function.mjs scrape-website --local --body '{"url":"https://example.com"}'
 *
 * Flags:
 *   --local       Hit http://127.0.0.1:54321 (supabase functions serve)
 *   --body        Inline JSON body
 *   --body-file   Path to a JSON file used as the body
 *   --header k=v  Extra header (repeatable)
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(
    "Usage: node scripts/test-edge-function.mjs <function-name> [--body '<json>'] [--body-file path] [--local] [--header k=v]"
  );
  process.exit(args.length === 0 ? 1 : 0);
}

const fnName = args[0];
let body = undefined;
let useLocal = false;
const extraHeaders = {};

for (let i = 1; i < args.length; i++) {
  const a = args[i];
  if (a === "--local") useLocal = true;
  else if (a === "--body") body = args[++i];
  else if (a === "--body-file") {
    const p = resolve(process.cwd(), args[++i]);
    if (!existsSync(p)) {
      console.error(`✖ body-file not found: ${p}`);
      process.exit(1);
    }
    body = readFileSync(p, "utf8");
  } else if (a === "--header") {
    const [k, ...rest] = args[++i].split("=");
    extraHeaders[k] = rest.join("=");
  }
}

// Load .env manually (no dotenv dep needed)
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!useLocal && (!SUPABASE_URL || !ANON_KEY)) {
  console.error(
    "✖ Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env"
  );
  process.exit(1);
}

const base = useLocal
  ? "http://127.0.0.1:54321/functions/v1"
  : `${SUPABASE_URL}/functions/v1`;
const url = `${base}/${fnName}`;

const headers = {
  "Content-Type": "application/json",
  apikey: ANON_KEY ?? "",
  Authorization: `Bearer ${ANON_KEY ?? ""}`,
  ...extraHeaders,
};

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};

console.log(c.bold(`\n▶ ${fnName}`) + c.dim(`  ${url}`));
if (body) console.log(c.dim("body:"), body.length > 400 ? body.slice(0, 400) + "…" : body);

const started = Date.now();
let res, text;
try {
  res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers,
    body: body ?? undefined,
  });
  text = await res.text();
} catch (err) {
  console.error(c.red(`✖ Network error: ${err.message}`));
  process.exit(1);
}
const ms = Date.now() - started;

const ok = res.ok;
const statusColor = ok ? c.green : c.red;
console.log(
  `${statusColor(`${ok ? "✔" : "✖"} ${res.status} ${res.statusText}`)}  ${c.dim(
    `${ms}ms`
  )}`
);

let parsed;
try {
  parsed = JSON.parse(text);
  console.log(c.cyan("response:"));
  console.dir(parsed, { depth: 6, colors: true });
} catch {
  console.log(c.cyan("response (text):"));
  console.log(text.length > 2000 ? text.slice(0, 2000) + "…" : text);
}

if (!useLocal) {
  console.log(
    c.dim(
      `\nTip: view live logs in Lovable Cloud → Functions → ${fnName} → Logs`
    )
  );
}

process.exit(ok ? 0 : 1);