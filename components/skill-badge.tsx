import {
  siTypescript,
  siJavascript,
  siOpenjdk,
  siDotnet,
  siPython,
  siGnubash,
  siReact,
  siNextdotjs,
  siAngular,
  siNodedotjs,
  siSpringboot,
  siTailwindcss,
  siJenkins,
  siGithubactions,
  siTerraform,
  siDocker,
  siProxmox,
  siPortainer,
  siGooglecloud,
  siSnowflake,
  siPostgresql,
  siModelcontextprotocol,
  siOllama,
  siCheckmarx,
  siSonarqubeserver,
  siSonatype,
  siSelenium,
  siCypress,
  siApachemaven,
  siSplunk,
  siDynatrace,
  siSumologic,
  siGrafana,
  siPrometheus,
  siGithub,
  siVercel,
  siTailscale,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";

// Map a skill name (as it appears in resume.yml) to its brand icon.
// Names with no entry render as a plain text pill — no logo, no breakage.
const NAME_TO_ICON: Record<string, SimpleIcon> = {
  // Languages
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Java: siOpenjdk,
  "C# / .NET": siDotnet,
  ".NET": siDotnet,
  Python: siPython,
  Bash: siGnubash,
  // Frameworks & UI
  React: siReact,
  "Next.js": siNextdotjs,
  Angular: siAngular,
  "Node.js": siNodedotjs,
  "Spring Boot": siSpringboot,
  "Tailwind CSS": siTailwindcss,
  // CI/CD & Delivery
  Jenkins: siJenkins,
  "GitHub Actions": siGithubactions,
  // IaC & Containers
  Terraform: siTerraform,
  Docker: siDocker,
  Proxmox: siProxmox,
  Portainer: siPortainer,
  // Cloud & Data
  "Google Cloud": siGooglecloud,
  Snowflake: siSnowflake,
  PostgreSQL: siPostgresql,
  // AI / ML
  "Vertex AI": siGooglecloud,
  MCP: siModelcontextprotocol,
  Ollama: siOllama,
  // DevSecOps & Quality
  Checkmarx: siCheckmarx,
  SonarQube: siSonarqubeserver,
  Nexus: siSonatype,
  NexusIQ: siSonatype,
  Selenium: siSelenium,
  Cypress: siCypress,
  Maven: siApachemaven,
  // Observability
  Splunk: siSplunk,
  Dynatrace: siDynatrace,
  "Sumo Logic": siSumologic,
  Grafana: siGrafana,
  Prometheus: siPrometheus,
  // Platform, VCS & Networking
  "GitHub Enterprise": siGithub,
  Vercel: siVercel,
  Tailscale: siTailscale,
};

// Relative luminance (0–1) of a #rrggbb brand color, for legibility decisions.
function luminance(hex: string): number {
  const v = parseInt(hex, 16);
  const r = (v >> 16) & 0xff;
  const g = (v >> 8) & 0xff;
  const b = v & 0xff;
  return (0.2126 * r + 0.7152 * g + 0.4114 * b) / 255;
}

interface SkillBadgeProps {
  name: string;
}

/**
 * A single skill pill. Renders the brand logo when one is known, otherwise the
 * bare label. Very dark / very light logos fall back to `currentColor` so they
 * stay legible against both the light and dark pill backgrounds.
 */
export function SkillBadge({ name }: SkillBadgeProps) {
  const icon = NAME_TO_ICON[name];
  const lum = icon ? luminance(icon.hex) : 0;
  const useBrandColor = icon ? lum > 0.22 && lum < 0.92 : false;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 dark:bg-zinc-800 bg-zinc-200 rounded">
      {icon && (
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={14}
          height={14}
          aria-hidden="true"
          className="shrink-0"
          fill={useBrandColor ? `#${icon.hex}` : "currentColor"}
        >
          <path d={icon.path} />
        </svg>
      )}
      {name}
    </span>
  );
}
