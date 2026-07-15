/**
 * Crawls every route in lib/site-config.ts against a running server, collects
 * the internal hrefs each page renders, and asserts all of them return 200.
 *
 * Usage:
 *   node scripts/check-links.mjs [baseUrl]
 * Defaults to http://localhost:3000. Start the server yourself first:
 *   npm run build && npx next start -p 3000
 *
 * Exits non-zero on the first failing link so CI fails loudly.
 */

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

// Read the route list off the source of truth rather than duplicating it. The
// file is TypeScript, but `routes` is a plain string array, so a narrow regex
// beats pulling in a transpiler for one constant.
const configSource = await import("node:fs/promises").then((fs) =>
  fs.readFile(new URL("../lib/site-config.ts", import.meta.url), "utf8"),
);

const routesBlock = configSource.match(/export const routes = \[([^\]]*)\]/);
if (!routesBlock) {
  throw new Error("Could not find `export const routes = [...]` in lib/site-config.ts");
}
const routes = [...routesBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

if (routes.length === 0) {
  throw new Error("`routes` in lib/site-config.ts parsed to an empty list");
}

/** Pulls href="..." out of raw HTML. No parser needed for attributes this regular. */
function extractHrefs(html) {
  return [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
}

/** Internal means same-origin: skip mailto, tel, external hosts and fragments. */
function isInternal(href) {
  if (href.startsWith("/")) return !href.startsWith("//");
  return href.startsWith(BASE);
}

// Build output and the favicon are emitted by the framework, not authored as
// navigation. A 404 there is a build problem, not a broken link.
function isAsset(path) {
  return path.startsWith("/_next/") || path.startsWith("/favicon.");
}

function normalise(href) {
  const path = href.startsWith(BASE) ? href.slice(BASE.length) : href;
  const withoutHash = path.split("#")[0];
  return withoutHash === "" ? "/" : withoutHash;
}

async function status(path) {
  const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return response.status;
}

const checked = new Map();
const failures = [];
const discovered = new Map(); // path -> Set of pages linking to it

console.log(`Checking ${routes.length} routes against ${BASE}\n`);

// Pass 1: the declared routes must all render.
for (const route of routes) {
  const code = await status(route);
  checked.set(route, code);
  const mark = code === 200 ? "ok  " : "FAIL";
  console.log(`${mark} ${code}  ${route}`);
  if (code !== 200) failures.push({ path: route, code, source: "lib/site-config.ts routes" });
}

// Pass 2: every internal link those pages render must also resolve.
for (const route of routes) {
  if (checked.get(route) !== 200) continue;
  const html = await fetch(`${BASE}${route}`).then((response) => response.text());
  for (const href of extractHrefs(html)) {
    if (!isInternal(href)) continue;
    const path = normalise(href);
    if (!path.startsWith("/")) continue;
    if (isAsset(path)) continue;
    if (!discovered.has(path)) discovered.set(path, new Set());
    discovered.get(path).add(route);
  }
}

console.log(`\nFound ${discovered.size} distinct internal link targets\n`);

for (const [path, sources] of discovered) {
  if (checked.has(path)) continue;
  const code = await status(path);
  checked.set(path, code);
  const mark = code === 200 ? "ok  " : "FAIL";
  console.log(`${mark} ${code}  ${path}   (linked from: ${[...sources].join(", ")})`);
  if (code !== 200) failures.push({ path, code, source: [...sources].join(", ") });
}

// A missing page must render the custom 404 rather than crash.
const notFoundCode = await status("/__definitely-not-a-real-page__");
console.log(`\n404 handling: ${notFoundCode} for an unknown path`);
if (notFoundCode !== 404) {
  failures.push({ path: "/__definitely-not-a-real-page__", code: notFoundCode, source: "404 check" });
}

console.log(`\n${"-".repeat(60)}`);
if (failures.length > 0) {
  console.error(`${failures.length} link failure(s):\n`);
  for (const failure of failures) {
    console.error(`  ${failure.code}  ${failure.path}   (from: ${failure.source})`);
  }
  process.exit(1);
}

console.log(`All ${checked.size} internal links returned 200. 404 handler correct.`);
