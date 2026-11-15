import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  /**
   * The chat assistant's API route (app/api/chat) reads these at request time,
   * so they have to ship inside its serverless function.
   *
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats
   */
  outputFileTracingIncludes: {
    "/api/chat": ["./public/resume.yml", "./lib/chat/about-me.md"],
    // The PDF is prerendered at build, but if it is ever rendered on demand
    // its embedded fonts have to be in the function too.
    "/resume.pdf": ["./assets/fonts/**"],
  },

  /**
   * Set base path. This is usually the slug of your repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "",

  /**
   * Serve images as-is rather than through Vercel's image optimizer.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },

  /**
   * /work (case studies) and /blog (posts) were merged into /notes on
   * 2026-11-15; every old address lands on its new one, and the two index
   * pages open with the matching filter. The DevOps intelligence case study
   * shipped briefly as its own page before being folded into the ATLAS
   * study, so it goes straight there. Order matters: first match wins.
   */
  async redirects() {
    return [
      {
        source: "/work/devops-intelligence",
        destination: "/notes/atlas-developer-platform",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/notes?show=case-studies",
        permanent: true,
      },
      { source: "/work/:slug", destination: "/notes/:slug", permanent: true },
      { source: "/blog", destination: "/notes?show=posts", permanent: true },
      { source: "/blog/:slug", destination: "/notes/:slug", permanent: true },
    ];
  },
};

/**
 * BotID's client script and its challenge requests are proxied through
 * same-origin rewrites, which keeps them inside the CSP's 'self' sources.
 *
 * @see https://vercel.com/docs/botid
 */
export default withBotId(nextConfig);
