import { Inconsolata, Silkscreen } from "next/font/google";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "aos/dist/aos.css"; // You can also use <link> for styles
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/google-analytics";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import { siteMetadata } from "@/lib/constants";
import ScrollToTop from "@/components/scroll-to-top";

const inconsolata = Inconsolata({
  variable: "--font-inconsolata-mono",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
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
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
        <SpeedInsights />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
