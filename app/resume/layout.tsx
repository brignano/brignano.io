import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Anthony Brignano",
  description:
    "Resume for Anthony Brignano, Senior Staff Platform Engineer specializing in internal developer platforms, CI/CD, DevOps intelligence, and AI-native delivery.",
  alternates: {
    canonical: "https://brignano.io/resume",
  },
  openGraph: {
    title: "Resume | Anthony Brignano",
    description:
      "Senior Staff Platform Engineer specializing in internal developer platforms, CI/CD, DevOps intelligence, and AI-native delivery.",
    url: "https://brignano.io/resume",
  },
  twitter: {
    title: "Resume | Anthony Brignano",
    description:
      "Senior Staff Platform Engineer — internal developer platforms, CI/CD, DevOps intelligence, and AI-native delivery.",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
