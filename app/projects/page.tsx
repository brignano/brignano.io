import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import ProjectCard from "@/components/project-card";
import { projects } from "@/lib/constants";

const TITLE = "Projects — Anthony Brignano";
const DESCRIPTION =
  "Things I build for myself: an analytics dashboard for Airbnb hosts, an architecture-as-code reconciler, a terminal business card, and the design system underneath all of them.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://brignano.io/projects",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const PROJECTS_BREADCRUMBS = [
  { name: "Home", url: "https://brignano.io" },
  { name: "Projects", url: "https://brignano.io/projects" },
];

// `product` is something you can go use; `practice` is how the work gets made.
// Splitting them keeps the tooling honest — it's real and public, but nobody is
// installing my homelab, and listing it beside a live app would flatten both.
const products = projects.filter((p) => p.kind === "product");
const practice = projects.filter((p) => p.kind === "practice");

export default function Projects() {
  return (
    <>
      <BreadcrumbSchema items={PROJECTS_BREADCRUMBS} />
      <main className="max-w-6xl mx-auto md:px-16 px-6 lg:mt-24 mt-16 pb-12">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Projects
          </h1>
          <p className="text-ink-soft text-lg">
            Things I build for myself, mostly to scratch my own itch. They share
            a design system, a toolchain, and a habit of writing down why each
            decision went the way it did.
          </p>
        </header>

        <section className="mb-16 md:mb-24">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {products.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {practice.length > 0 && (
          <section>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              How the work gets made
            </h2>
            <p className="text-ink-soft mb-8 max-w-2xl">
              Not products — the setup underneath everything above. Public
              because the write-ups are the useful part.
            </p>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              {practice.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
