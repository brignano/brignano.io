// Case studies for /work. The content lives here, not in a CMS: three
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
    slug: "atlas-developer-platform",
    title: "ATLAS: one platform for 4,000+ engineers",
    eyebrow: "Case study · Developer platform",
    lede: "The Hartford's developer platform is a CLI, a desktop agent and IDE extensions that put onboarding, builds, policy, telemetry and AI tooling in one place for 4,000+ engineers. The next step is one build and pipeline system in place of seven.",
    description:
      "ATLAS, The Hartford's developer platform: a CLI on 4,000+ machines, a desktop agent on 2,000+, guided onboarding, a catalog of 120+ skills and MCP servers, policy-as-config, DevOps intelligence, and a plan to replace seven pipeline tools with one.",
    facts: [
      { label: "Engineers using the CLI", value: "4,000+" },
      { label: "Devices running the desktop agent", value: "2,000+" },
      { label: "Skills, MCP servers and agents in the catalog", value: "140+" },
      { label: "Pipeline tools today", value: "7" },
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "Before the platform, a new engineer's first useful commit was 40+ days away, and most of that time was setup: the right tools, the right versions, the right access, learned from whoever sat nearest. The company's tooling was discovered in a browser, installed from a wiki, and run in a terminal, and nothing connected the three.",
          "Delivery had the same shape. Pipelines ran across seven tools (uDeploy, Ansible, Terraform, AWS CodePipeline, Jenkins, GitHub Actions and Harness), each with its own templates. When the company moved from on-premises Checkmarx to Checkmarx One, the platform team updated template after template and then worked with application teams to update thousands of individual pipelines. One change, multiplied by seven tools and every pipeline built on them.",
        ],
      },
      {
        heading: "What ATLAS is today",
        paragraphs: [
          "A CLI, the HIG CLI, in use on 4,000+ machines, and a desktop agent active on 2,000+ devices. The agent connects the browser to the CLI: a button on the platform's site runs a native command on the engineer's machine. The agent, and the idea of bridging the two so one front end can carry everything the platform adds, were my design and build. Both ship as a standard software package.",
          "Guided onboarding that never leaves the browser until it needs to. Three built-in walkthroughs: one sets up the machine with the CLI in a terminal embedded in the site, one opens a chat window on the site that talks to Copilot through the CLI on the engineer's own machine, by way of the desktop agent, and one opens VS Code and walks through the extension and the parts of the editor that matter on day one. Beginner and advanced CLI walkthroughs follow, refined and certified by the platform's team in India, and the AI engineering team is writing new ones for enterprise AI tools such as the AWS and Jenkins MCP servers as they are onboarded.",
          "A local setup catalog where engineers install what the company has already vetted: 120+ skills, 10+ MCP servers and 10+ agents, discoverable in one place instead of in someone's chat history.",
          "Policy as configuration. OPA-backed policy decides which tool versions run on which CI platform and which scans run where, so compliance is a config change rather than a template edit. And one build command that builds any project the same way locally. That build system was my manager's work, designed and built in parallel to the rest of the platform; my part was learning it and bringing the team along, and ATLAS is built around it.",
        ],
      },
      {
        heading: "Seeing the platform: DevOps intelligence",
        paragraphs: [
          "The need for this part was concrete before it was a design. During the GitHub Enterprise Cloud migration, usage analysis kept turning up pipelines that teams had built outside the program's knowledge, and for the whole of the migration the inventory was a spreadsheet updated by hand every day. The platform needed a way to see for itself: real-time pipeline monitoring, observability, compliance and controls, and enough discoverability that application teams could keep their own pipelines current and retire the stale ones. That capability is being built into ATLAS today.",
          "Telemetry was first-class from the start, not an afterthought: the CLI shipped with OpenTelemetry instrumentation on day one, the IDE extensions followed early, and the desktop agent after that, so the platform has had monitoring dashboards and usage statistics for as long as it has had users. Pipeline events and that CLI, IDE and desktop telemetry flow through Amazon EventBridge into AWS, with DynamoDB holding the live, lookup-shaped data the dashboards read. An in-house health status page, Statuspage in style but covering internal and external tools and fully customizable, lets anyone in the company subscribe to alerts, so a platform problem announces itself before the tickets do. And MCP servers and out-of-the-box skills let AI agents query and operate the enterprise CI/CD systems safely against the same data.",
          "What it has not produced yet is a result. The Firehose delivery that lands the full history in Snowflake is being stood up now; its purpose is ML analysis of where developers lose time, and that analysis has no findings yet. Incident and ticket reduction is not instrumented directly, so there is no figure here, and I would rather leave the gap than invent one. The data has found a use the platform team did not build, though: another team's tool for triaging and root-causing incidents in real time reads the platform's data to add context to each incident and show the engineers involved what happened and why.",
        ],
      },
      {
        heading: "How it was adopted",
        paragraphs: [
          "The unified surface reached 1,000+ active engineers in its first 90 days. The desktop agent reached the same number in a day, because it shipped to everyone who already had the CLI. A new machine now goes from unboxed to productive in hours, against the 40+ day baseline.",
        ],
      },
      {
        heading: "Where it is going",
        paragraphs: [
          "This section is plans, not results. The remote build server is in progress: the same build command with a --remote flag will run on platform compute instead of the laptop, and on every push and pull request for real-time feedback and analysis.",
          "That is the path off the seven pipeline tools. With builds on platform compute and policy already in configuration, pipelines consolidate onto one platform with OPA controls built in. The Checkmarx One migration is the kind of change that would then be a reconfiguration in the CLI, applied once, rather than a campaign across tools and teams. The 95,000+ pipelines the platform supports today are the population this is designed for; none of it is claimed until it lands.",
        ],
      },
      {
        heading: "What I would tell the next person",
        paragraphs: [
          "Ship the next surface to the people who already have the last one. The desktop agent got a quarter's adoption in a day because it did not ask anyone to start over.",
          "Put policy in configuration before you consolidate anything. Once tool versions and scans are config, the tools underneath become replaceable.",
          "Make discovery a product surface. A catalog of 140+ vetted skills, servers and agents is the difference between AI tooling that exists and AI tooling that gets used.",
          "Make telemetry first-class on day one. Instrumenting the CLI with OpenTelemetry before it had its first user is the reason there has never been a week without usage data, and it is what makes the data readable by agents at no extra cost.",
        ],
      },
    ],
    stack: [
      "TypeScript",
      "GitHub Enterprise Cloud",
      "GitHub Actions",
      "Open Policy Agent",
      "MCP",
      "VS Code",
      "OpenTelemetry",
      "Amazon EventBridge",
      "Amazon Data Firehose",
      "DynamoDB",
      "Snowflake",
      "Splunk",
      "Dynatrace",
    ],
  },
  {
    slug: "self-service-developer-onboarding",
    title: "Onboarding: 40+ days to hours",
    eyebrow: "Case study · Developer experience",
    lede: "A CEO-sponsored initiative to make a new engineer's setup at The Hartford self-service. A laptop now arrives with the platform on it and goes from unboxed to building in hours, against a 40+ day baseline from hire to first commit.",
    description:
      "How The Hartford made engineer onboarding self-service: browser walkthroughs, a desktop agent and one build command get a new machine productive in hours.",
    facts: [
      { label: "Hire to first commit, before", value: "40+ days" },
      { label: "A machine, unboxed to building, today", value: "Hours" },
      { label: "Sponsor", value: "The CEO" },
      { label: "Built-in walkthroughs", value: "3" },
    ],
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "The measure is simple: the time between an engineer's hire date and their first commit. Before the platform it was 40+ days, and almost none of that was learning the codebase. It was laptop imaging, then software access, data entitlements and role-based access groups, each its own request with its own approver, and each one discoverable only by already knowing it existed. The groups, the software and the permutations of both differed by team, and nothing listed them. A new engineer found out what they were missing when it blocked them, or when someone who had done it before thought to mention it.",
          "The same days were paid again on every contractor start and every transfer between teams, because the setup lived in people rather than in anything a machine could replay. And because no one team owned the path from hire date to first commit, no one team saw the whole number.",
        ],
      },
      {
        heading: "Why it reached the CEO",
        paragraphs: [
          "The number did reach someone. The 40+ day figure came up in a monthly operating review, and the CEO took it as something to drive down. That became a CEO-sponsored initiative with a stated goal of an engineer being productive on their first day, and the developer platform, ATLAS, became the way the platform team delivers on it. The baseline is 40+ days. The first-day goal is a target, and it is written here as one.",
        ],
      },
      {
        heading: "Day one, as designed",
        paragraphs: [
          "A new engineer's laptop arrives with the CLI and the desktop agent already on it, as part of the standard developer software package. So does the core access an engineer needs on day one: GitHub, Copilot and the Nexus registry are provisioned out of the box, along with the software most engineers use every day, so the requests that used to open the first week are not filed at all.",
          "The design rule for what follows was that onboarding never leaves the browser until it has to. The engineer opens the platform's site and starts a walkthrough. The first one sets up the machine with the CLI, in a terminal embedded in the page, so they are watching real commands run on their own laptop without having to know them yet. The desktop agent is what connects the two: a button on the site runs a native command on the machine. The second walkthrough opens a chat window on the site that talks to Copilot through the CLI on the engineer's own machine, by way of that agent, so AI help is part of day one rather than something to set up later. The third opens VS Code, installs the platform extension and walks through the parts of the editor that matter on the first day. Beginner and advanced CLI walkthroughs follow.",
          "From there the engineer installs what the company has already vetted from a catalog of 120+ skills, 10+ MCP servers and 10+ agents, and builds their first project with one command that builds any project the same way on every laptop. Which tool versions and which scans run is decided by policy in configuration, so a new engineer never has to get that right by hand.",
        ],
      },
      {
        heading: "What self-service means here",
        paragraphs: [
          "Not everything. Some access still needs the engineer to submit a request, and some still needs an approval on the other side. What changed is the default: the core is there on day one, and what remains is a request rather than a scavenger hunt.",
          "The walkthroughs replace the wiki page that was right when it was written, because they are the setup, not a description of it, and when the setup changes the walkthrough changes with it. The catalog replaces the chat thread, because what is vetted is listed in one place. Policy as configuration replaces the colleague who knew which version, because the platform knows.",
          "The walkthroughs were refined and certified by the platform's team in India, who went through them as a new engineer would and sent back what did not hold up. That is the part I would not skip: a walkthrough written by the people who built the platform is only correct for the people who built the platform until someone else has run it.",
        ],
      },
      {
        heading: "Who goes through it",
        paragraphs: [
          "New hires, contractors and internal transfers take the same path. It has also turned out to be useful to engineers who were never new: experienced developers running the tool against their own applications have found stale repositories and pipelines they did not know they still had.",
        ],
      },
      {
        heading: "What the numbers mean",
        paragraphs: [
          "The initiative is judged on hire date to first commit. The hours figure is not that number: it is what the platform path delivers on a single machine, from unboxed to building. The enterprise KPI is a cumulative average over every engineer hired since the measurement began, whichever path they took, so by construction it moves slowly and has not yet caught up with the change. The number that will show the shift is the most recent cohort's, and the platform team expects it to. That figure is not in yet, so it is not here.",
          "What is not claimed: the first-day goal, which is the initiative's target; any figure for the full 8,000-engineer organization, which the rollout is heading toward and has not reached; and any reduction in support tickets, which is not instrumented directly. Where a number does not exist yet, this page says so.",
        ],
      },
      {
        heading: "How it rolled out",
        paragraphs: [
          "The platform team's own organization went first, as the pilot, and the enterprise followed. The unified surface of CLI, desktop app and IDE extensions reached 1,000+ active engineers in its first 90 days. The desktop agent reached the same number in a day, because it shipped to everyone who already had the CLI. Today the CLI is in use on 4,000+ machines and the agent on 2,000+ devices. The pilot that is still running is adoption itself: making this the standard day-one path for every team, not just the ones that chose it early.",
          "The AI engineering team is now writing new walkthroughs for enterprise AI tools, such as the AWS and Jenkins MCP servers, as each is onboarded. The same engine that gets a new engineer to their first commit gets an existing engineer to their first use of a new tool.",
        ],
      },
      {
        heading: "My part in it",
        paragraphs: [
          "I am the platform's tech lead. My manager acts as its technical product owner and still ships the first version of a feature himself at times. The desktop app was mine to design and build, and so was the idea it carries: a guided workflow that takes an engineer through setup instead of describing it, and a bridge between the browser and the CLI, so that one front end can carry everything the platform adds later, software delivery and DevOps intelligence included. I built the platform's UI, and I did a large share of the architecture and development of the event-bus ingestion pipeline behind its telemetry. The one-command build system was my manager's work; my part there was learning it and bringing the team along.",
        ],
      },
      {
        heading: "What I would tell the next person",
        paragraphs: [
          'Define productive before you measure it. Hire date to first commit is a number anyone can check and no one can argue with. "Set up" is neither.',
          "Make the first day a product. Onboarding was slow because it was nobody's product; it got fast when it got an owner, a surface and telemetry.",
          "Stay in the browser until you cannot. An embedded terminal and a desktop agent let the engineer watch their own machine get set up without first learning how to do it.",
          "Have someone who was not in the room run every walkthrough before it ships. The India team's certification pass is why the walkthroughs survive first contact with a real new hire.",
          "Keep the target separate from the result, and say which number you are quoting. Hours on a machine and a cumulative enterprise average are different measures, and a reader who is handed one as the other will not trust either.",
        ],
      },
    ],
    stack: [
      "TypeScript",
      "VS Code",
      "GitHub Copilot",
      "Sonatype Nexus",
      "MCP",
      "Open Policy Agent",
      "OpenTelemetry",
    ],
  },
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
          "And that daily spreadsheet is the origin of the DevOps intelligence work in the ATLAS case study. Discovering pipelines by accident, one usage report at a time, is what made the case for real-time pipeline monitoring, compliance and discoverability as a platform capability rather than a migration chore.",
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
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
