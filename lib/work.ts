// Case studies for /work. The content lives here, not in a CMS: two
// write-ups that change a few times a year do not need one, and keeping them
// in code means the same integrity rules that govern the hero metrics
// (docs/tsd-site-modernization.md §5.7) govern these. Every number below is
// one that already appears on the resume or the homepage; nothing is stated
// that is not documented and current, and where a figure does not exist yet
// the text says so instead of inventing one.

export interface Fact {
  label: string;
  value: string;
}

export interface Section {
  heading: string;
  paragraphs: string[];
}

export interface CaseStudy {
  slug: string;
  /** Short title for cards and the nav between studies. */
  title: string;
  /** The small line above the title. */
  eyebrow: string;
  /** One sentence that is the whole story. */
  lede: string;
  /** The "at a glance" strip under the lede. Keep to four. */
  facts: Fact[];
  sections: Section[];
  stack: string[];
  /** 150–160 characters for search results. */
  description: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "github-enterprise-cloud-migration",
    title: "10,000+ repositories to GitHub Enterprise Cloud",
    eyebrow: "Case study · Source control",
    lede: "Every active repository at The Hartford moved from a self-hosted GitHub Enterprise Server to GitHub Enterprise Cloud, in waves ordered by impact, with thousands of engineers shipping the whole time.",
    description:
      "How The Hartford moved 10,000+ repositories from GitHub Enterprise Server to GitHub Enterprise Cloud in under 12 months of execution, in impact-ordered waves, with 50+ integration points running against both.",
    facts: [
      { label: "Repositories migrated", value: "10,000+" },
      { label: "Execution, after planning", value: "Under 12 months" },
      { label: "Integration points", value: "50+" },
      { label: "Cutover", value: "Waves, by impact" },
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "A self-hosted GitHub Enterprise Server is a product the company has to run: every upgrade, every integration, every outage, and the infrastructure under all of it. That cost of maintenance was the first reason to move.",
          "The second was capability. GitHub ships its AI-first features to the cloud product first, and a server install puts a ceiling on what a platform team can offer its engineers. At The Hartford that ceiling sat over 10,000+ repositories and the CI/CD toolchain wired to them. Moving was the prerequisite for the developer platform that followed.",
        ],
      },
      {
        heading: "Constraints",
        paragraphs: [
          "The company is a regulated insurer, so access, audit and retention requirements came with every repository, not just the sensitive ones. Secrets that had found their way into repositories over the years set hard cutover deadlines, agreed with the security team, that the plan had to meet.",
          "Thousands of engineers could not stop shipping for a migration. Pipelines across Jenkins, Harness, AWS CodePipeline and the rest of the toolchain pointed at the old host and had to keep working through the move, which meant the two platforms had to coexist cleanly for as long as the program ran.",
        ],
      },
      {
        heading: "How it ran",
        paragraphs: [
          "Repositories moved in waves ordered by impact: the least-referenced ones first, the ones everything else depended on last. That proved the integrations on low-stakes repositories before the high-stakes ones moved, and it kept each hard deadline survivable.",
          "GitHub's own importer did the moving, wrapped in custom scripts that fit it to the enterprise's organization, team and permission model. A contracted vendor executed the migration itself and was accountable for it end to end. The scope was active repositories; whether an inactive one was archived instead was left to the application team that owned it, and few were.",
          "I led the program. The hardest part, and the part my engineers owned, was not moving repositories. GitHub Enterprise Server had more than fifty integration points: the CI/CD toolchain, Ansible, Azure DevOps, Plutora, Prisma Cloud, security scanning, an internal release-gating framework, and more. Every one had to be designed to work against both Server and Cloud while the waves ran, then cut over cleanly once the last wave landed.",
          "Not all fifty were known on day one. Usage analysis across the platforms kept surfacing pipelines that teams had built ad hoc, outside the program's knowledge or scope, each one a cutover nobody had planned for. For the length of the migration the inventory lived in a spreadsheet, updated by hand every day.",
          "Planning took its time. The execution, from the first wave to the last, ran in under twelve months.",
        ],
      },
      {
        heading: "What changed",
        paragraphs: [
          "The company's code lives on GitHub Enterprise Cloud. The self-hosted install and its maintenance are gone, and the rest of GitHub's roadmap, Copilot and the AI-first tooling included, is now something the platform can offer rather than wait for.",
          "The migration is the foundation the developer platform stands on: the single pane of glass used by 4,000+ engineers tracks 13,000+ repositories today, a number that only exists because they are all in one place.",
          "And that daily spreadsheet is the origin of the second case study. Discovering pipelines by accident, one usage report at a time, is what made the case for real-time pipeline monitoring, compliance and discoverability as a platform capability rather than a migration chore.",
        ],
      },
      {
        heading: "What I would tell the next person",
        paragraphs: [
          "Order the waves by blast radius, not by convenience. Moving the quiet repositories first buys you the evidence you need before the loud ones move.",
          "The migration is the easy part. Count the integration points before you plan anything else, assume the count is wrong, and budget for the period when both platforms are live, because that is where the engineering is.",
          "Let a hard deadline do some of the work. The secrets cutover dates were a constraint, and they were also the thing that kept the program from drifting.",
        ],
      },
    ],
    stack: [
      "GitHub Enterprise Cloud",
      "GitHub Actions",
      "Jenkins",
      "Harness",
      "AWS CodePipeline",
      "Terraform",
    ],
  },
  {
    slug: "devops-intelligence",
    title: "A platform that can see where engineers get stuck",
    eyebrow: "Case study · Developer platform",
    lede: "Telemetry was built into ATLAS, The Hartford's developer platform, from the first day, so the platform team works from usage data instead of guesses, the whole company has one status page to look at, and AI agents can read the same data.",
    description:
      "How The Hartford's developer platform streams pipeline and tooling telemetry through EventBridge and Firehose into DynamoDB and Snowflake, with an in-house status page and MCP access for AI agents.",
    facts: [
      { label: "Engineers on the platform", value: "4,000+" },
      { label: "Pipelines supported", value: "95,000+" },
      { label: "Repositories tracked", value: "13,000+" },
      { label: "Adopters in the first 90 days", value: "1,000+" },
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "A platform serving thousands of engineers hears about pain the way every internal team does: through tickets, chat threads and whoever complains loudest. That tells you the most visible problem, not the biggest one. Across 95,000+ pipelines and 13,000+ repositories, the slow-downs that cost the most engineering hours are the ones nobody files a ticket for, because everybody assumes that is just how the build works.",
          "The need was concrete before it was a design. During the GitHub Enterprise Cloud migration, usage analysis kept turning up pipelines that teams had built outside the program's knowledge, and for the whole of the migration the inventory was a spreadsheet updated by hand every day. The platform needed a way to see for itself: real-time pipeline monitoring, observability, compliance and controls, and enough discoverability that application teams could keep their own pipelines current and retire the stale ones. That is the DevOps intelligence capability being built into ATLAS, The Hartford's developer platform, today.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "Telemetry was a first-class part of the platform from the start, not an afterthought: the CLI shipped with OpenTelemetry instrumentation on day one, the IDE extensions followed early, and the desktop app after that. So the platform has had monitoring dashboards and usage statistics for as long as it has had users.",
          "Pipeline events and that CLI, IDE and desktop telemetry flow through Amazon EventBridge into AWS. DynamoDB holds the live, lookup-shaped data the dashboards and status page read. The Firehose delivery that lands the full history in Snowflake is being stood up now; its purpose is ML analysis of where developers lose time, and that analysis has not produced findings yet. It is the next step, not a result.",
          "The health status page is built in-house, in the style of Statuspage but covering internal and external tools alike and fully customizable, with alerts anyone in the company can subscribe to. A platform problem announces itself before the tickets do.",
          "And because the same data is useful to an assistant as to a dashboard, the platform ships MCP servers and out-of-the-box skills that let AI agents query and operate the enterprise CI/CD systems safely.",
        ],
      },
      {
        heading: "What changed",
        paragraphs: [
          "Decisions about the platform are made from usage data rather than loud pain, and have been since launch. The unified developer surface the telemetry comes from reached 1,000+ active engineers in its first 90 days, and the status page gave the whole organization one place to look when something is wrong.",
          "The pipeline inventory that once lived in a spreadsheet is becoming a platform capability: monitoring, compliance and discoverability for 95,000+ pipelines, so the next migration starts from a live picture instead of a daily export.",
          "What it has not produced yet is a reduction number. Incident and ticket reduction is not instrumented directly, so there is no figure here, and I would rather leave the gap than invent one. The same rule applies to everything on this site.",
          "The data has found a use the platform team did not build, though: another team's tool for triaging and root-causing incidents in real time reads the platform's data to add context to each incident and to show the engineers involved what happened and why.",
        ],
      },
      {
        heading: "What I would tell the next person",
        paragraphs: [
          "Make telemetry first-class on day one. Instrumenting the CLI with OpenTelemetry before it had its first user is the reason there has never been a week without usage data.",
          "Separate the live store from the history store from the start. The questions a status page asks and the questions an analyst asks are different shapes, and one database answering both ends up bad at both.",
          "Make the data readable by agents at the same time you make it readable by people. The MCP layer cost little once the telemetry existed.",
        ],
      },
    ],
    stack: [
      "OpenTelemetry",
      "Amazon EventBridge",
      "Amazon Data Firehose",
      "AWS",
      "DynamoDB",
      "Snowflake",
      "Splunk",
      "Dynatrace",
      "MCP",
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
