import type { NextConfig } from "next";

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
};

export default nextConfig;
