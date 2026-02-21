import { Inconsolata, Silkscreen } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import "aos/dist/aos.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/google-analytics";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import { siteMetadata } from "@/lib/constants";
import ScrollToTop from "@/components/scroll-to-top";
import AOSInit from "@/components/aos-init";

const inconsolata = Inconsolata({
  variable: "--font-inconsolata-mono",
  subsets: ["latin"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = siteMetadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

const isProduction =
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Helper: convert various possibly-null/undefined values into string | undefined
  const toStringOrUndefined = (v: unknown): string | undefined =>
    v === null || v === undefined ? undefined : String(v);

  const urlToString = (v: unknown): string | undefined => {
    if (v instanceof URL) return v.toString();
    if (typeof v === "string") return v;
    return toStringOrUndefined(v);
  };

  const getFirstImageUrl = (images: any): string | undefined => {
    if (!images) return undefined;
    if (typeof images === "string") return images;
    if (Array.isArray(images)) return images[0]?.url ?? images[0] ?? undefined;
    if (typeof images === "object") return images.url ?? undefined;
    return undefined;
  };

  const getImageDimension = (images: any, key: "width" | "height"): number | undefined => {
    if (!images) return undefined;
    if (Array.isArray(images)) return images[0]?.[key] ?? undefined;
    if (typeof images === "object") return images[key] ?? undefined;
    return undefined;
  };

  // Compute meta values ensuring types match React's MetaHTMLAttributes
  const metaDescription = toStringOrUndefined(siteMetadata.description);
  const ogTitle = toStringOrUndefined(siteMetadata.openGraph?.title ?? siteMetadata.title);
  const ogDescription = toStringOrUndefined(siteMetadata.openGraph?.description ?? siteMetadata.description);
  const ogUrl = urlToString(siteMetadata.openGraph?.url ?? siteMetadata.metadataBase?.toString());
  const ogSiteName = toStringOrUndefined(siteMetadata.openGraph?.siteName);
  const ogType = toStringOrUndefined((siteMetadata.openGraph && (siteMetadata.openGraph as any).type) ?? "website");
  const ogImageUrl = getFirstImageUrl(siteMetadata.openGraph?.images) ?? "/og.png";
  const ogImageWidth = String(getImageDimension(siteMetadata.openGraph?.images, "width") ?? 1200);
  const ogImageHeight = String(getImageDimension(siteMetadata.openGraph?.images, "height") ?? 630);
  const twitterCard = toStringOrUndefined((siteMetadata.twitter && (siteMetadata.twitter as any).card) ?? "summary_large_image");
  const twitterTitle = toStringOrUndefined(siteMetadata.twitter?.title ?? siteMetadata.title);
  const twitterDescription = toStringOrUndefined(siteMetadata.twitter?.description ?? siteMetadata.description);
  const twitterImage =
    getFirstImageUrl(siteMetadata.twitter?.images) ?? getFirstImageUrl(siteMetadata.openGraph?.images) ?? "/og.png";

  return (
    <html lang="en">
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Explicit Open Graph / Twitter meta tags to improve link previews (eg. iMessage) */}
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content={ogSiteName} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content={ogImageWidth} />
        <meta property="og:image:height" content={ogImageHeight} />
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={twitterDescription} />
        <meta name="twitter:image" content={twitterImage} />
      </head>
      <body
        className={`${inconsolata.variable} ${silkscreen.variable} antialiased dark:bg-zinc-900 bg-zinc-100 dark:text-white text-zinc-700 transition-colors`}
      >
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Anthony Brignano",
              url: "https://brignano.io",
              image: "https://brignano.io/headshot.jpeg",
              sameAs: [
                "https://www.linkedin.com/in/brignano",
                "https://github.com/brignano",
              ],
              jobTitle: "Senior Staff Software Engineer",
              worksFor: {
                "@type": "Organization",
                name: "The Hartford",
              },
            }),
          }}
        />
        {/* Google Analytics (only in production) */}
        {isProduction && GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                cookie_domain: 'auto'
              });
            `,
              }}
            />
          </>
        )}
        <Header />
        <AOSInit />
        {children}
        <Footer />
        <ScrollToTop />
        <SpeedInsights />
        {isProduction && GA_MEASUREMENT_ID && <GoogleAnalytics />}
        <Analytics />
      </body>
    </html>
  );
}