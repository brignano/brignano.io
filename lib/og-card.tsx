// The one renderer behind every social share card (og:image / twitter:image).
//
// WHY THIS FILE EXISTS. The site used to have exactly one card, drawn by hand
// in app/opengraph-image.tsx as a copy of the landing-page fold. Two things
// went wrong with that, and this file is the fix for both:
//
//   1. The copy drifted. The hero swapped its three-number proof panel for a
//      photo card on 2026-10-26 and the share card kept drawing the old panel
//      for three weeks, because nothing tied the two together.
//   2. Every other page shipped NO image. Each page sets its own `openGraph`
//      title, and Next merges metadata shallowly, so a page's `openGraph`
//      object replaces the root one, images and all. A shared note was a bare
//      text link.
//
// So now: every route segment that is a page has its own opengraph-image.tsx
// (scripts/og-check.mjs fails CI if one doesn't), each is a few lines that
// pass this renderer the SAME strings and numbers the page itself renders,
// and the colours come out of @brignano/design's tokens.css at build time
// rather than being retyped here. Changing a page's copy changes its card on
// the next build; there is nothing to remember to update.
//
// Satori renders this with no stylesheet and no CSS custom properties, so the
// layout is inline styles and every colour is resolved to a literal below.
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MARK } from "@brignano/design/logo/paths.mjs";
import { SITE_NAME } from "@/lib/constants";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// ── Colours, from the design system ────────────────────────────────────────
// A card is one fixed image shown on light and dark chat bubbles alike, and
// the dark side of the site is the one that reads on both, so each token is
// resolved to its DARK value. tokens.css declares colours as
// `light-dark(<light>, <dark>)` or as `var(--other)`; anything else (or a
// renamed token) throws, so the build fails instead of drawing a wrong colour.
function darkTokens(names: readonly string[]): Record<string, string> {
  const css = readFileSync(
    join(process.cwd(), "node_modules/@brignano/design/tokens.css"),
    "utf8"
  ).replace(/\/\*[\s\S]*?\*\//g, "");
  const decl = new Map<string, string>();
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (!decl.has(m[1])) decl.set(m[1], m[2].trim());
  }
  const resolve = (name: string, depth = 0): string => {
    const raw = decl.get(name);
    if (raw === undefined || depth > 8) {
      throw new Error(`og-card: ${name} is not a token in tokens.css`);
    }
    const ld = raw.match(/^light-dark\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)$/);
    const value = ld ? ld[2] : raw;
    const ref = value.match(/^var\((--[\w-]+)\)$/);
    if (ref) return resolve(ref[1], depth + 1);
    if (!/^#[0-9a-f]{3,8}$/i.test(value)) {
      throw new Error(`og-card: ${name} resolved to "${value}", not a hex colour`);
    }
    return value;
  };
  return Object.fromEntries(names.map((n) => [n, resolve(n)]));
}

const T = darkTokens(["--bg", "--card", "--line", "--ink", "--slate", "--mark"]);

// The A|B logo from @brignano/design (DESIGN.md §5, "The logo"): the letters
// in ink and only the bar in --mark, the one colour the system spends on being
// recognisable, so the bar is the only amber on any card.
const LOGO_HEIGHT = 36;

export interface OgCardProps {
  /** The page's address, drawn top right after the domain ("/notes"). */
  path?: string;
  /** Small Silkscreen line above the headline. Uppercased here. */
  eyebrow: string;
  /** The page's own headline, word for word. */
  title: string;
  /** Optional slate line under the headline. */
  subtitle?: string;
  /** Optional panel on the right (the home card's photo card). */
  aside?: React.ReactNode;
}

/** Long titles step down a size so they never run off the card. */
function titleSize(title: string, hasAside: boolean): number {
  const n = title.length * (hasAside ? 1.5 : 1);
  if (n <= 50) return 64;
  if (n <= 80) return 56;
  if (n <= 110) return 48;
  return 42;
}

export async function ogCard({
  path,
  eyebrow,
  title,
  subtitle,
  aside,
}: OgCardProps): Promise<ImageResponse> {
  const [geistRegular, geistBold, silkscreen] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf")),
    // Silkscreen is the marketing tier's display face (tokens.css --display).
    // next/font serves it as woff2, which satori cannot parse, so the TTF is
    // committed next to Geist for these build-time renders.
    readFile(join(process.cwd(), "assets/fonts/Silkscreen-Regular.ttf")),
  ]);
  const size = titleSize(title, Boolean(aside));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: T["--bg"],
        fontFamily: "Geist",
        color: T["--ink"],
      }}
    >
      {/* Header lockup: the site header's mark, the name it stands for, and
          where the link goes. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "44px 64px 36px",
          borderBottom: `1px solid ${T["--line"]}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg
            width={(LOGO_HEIGHT * MARK.width) / MARK.height}
            height={LOGO_HEIGHT}
            viewBox={MARK.viewBox}
          >
            <path d={MARK.letters} fill={T["--ink"]} />
            <path d={MARK.bar} fill={T["--mark"]} />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -0.4,
            }}
          >
            {SITE_NAME}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: T["--slate"] }}>
          {`brignano.io${path && path !== "/" ? path : ""}`}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Uppercased in JS, not by textTransform, so the string that
              reaches the font is the one that gets measured. */}
          <div
            style={{
              display: "flex",
              fontFamily: "Silkscreen",
              fontSize: 18,
              letterSpacing: 3.2,
              color: T["--slate"],
            }}
          >
            {eyebrow.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -size * 0.025, // tracking-tight
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 28,
                lineHeight: 1.35,
                color: T["--slate"],
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {aside}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
        { name: "Silkscreen", data: silkscreen, weight: 400, style: "normal" },
      ],
    }
  );
}

/**
 * The home hero's right-hand card at `lg`: photo, name, place, and the one
 * number. Takes the same values app/page.tsx renders, so the two can only
 * differ in layout, never in content.
 */
export async function OgProfilePanel({
  name,
  location,
  metric,
}: {
  name: string;
  location: string;
  metric: { value: string; label: string };
}) {
  const photo = await readFile(join(process.cwd(), "public/headshot.jpeg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 316,
        flexShrink: 0,
        backgroundColor: T["--card"],
        border: `1px solid ${T["--line"]}`,
        borderRadius: 18,
        padding: "32px 26px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- satori, not the DOM */}
      <img
        src={src}
        alt=""
        width={148}
        height={148}
        style={{
          width: 148,
          height: 148,
          borderRadius: 9999,
          objectFit: "cover",
          border: `1px solid ${T["--line"]}`,
        }}
      />
      <div style={{ display: "flex", marginTop: 20, fontSize: 26, fontWeight: 700 }}>
        {name}
      </div>
      <div style={{ display: "flex", marginTop: 2, fontSize: 20, color: T["--slate"] }}>
        {location}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "stretch",
          marginTop: 22,
          paddingTop: 22,
          borderTop: `1px solid ${T["--line"]}`,
        }}
      >
        <div
          style={{ display: "flex", fontSize: 46, fontWeight: 700, letterSpacing: -1.15 }}
        >
          {metric.value}
        </div>
        <div style={{ display: "flex", marginTop: 4, fontSize: 20, color: T["--slate"] }}>
          {metric.label}
        </div>
      </div>
    </div>
  );
}
