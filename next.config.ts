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
   * The DevOps intelligence case study shipped briefly as its own page before
   * being folded into the ATLAS study. Keep the old address working.
   */
  async redirects() {
    return [
      {
        source: "/work/devops-intelligence",
        destination: "/work/atlas-developer-platform",
        permanent: true,
      },
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
