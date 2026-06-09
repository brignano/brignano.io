import { Geist, Silkscreen } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/google-analytics";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import { siteMetadata, socialLinks } from "@/lib/constants";
import ScrollToTop from "@/components/scroll-to-top";
import ScrollReveal from "@/components/scroll-reveal";
import ToastProvider from "@/components/toast-provider";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
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
  // Derive sameAs from the single source of truth (socialLinks); only http(s)
  // profile URLs, not mailto. (TSD §5.7 Person schema enhancements.)
  const sameAs = socialLinks
    .map((link) => link.href)
    .filter((href) => /^https?:\/\//.test(href));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${silkscreen.variable}`}
    >
      <head>
        {/* Set theme before first paint to avoid a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.theme;var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/*
          Open Graph / Twitter tags (incl. the PNG social card for iMessage,
          Slack, etc.) are emitted by Next's Metadata API from `siteMetadata`
          plus the app/opengraph-image.tsx + app/twitter-image.tsx conventions,
          all resolved to absolute URLs via `metadataBase`. No manual <meta>
          tags here — duplicating them shipped a second, relative og:image.
        */}
      </head>
      <body
        className={`font-sans antialiased dark:bg-zinc-900 bg-zinc-100 dark:text-white text-zinc-700 transition-colors`}
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
              description:
                "Senior Staff Software Engineer building internal developer platforms, CI/CD ecosystems, DevOps intelligence, and AI-native tooling at enterprise scale.",
              knowsAbout: [
                "Platform Engineering",
                "Developer Experience",
                "CI/CD",
                "DevOps Intelligence",
                "AI-native tooling",
                "GitHub Enterprise",
                "Terraform",
                "AWS",
              ],
              sameAs,
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
                anonymize_ip: true
              });
            `,
              }}
            />
          </>
        )}
        <ToastProvider>
          <Header />
          <ScrollReveal />
          {children}
          <Footer />
        </ToastProvider>
        <ScrollToTop />
        <SpeedInsights />
        {isProduction && GA_MEASUREMENT_ID && <GoogleAnalytics />}
        <Analytics />
      </body>
    </html>
  );
}