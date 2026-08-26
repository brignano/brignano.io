import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME, SITE_TAGLINE, heroMetrics } from "@/lib/constants";

// Route segment config — runs at build time under `output: "export"`. Keep the
// default Node.js runtime (do NOT set runtime = "edge") so we can read the
// committed font files from disk.
// Generate the card once at build time and emit it as a static PNG file
// (required by `output: "export"`).
export const dynamic = "force-static";
export const alt = "Anthony Brignano — Platform Engineering, DevEx & AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (matches the site / web manifest).
const BG = "#0d0d0f"; // --n-0 (dark)
// The social card is IDENTITY, not UI — so it wears --mark, the one place the
// design system spends a colour on being recognisable rather than informative.
// Literal because satori renders server-side with no CSS custom properties;
// keep in sync with design/tokens.css --mark. The card's ground is the dark
// one, so this is the DARK step: the light #b4741f sits at ~3:1 on #0d0d0f,
// which is why tokens.css lifts the mark in dark rather than inverting it.
const ACCENT = "#e0a44f"; // --mark (dark)
const TEXT = "#f2f2f0"; // --n-900 (dark)
const MUTED = "#a8a8b0"; // --n-700 (dark)
const HAIRLINE = "#2a2a2f"; // --n-200 (dark)

export default async function Image() {
  const [geistRegular, geistBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          // Subtle violet wash in the top-left so the card isn't flat.
          backgroundImage: `radial-gradient(900px 500px at 0% 0%, rgba(124,58,237,0.18), transparent 60%)`,
          padding: "72px 80px",
          fontFamily: "Geist",
          color: TEXT,
        }}
      >
        {/* Top row: eyebrow + subtle wordmark (wayfinding, not a sales CTA) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            Platform Engineering · DevEx · AI
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 400,
              color: MUTED,
            }}
          >
            brignano.io ↗
          </div>
        </div>

        {/* Name + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 44,
              fontWeight: 400,
              lineHeight: 1.15,
              color: MUTED,
              maxWidth: 1000,
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>

        {/* Proof metrics strip — first three only. This card is a fixed
            1200x630 with no flex-wrap, and four labels plus gaps overflow the
            1040px of usable width. heroMetrics is ordered so the three
            current-state numbers lead; the migration (a prior win) is the one
            that drops off here, which is the right trade for a social preview.
            The homepage renders all four — it wraps. */}
        <div
          style={{
            display: "flex",
            gap: 64,
            paddingTop: 36,
            borderTop: `2px solid ${HAIRLINE}`,
          }}
        >
          {heroMetrics.slice(0, 3).map((m) => (
            <div
              key={m.label}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 52,
                  fontWeight: 700,
                  color: ACCENT,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 6,
                  fontSize: 26,
                  fontWeight: 400,
                  color: MUTED,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
      ],
    },
  );
}
