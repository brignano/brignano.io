import type { Metadata } from "next";
import { Inconsolata, Silkscreen } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import 'aos/dist/aos.css'; // You can also use <link> for styles
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

const inconsolata = Inconsolata({
  variable: "--font-inconsolata-mono",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Anthony Brignano | Platform Engineering & DevSecOps",
  description:
    "Anthony Brignano's personal portfolio website showcasing projects, skills, and experience.",
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: "Anthony Brignano | Platform Engineering & DevSecOps",
    description:
      "Explore Anthony Brignano's portfolio and full-stack development experience.",
    url: "https://brignano.io",
    siteName: "Anthony Brignano Portfolio",
    // todo: below
    // images: [
    //   {
    //     url: "/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Anthony Brignano Portfolio Preview",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Brignano | Platform Engineering & DevSecOps",
    description:
      "Platform engineering and DevSecOps leader building secure, scalable CI/CD and cloud-native systems, with deep experience across enterprise platforms.",
    // todo: below
    //  images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inconsolata.variable} ${silkscreen.variable} antialiased dark:bg-zinc-900 bg-zinc-100 dark:text-white text-zinc-700 transition-colors`}
      >
        <Header />
        {children}
        <Footer />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
