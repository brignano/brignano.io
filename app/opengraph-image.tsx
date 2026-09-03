import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  SITE_NAME,
  SITE_ROLE,
  SITE_TAGLINE,
  heroMetrics,
} from "@/lib/constants";

// Route segment config — runs at build time under `output: "export"`. Keep the
// default Node.js runtime (do NOT set runtime = "edge") so we can read the
// committed font files from disk.
// Generate the card once at build time and emit it as a static PNG file
// (required by `output: "export"`).
export const dynamic = "force-static";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ── What this card is ──────────────────────────────────────────────────────
// A redraw of the landing-page fold, not a poster about it. Teams and iMessage
// show this image immediately above a link the reader is deciding whether to
// open; when it looks like a different site than the one that opens, the
// preview has cost trust rather than earned a click. So the parts are the
// page's parts, in the page's order: monogram lockup over a rule, the
// Silkscreen role eyebrow, the headline, and the proof panel to its right.
//
// Satori renders this server-side with no CSS custom properties and no
// stylesheet, so every value below is a literal. Each one is the DARK step of
// a design token and is named for it — change design/tokens.css and these must
// be re-read. The ground is dark because a card is one fixed image on both
// themes and dark is the one that reads on a light chat bubble and a dark one
// alike; the site's own dark theme is what it is copying.
const BG = "#0d0d0f"; // --n-0    page ground
const CARD = "#17171a"; // --n-50   the proof panel's surface (--card)
const LINE = "#202024"; // --n-100  hairline (--line)
const INK = "#f2f2f0"; // --n-900  headline, metric values
const SLATE = "#8b8b93"; // --n-500 eyebrow, metric labels, url
// --mark is the one colour the system spends on being recognisable rather than
// informative, and tokens.css is explicit that it inks a drawn mark and is
// never a fill, wash, chip or border. The monogram is that drawn mark, so it is
// the only amber on this card — the rest of the card is the neutral the page
// actually wears. (The header renders the same monogram in ink because there it
// is a nav control; here it is doing identity, which is what --mark is for.)
const MARK = "#e0a44f"; // --mark

// The monogram, verbatim from public/favicon.svg — the same drawn A|B the
// header shows, so the card and the page open with the same mark.
const MONOGRAM_PATH =
  "M1.5 11V6.5C1.5 5.39543 2.39543 4.5 3.5 4.5C4.60457 4.5 5.5 5.39543 5.5 6.5V11M1.5 8.5H5.5M12 7.5H9.5M12 7.5C12.8284 7.5 13.5 6.82843 13.5 6C13.5 5.17157 12.8284 4.5 12 4.5H9.5V7.5M12 7.5C12.8284 7.5 13.5 8.17157 13.5 9C13.5 9.82843 12.8284 10.5 12 10.5H9.5V7.5M7.5 1V14";

export default async function Image() {
  const [geistRegular, geistBold, silkscreen] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf")),
    // Silkscreen is the marketing tier's display face (tokens.css --display).
    // next/font serves it to the browser as woff2, which satori cannot parse,
    // so the TTF is committed next to Geist for this one build-time render.
    readFile(join(process.cwd(), "assets/fonts/Silkscreen-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG,
        fontFamily: "Geist",
        color: INK,
      }}
    >
      {/* Header lockup — the site's sticky header: mark on the left, the
            wordmark it stands for (the header keeps that name in an sr-only
            span; a preview has no screen reader, so it is drawn), the domain
            on the right, and the same hairline underneath. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "44px 64px 36px",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width={46} height={46} viewBox="0 0 15 15" fill="none">
            <path d={MONOGRAM_PATH} stroke={MARK} strokeWidth={1} />
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
        <div style={{ display: "flex", fontSize: 26, color: SLATE }}>
          brignano.io
        </div>
      </div>

      {/* The fold: copy left, proof panel right — the landing page's own
            two-column split at lg, at very close to the same scale (the card is
            1200px wide against the page's 1152px container). */}
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
          {/* Eyebrow. Silkscreen, uppercased in JS rather than by
                `textTransform` so the string that reaches the font is the one
                that gets measured. */}
          <div
            style={{
              display: "flex",
              fontFamily: "Silkscreen",
              fontSize: 18,
              letterSpacing: 3.2,
              color: SLATE,
            }}
          >
            {SITE_ROLE.toUpperCase()}
          </div>
          {/* The h1, word for word — including the full stop the page adds
                to the tagline. */}
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.55, // tracking-tight, -0.025em
            }}
          >
            {SITE_TAGLINE}.
          </div>
        </div>

        {/* Proof panel — the bordered card the hero shows at lg: values in
              ink, labels in slate, hairline between rows. Fixed width, and the
              rows stack, so a fourth metric would make it taller rather than
              overflow; keep an eye on the height if heroMetrics grows. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 316,
            flexShrink: 0,
            backgroundColor: CARD,
            border: `1px solid ${LINE}`,
            borderRadius: 18,
            padding: "8px 26px",
          }}
        >
          {heroMetrics.map((m, i) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "18px 0",
                borderTop: i === 0 ? "none" : `1px solid ${LINE}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 42,
                  fontWeight: 700,
                  letterSpacing: -1.05, // tracking-tight, -0.025em
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 4,
                  fontSize: 20,
                  color: SLATE,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
        { name: "Silkscreen", data: silkscreen, weight: 400, style: "normal" },
      ],
    }
  );
}
