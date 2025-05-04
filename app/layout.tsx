import type { Metadata } from "next";
import { Inconsolata, Silkscreen } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import 'aos/dist/aos.css'; // You can also use <link> for styles


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
  title: "@brignano",
  description: "Anthony Brignano's personal portfolio website.",
  icons: {
    icon: "/favicon.svg",
  },
};

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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
