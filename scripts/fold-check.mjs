// Fold check: screenshots the first screen of every page at phone and desktop
// width, in both themes, and fails when something is wrong with that first
// screen — the fixed chat launcher covering a link or button, or the page
// scrolling sideways. Run against a production server:
//
//   npm run build && npm start &
//   node scripts/fold-check.mjs            # BASE_URL=http://localhost:3000
//
// Screenshots land in fold-screenshots/ (git-ignored); CI uploads them as an
// artifact so a reviewer can eyeball a PR's folds without checking it out.
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = "fold-screenshots";

const PAGES = [
  ["home", "/"],
  ["work", "/work"],
  ["case-study", "/work/github-enterprise-cloud-migration"],
  ["projects", "/projects"],
  ["resume", "/resume"],
  ["coding", "/coding"],
  ["not-found", "/this-page-does-not-exist"],
];
const VIEWPORTS = [
  ["phone", { width: 390, height: 844 }],
  ["desktop", { width: 1440, height: 900 }],
];
const SCHEMES = ["dark", "light"];

// Fixed controls that float over the page. Anything clickable in the fold
// that they cover is unreachable on a touch screen.
const FLOATING = ["#chat-toggle", "#scroll-to-top"];

const intersects = (a, b) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

async function checkPage(page, name, viewport) {
  const problems = [];

  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth
  );
  if (scrollWidth > viewport.width) {
    problems.push(
      `${name}: page scrolls sideways (${scrollWidth}px wide in a ${viewport.width}px viewport)`
    );
  }

  const floating = [];
  for (const selector of FLOATING) {
    const el = page.locator(selector);
    if ((await el.count()) && (await el.isVisible())) {
      floating.push({ selector, box: await el.boundingBox() });
    }
  }

  const targets = page.locator("main a, main button, header a, header button");
  for (const target of await targets.all()) {
    if (!(await target.isVisible())) continue;
    const box = await target.boundingBox();
    if (!box || box.y >= viewport.height || box.y + box.height <= 0) continue;
    for (const { selector, box: fb } of floating) {
      // A card-sized block link with the launcher over one corner is still
      // easy to tap; only a target the launcher can actually hide counts.
      if (fb && box.width * box.height > 6 * fb.width * fb.height) continue;
      if (fb && intersects(box, fb)) {
        const text = (await target.innerText()).trim().replace(/\s+/g, " ");
        problems.push(
          `${name}: ${selector} covers "${text || "(no text)"}" in the fold`
        );
      }
    }
  }
  return problems;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    // Lets a machine with a different Playwright build point at its browser.
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  const problems = [];
  let shots = 0;

  for (const scheme of SCHEMES) {
    for (const [vpName, viewport] of VIEWPORTS) {
      const context = await browser.newContext({
        viewport,
        colorScheme: scheme,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      for (const [pageName, path] of PAGES) {
        const label = `${pageName} ${vpName} ${scheme}`;
        try {
          // "load", not "networkidle": third-party calls (GitHub calendar
          // data) can hang in CI and must not hold the check hostage.
          await page.goto(`${BASE_URL}${path}`, {
            waitUntil: "load",
            timeout: 30_000,
          });
          // Let the mount-time reveal animations finish.
          await page.waitForTimeout(1_000);
          await page.screenshot({
            path: `${OUT_DIR}/${pageName}-${vpName}-${scheme}.png`,
          });
          shots += 1;
          problems.push(...(await checkPage(page, label, viewport)));
        } catch (err) {
          problems.push(`${label}: ${err.message.split("\n")[0]}`);
        }
      }
      await context.close();
    }
  }
  await browser.close();

  console.log(`Captured ${shots} fold screenshots into ${OUT_DIR}/`);
  if (problems.length) {
    console.error("\nFold problems:");
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log("No fold problems found.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
