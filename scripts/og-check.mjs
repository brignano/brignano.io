// Share-card check: every prerendered page must ship its OWN share card.
//
//   npm run build && node scripts/og-check.mjs
//
// A page that sets its own `openGraph` or `twitter` metadata silently drops the
// image it would otherwise inherit (Next merges metadata shallowly), and a card
// that only one page owns can drift away from the pages it stands in for. Both
// happened (see lib/og-card.tsx). So for each page in the build this asserts:
//
//   - exactly one og:image and one twitter:image tag, both absolute PNG URLs;
//   - each points at the page's own route (/notes/x -> /notes/x/opengraph-image),
//     so a new page fails until it gets an opengraph-image.tsx that draws it
//     from the page's own data, rather than borrowing a parent's card;
//   - the card was actually rendered into the build.
//
// No server needed: it reads .next/server/app. The rendered cards are copied
// to og-cards/ (git-ignored) so CI can upload them for review next to the
// fold screenshots.
import { copyFile, mkdir, readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const APP = ".next/server/app";
const OUT_DIR = "og-cards";
const ORIGIN = "https://brignano.io";

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const exists = (p) => stat(p).then(() => true, () => false);

const tags = (html, attr, name) =>
  [...html.matchAll(new RegExp(`<meta ${attr}="${name}" content="([^"]+)"`, "g"))].map(
    (m) => m[1].replaceAll("&amp;", "&")
  );

const failures = [];
await mkdir(OUT_DIR, { recursive: true });
const pages = (await htmlFiles(APP)).filter((f) => !/(^|\/)_[^/]*\.html$/.test(f));
if (pages.length === 0) {
  console.error(`og-check: no pages under ${APP}. Run \`npm run build\` first.`);
  process.exit(1);
}

for (const file of pages.sort()) {
  const rel = relative(APP, file).replace(/\.html$/, "");
  const route = rel === "index" ? "" : `/${rel}`;
  const html = await readFile(file, "utf8");
  const before = failures.length;

  for (const [attr, name, kind] of [
    ["property", "og:image", "opengraph-image"],
    ["name", "twitter:image", "twitter-image"],
  ]) {
    const found = tags(html, attr, name);
    const where = `${route || "/"}: ${name}`;
    if (found.length !== 1) {
      failures.push(
        `${where} appears ${found.length} times (want 1). ` +
          (found.length === 0
            ? `Add ${kind}.tsx to the page's folder under app/, drawn with lib/og-card.tsx from the page's own data.`
            : `Don't also set images in metadata.`)
      );
      continue;
    }
    const url = new URL(found[0]);
    const want = `${route}/${kind}`;
    if (url.origin !== ORIGIN || url.pathname !== want) {
      failures.push(
        `${where} is ${url.origin}${url.pathname}; want ${ORIGIN}${want}, the page's own card.`
      );
      continue;
    }
    const body = join(APP, `${want.slice(1)}.body`);
    if (!(await exists(body))) {
      failures.push(`${where}: ${want} was not prerendered (no ${body}).`);
      continue;
    }
    if (kind === "opengraph-image") {
      const png = await readFile(body);
      if (png.subarray(1, 4).toString() !== "PNG") {
        failures.push(`${where}: ${want} is not a PNG.`);
      }
      const name = (rel === "index" ? "home" : rel).replaceAll("/", "--");
      await copyFile(body, join(OUT_DIR, `${name}.png`));
    }
  }
  console.log(`${failures.length > before ? "✗" : "✓"} ${route || "/"}`);
}

if (failures.length) {
  console.error(`\nog-check: ${failures.length} problem(s):\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log(`\nog-check: ${pages.length} pages, each with its own share card (copies in ${OUT_DIR}/).`);
