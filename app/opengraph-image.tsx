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
const BG = "#18181b"; // zinc-900
const ACCENT = "#a78bfa"; // violet-400
const TEXT = "#fafafa"; // zinc-50
const MUTED = "#a1a1aa"; // zinc-400
const HAIRLINE = "#27272a"; // zinc-800

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

        {/* Proof metrics strip */}
        <div
          style={{
            display: "flex",
            gap: 64,
            paddingTop: 36,
            borderTop: `2px solid ${HAIRLINE}`,
          }}
        >
          {heroMetrics.map((m) => (
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
