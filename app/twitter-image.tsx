// Reuse the Open Graph card for the Twitter/X card so twitter:image is also a
// PNG at an absolute URL (Apple/iMessage falls back to og:image, but other
// clients read twitter:image directly).
export const dynamic = "force-static";
export { default, alt, size, contentType } from "./opengraph-image";
