import {
  SITE_LOCATION,
  SITE_NAME,
  SITE_ROLE,
  SITE_TAGLINE,
  heroMetrics,
} from "@/lib/constants";
import { OG_CONTENT_TYPE, OG_SIZE, OgProfilePanel, ogCard } from "@/lib/og-card";

// The home page's share card: the landing-page fold, drawn from the same
// constants app/page.tsx renders (role, headline, photo card). Built once at
// build time and served as a static PNG. See lib/og-card.tsx for why every
// page has one and how they stay in step with the pages.
//
// CACHE-BUSTING, AND ITS ONE BLIND SPOT. Next appends `?<contenthash>` to the
// og:image URL, but that hash covers THIS FILE'S source only, not the PNG and
// not what it imports. A copy change in lib/constants.ts therefore produces a
// new image at the same URL, which is why vercel.json does NOT serve card
// routes `immutable`: the short max-age is what lets chat apps refetch.
export const dynamic = "force-static";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({
    path: "/",
    eyebrow: SITE_ROLE,
    title: `${SITE_TAGLINE}.`,
    aside: await OgProfilePanel({
      name: SITE_NAME,
      location: SITE_LOCATION,
      metric: heroMetrics[0],
    }),
  });
}
