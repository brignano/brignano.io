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
    lede: "Every repository at The Hartford moved from a self-hosted GitHub Enterprise Server to GitHub Enterprise Cloud in under a year, with thousands of engineers shipping the whole time.",
    description:
      "How The Hartford moved 10,000+ repositories from GitHub Enterprise Server to GitHub Enterprise Cloud in under 12 months without stopping delivery.",
    facts: [
      { label: "Repositories migrated", value: "10,000+" },
      { label: "Timeframe", value: "Under 12 months" },
      { label: "Engineers affected", value: "Thousands" },
      { label: "Enterprise Tech Data & Cyber Award", value: "2023" },
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "A self-hosted GitHub Enterprise Server is a product the company has to run: every upgrade, every integration, and every outage is yours. It also sits a step behind GitHub's own roadmap. Actions, code security, Copilot and the rest reach the cloud product first, and a server install puts a ceiling on what a platform team can offer its engineers.",
          "At The Hartford that ceiling sat over 10,000+ repositories and the CI/CD toolchain wired to them. Moving was the prerequisite for everything the developer platform would later become.",
        ],
      },
      {
        heading: "Constraints",
        paragraphs: [
          "The company is a regulated insurer, so access, audit and retention requirements came with every repository, not just the sensitive ones.",
          "Thousands of engineers could not stop shipping for a migration. Pipelines across Jenkins, Harness, AWS CodePipeline and the rest of the toolchain pointed at the old host and had to keep working through the move.",
          "And a repository count in five figures means long-tail problems are not edge cases. Anything that fails one time in a thousand fails ten times.",
        ],
      },
      {
        heading: "The shape of the work",
        paragraphs: [
          "A migration at this scale is four problems wearing one name. Inventory and ownership: knowing what every repository is, who answers for it, and which ones are dead weight that should not make the trip. Identity and access: mapping teams, permissions and integrations onto the cloud model without quietly widening or narrowing anyone's access. Delivery: rewiring the pipelines so a repository's first build on the new host is not its first failure. And cutover: moving in waves, with a way back, so no team's day depends on a single night going perfectly.",
          "I led that program end to end, from the plan through the last straggler, and it completed in under twelve months.",
        ],
      },
      {
        heading: "What changed",
        paragraphs: [
          "The company's code lives on GitHub Enterprise Cloud, with GitHub Actions a first-class part of the toolchain rather than a wish-list item. The migration is the foundation the developer platform now stands on: the single pane of glass used by 4,000+ engineers tracks 13,000+ repositories today, a number that only exists because they are all in one place.",
          "The work was recognized with The Hartford's 2023 Enterprise Tech Data & Cyber Award for platform adoption and productivity impact.",
        ],
      },
      {
        heading: "What I would tell the next person",
        paragraphs: [
          "Do the inventory before the timeline. The date you can promise falls out of what you find, not the other way round.",
          "Treat CI as the migration's customer, not an afterthought. Engineers forgive a new URL; they do not forgive a week of red builds.",
          "A migration is also the one chance you get to clean house. Repositories nobody can name an owner for should not move. They should be archived, on the record, with a date.",
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
    lede: "A real-time DevOps intelligence layer streams pipeline and tooling telemetry into AWS, DynamoDB and Snowflake, so the platform team fixes measured slow-downs instead of guessed ones, and AI agents can read the same data.",
    description:
      "How The Hartford's developer platform streams pipeline and tooling telemetry into AWS, DynamoDB and Snowflake to find real developer pain points, with a live status page and MCP access for AI agents.",
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
          "The platform needed a way to see for itself.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "An event bus that streams pipeline events together with telemetry from the platform's own CLI, desktop app and IDE extensions into AWS. DynamoDB holds the live, lookup-shaped data; Snowflake holds the history for analysis. On top of that history, ML analysis surfaces where developers lose time: which steps, which stacks, which parts of the day-one experience stall.",
          "Around it, the observability already in place was upgraded (Splunk, Dynatrace) and pointed at a live health status page that anyone in the company can subscribe to, so a platform problem announces itself before the tickets do.",
          "And because the same data is useful to an assistant as to a dashboard, the platform ships MCP servers and out-of-the-box skills that let AI agents query and operate the enterprise CI/CD systems safely. An engineer can ask why a build is slow and get an answer grounded in the platform's own telemetry.",
        ],
      },
      {
        heading: "What changed",
        paragraphs: [
          "Decisions about the platform are made from measured pain rather than loud pain. The unified developer surface this telemetry comes from reached 1,000+ active engineers in its first 90 days, and the status page and alerts gave the whole organization one place to look when something is wrong.",
          "What it has not produced yet is a reduction number. Incident and ticket reduction is not instrumented end to end, so there is no figure here, and I would rather leave the gap than invent one. The same rule applies to everything on this site.",
        ],
      },
      {
        heading: "What I would tell the next person",
        paragraphs: [
          "Instrument the tools you own before the systems you do not. The CLI and IDE extensions were the cheapest, highest-signal telemetry available, because every event already had a user and a project attached.",
          "Separate the live store from the history store from day one. The questions a status page asks and the questions an analyst asks are different shapes, and one database answering both ends up bad at both.",
          "Make the data readable by agents at the same time you make it readable by people. The MCP layer cost little once the telemetry existed, and it is the part engineers use most.",
        ],
      },
    ],
    stack: [
      "AWS",
      "DynamoDB",
      "Snowflake",
      "Splunk",
      "Dynatrace",
      "MCP",
      "GitHub Actions",
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
