import "./globals.css";

import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Footer from "@/components/resume-footer";
import Header from "@/components/resume-header";
import GoogleAnalytics from "@/components/google-analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";

export async function generateMetadata(): Promise<Metadata> {
  const resumePath = path.join(process.cwd(), "public", "resume.json");
  let name = "Your Name";
  try {
    const data = JSON.parse(fs.readFileSync(resumePath, "utf-8"));
    if (data.personalInfo && data.personalInfo.name) {
      name = data.personalInfo.name;
    }
  } catch (e) {
    // fallback to default name
  }
  return {
    title: `Resume | ${name}`,
    description: `Resume for ${name}`,
    icons: {
      icon: [{ url: "/favicon.svg" }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Silkscreen:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased dark:bg-zinc-900 bg-zinc-100 dark:text-white text-zinc-700 transition-colors font-inconsolata">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
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
                cookie_domain: 'auto',
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Header />
        {children}
        <Footer />
        <GoogleAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
