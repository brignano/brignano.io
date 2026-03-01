import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Coding | Anthony Brignano",
  description:
    "Coding activity and statistics for Anthony Brignano, including WakaTime stats, GitHub contributions, and development metrics.",
  alternates: {
    canonical: "https://brignano.io/coding",
  },
  openGraph: {
    title: "My Coding | Anthony Brignano",
    description:
      "Coding activity and statistics including WakaTime stats, GitHub contributions, and development metrics.",
    url: "https://brignano.io/coding",
  },
  twitter: {
    title: "My Coding | Anthony Brignano",
    description:
      "Coding activity and statistics including WakaTime stats, GitHub contributions, and development metrics.",
  },
};

export default function CodingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
