# TSD: brignano.io Visual & UX Modernization

| | |
|---|---|
| **Status** | Draft — awaiting approval |
| **Author** | Anthony Brignano |
| **Date** | 2026-06-08 |
| **Repos** | `brignano.io` (app), `aws` (DNS/email only — no app changes) |
| **Target release** | v3.0 (visual refresh) |

---

## 1. Summary

Modernize the look, feel, and copy of brignano.io so it reads as a **senior platform-engineering leader's site**, not a developer-portfolio template — while fixing a confirmed content-visibility bug. This is a **refinement, not a teardown**: structure, hosting, SEO, security headers, and the `/coding` page stay. The work is concentrated in four areas — **typography, hero, animation system, and copy/imagery**.

A larger content effort (a "Work" / case-studies section) is the highest-impact *credibility* lever but is **out of scope here** and tracked as a separate TSD (§9).

## 2. Background / problem statement

Findings from the review of the live site and source (desktop + mobile, light + dark):

1. **🔴 Home contact CTA is invisible (bug).** The final "Want to collaborate?" section renders at `opacity:0` and never recovers. AOS computes scroll offsets on init; `react-github-calendar` ([components/github-calendar-client.tsx](../components/github-calendar-client.tsx)) loads data client-side and grows the page *after* that, so the CTA's trigger lands beyond the real scroll range. `data-aos-once={true}` means it never fires. The bottom of the homepage is blank. ([app/page.tsx:324](../app/page.tsx))
2. **🟠 The type system is not wired up.** Silkscreen applies to `<h1>` via a bare element rule in `globals.css`. Section headings use `font-incognito` and the footer uses `font-inter`, **but neither font is configured** (`tailwind.config.ts` → `theme.extend: {}`, no `@theme` block). Those classes are no-ops; headings and body fall back to the default system sans. **Inconsolata is downloaded but never applied** (wasted webfont). The intended type system has drifted.
3. **🟠 Hero readability/gravitas.** The pixel Silkscreen H1 consumes the entire mobile viewport (9 lines), pushes both CTAs below the fold, and signals "indie/retro" rather than "enterprise leader." CTA buttons are low-contrast (gray-on-near-black).
4. **🟡 Low-signal content & dated decoration.** The "Highlights" strip is six buzzword boxes; the hero SVG is a generic, `aria-hidden` decoration; the footer "Built with: Next.js · Terraform · AWS" badges read junior **and** are inaccurate (Vercel hosts the app — AWS only does Route 53 DNS + SES email forwarding, per [aws/iac/main.tf](../../aws/iac/main.tf)).
5. **🟡 Theme FOUC.** Dark mode is applied in a `useEffect` after mount ([components/header.tsx:40](../components/header.tsx)), so dark-mode users get a flash of light theme on every load.

## 3. Goals / non-goals

**Goals**
- Read as a modern, senior, marketable personal site for three audiences: junior devs, senior recruiters, and CIO/CTO/CEO.
- Fix the invisible CTA and make content visibility independent of JS animation.
- Establish one intentional, performant type system.
- Tighten copy to be concise, concrete, and proof-driven.
- No regressions to SEO, structured data, CSP, or the `/coding` page.

**Non-goals (this TSD)**
- New "Work"/case-studies section and IA expansion (separate TSD, §9).
- Any change to the `aws` repo (DNS/email).
- Backend/API changes, new data sources, or a CMS.
- Re-platforming off Vercel/Next static export.

## 4. Audience & success criteria

| Audience | What they need | We win when… |
|---|---|---|
| Junior devs | "This is impressive and I can learn from it" | `/coding` + readable hero invite exploration |
| Recruiters | Fast credibility, easy contact, résumé | Hero metrics + visible CTA + 1-click résumé |
| CIO/CTO/CEO | Senior signal, scale, outcomes | Type/copy read as leadership, not hobby |

**Measurable success**
- Contact CTA visible 100% of loads (currently 0% on home).
- Lighthouse: Performance ≥ 95, Accessibility ≥ 100, no contrast failures on primary CTAs.
- No unused webfonts shipped (Inconsolata removed).
- Hero primary CTA above the fold at 375×812 (mobile).

## 5. Proposed design

### 5.1 Animation system (fixes the 🔴 bug)
- **Remove `aos`** (a 3.0.0-beta, effectively unmaintained dep) and `aos/dist/aos.css`, `components/aos-init.tsx`.
- Replace with a small `useInView` hook backed by `IntersectionObserver`. **Default rendered state is fully visible**; the fade/translate is a progressive enhancement applied only after mount + intersection.
- Respect `prefers-reduced-motion`: when set, render final state immediately, no transform.
- **Result:** content can never be hidden by a measurement race; the CTA bug disappears by construction.

### 5.2 Type system (fixes the 🟠 drift)
- Adopt **Geist Sans** as the base for headings + body (decided §10): modern, self-hosts via `next/font`, pairs with the stack, and stays memorable *because* it's paired with the Silkscreen accent rather than competing with it.
- Configure it properly via Tailwind v4 `@theme` in `globals.css` (not the vestigial JS config).
- **Keep Silkscreen as a deliberate accent only:** the `A|B` logo, `/coding` stat numbers, and small eyebrow labels. This is the site's memorable signature — concentrated, not diffuse.
- **Remove Inconsolata** and the dead `font-incognito` / `font-inter` classes; replace with real utilities.

### 5.3 Hero
- Shorten H1 to a single punchy line; move qualifiers to the subhead.
- Add a **metric strip** directly under the subhead (proof above the fold).
- **One primary (filled) CTA** + one secondary (outline); fix contrast to pass WCAG AA.
- **Imagery (decided §10):** whitespace-forward hero with a *restrained* background motif — a subtle, low-contrast line/grid suggesting a "paved road" / platform graph, anchored to the accent color. Whitespace carries the layout; the motif adds memorability without the template-y isometric cubes. Headshot is reserved for a future About/Work page, not the hero.
- Ensure the primary CTA is above the fold on mobile.

### 5.4 Copy & labels

| Where | Current | Proposed |
|---|---|---|
| Hero H1 | "I design enterprise developer platforms that help thousands of engineers ship software safely and quickly." | "I build the platforms thousands of engineers ship on." |
| Hero metrics *(new)* | — | `10,000+ repos migrated · 2023 Enterprise Tech Award · ~1.9M lines` *(superseded by §5.7)* |
| CTA | "My Resume" | "Résumé" (primary, filled) |
| CTA | "My Coding" | "Coding Activity" |
| Heading | "Contribution Graph" | "Open-source activity" |
| Highlights | 6 buzzword boxes | Best-of-both (see §5.5b) |
| Final CTA | "Want to collaborate or chat?" | "Let's build something." + 1 line + single primary button |
| `/coding` eyebrow | "... since Dec 11 2020" | "Tracked since Dec 2020" |

### 5.5b Highlights — best of both (replaces the buzzword boxes)
A two-tier block that serves execs/recruiters (proof) *and* devs (range), without two separate sections:

- **Tier 1 — Achievements (outcome + tech):** each card leads with a quantified outcome headline and carries a small row of skill pills underneath. Example: **"10,000+ repos onto one paved road"** · `GitHub Enterprise` `CI/CD` `Terraform`. ~3–4 cards drawn from real outcomes (migration, incident reduction, AI/MCP layer, the 2023 award).
- **Tier 2 — "Now" strip (personal + momentum):** a compact, low-effort line showing what you're currently building — signals you're hands-on and current. Drawn from real work: **homelab** (Proxmox/Docker/Tailscale), **local-LLM routing** (Ollama + Open WebUI), and **AI-native tooling with Claude Code**. One line each, no deep pages.

This gives the "best of both worlds" (outcomes *and* skills) and gives your homelab / Claude Code work a home **now**, cheaply — while full write-ups stay deferred to the Work TSD (§9). Source all of it from `lib/constants.ts` so it's edit-in-one-place.

### 5.5 Icons, logo, imagery
- **Keep** the `A|B` monogram (the strongest brand asset) and the dark/light favicon SVGs.
- **Standardize on `@heroicons/react`** for CTA/inline icons; remove hand-rolled `<path>` SVGs in `app/page.tsx`.
- **Footer:** drop "Built with" badges or replace with an accurate one-liner (no false AWS-hosting claim). Permanently remove the commented-out Steam link.

### 5.6 Theme FOUC
- Add a tiny **blocking inline script in `<head>`** that resolves theme from `localStorage`/`matchMedia` and sets the `dark` class before first paint. Fold the `localStorage` write into the toggle handler instead of a mount effect.

### 5.7 P2 — resolved content & SEO (working session 2026-06-08)
Decisions reached after P1; folds into the P2 PR. **Positioning shift:** lead with the *live platform suite*; the 10k-repo migration + 2023 award become **prior wins**, not the headline.

**Integrity rules (non-negotiable — these are public claims about a named employer):**
- `40+ days` is the **old onboarding baseline only**. The **1-day** target is a **CEO-sponsored *initiative/goal*** — never state it as delivered.
- **No timeframe SLAs** in copy ("within an hour", "same-day", "first PR in 20 min" all cut — user declined that level of commitment). Make the *point* (fast, self-service onboarding) qualitatively.
- Incident/ticket reduction is **not monitored yet** → **no hard numbers**; at most a design goal.
- `8,000+` = **reach/mandate** (frame as "for"/"serving 8,000+ engineers", **never** "8,000 active users"). `1,000+` = current **90-day active adopters** (traction). Keep these distinct so they survive interview scrutiny.
- **Repos migrated = `10,000+`, not 11,000+.** The Server source had ~10.3–10.5k repos; the ~500–700 that brought Cloud to 11k+ were **net-new created in Cloud**, not migrated. "Migrated/modernized" claims use **`10,000+`** (true and conservative). The 11k figure is only honest as an **end-state/scale** claim ("11,000+ repos on GitHub Enterprise Cloud"), a different verb — not used in current copy.

**Hero metric strip** (replaces `~1.9M lines`; source from `lib/constants.ts` `heroMetrics`):
> `8,000+` enterprise developers · `1,000+` active in 90 days · `10,000+` repos migrated

**Homepage Current Role — curated pillars (6 + prior):**
1. Lead the internal developer platform — single pane of glass for **8,000+ engineers** — on a CEO-sponsored initiative to cut onboarding from **40+ days**.
2. Unified developer surface: **custom CLI, desktop app, IDE extensions**; **1,000+ active in 90 days**.
3. **"One build command, any stack"** — context-aware builds that run identically locally / in CI / fully remote, on a custom base-image registry.
4. **Real-time DevOps intelligence** — an event bus streaming pipeline + CLI/IDE telemetry into **AWS, DynamoDB, Snowflake** for ML analysis of developer pain points; upgraded observability (**Splunk, Dynatrace**); live platform **health status page + subscribe-able alerts**.
5. **Native AI tooling + out-of-the-box skills** (MCP, DevOps intelligence layer) built in.
6. Operate the enterprise **CI/CD + DevSecOps toolchain** end to end (Jenkins, GitHub Actions, Harness, AWS CodePipeline, Nexus, SonarQube, Checkmarx, …) keeping thousands of pipelines reliable.
- *Prior:* migrated **10,000+ repos** → GitHub Enterprise Cloud; **2023 Enterprise Tech Award** (year reads as context here, not a headline metric).

**Homepage About — add a leadership/community line** (between platform paragraph and hobbies):
> *Beyond the platform, I lead our enterprise hackathons, mentor emerging leaders as a rotation manager in the company's Leadership Development Program, and serve on the CCSU Computer Science Industry Advisory Board.*
- Also apply the already-staged tweak: "snowboarding the glades" → **"snowboarding through the woods"** (uncommitted in working tree as of this session).

**Résumé (`app/resume/page.tsx`):**
- Expanded Current Role bullets (comprehensive version of the 6 pillars above + virtual tasks / remote build detail that was trimmed from the homepage).
- New **"Leadership & Community"** section: **Enterprise Hackathons** (lead/organizer) · **Leadership Development Program** — Rotation Manager · **CCSU Computer Science Industry Advisory Board** — Member.
- **Skills/Tech** section grouped (recruiter/ATS keyword home for the full tool inventory): **CI/CD** (Jenkins, GitHub Actions, Harness, AWS CodePipeline, uDeploy) · **DevSecOps** (Checkmarx, SonarQube, NexusIQ) · **Artifact & Quality** (Nexus) · **Observability** (Splunk, Dynatrace) · **Cloud & Data** (AWS, DynamoDB, Snowflake) · **Platform/VCS** (GitHub Enterprise) · **AI** (MCP).

**SEO / metadata (`lib/constants.ts` `siteMetadata` + `app/layout.tsx` Person schema):**
- **Title:** `Anthony Brignano — I build platforms engineers ship on` (decision: brand impression > keyword density, since the site ranks #1 on the name anyway; keywords live in the description).
- **Description:** `Internal developer platforms for 8,000+ engineers — CI/CD, DevOps intelligence, and AI-native tooling that makes developer onboarding self-service and software delivery faster and safer.`
- Mirror to OG + Twitter titles/descriptions.
- **`Person` schema enhancements:** add `description`, `knowsAbout` (platform engineering, developer experience, CI/CD, DevOps intelligence, AI-native tooling, GitHub Enterprise, Terraform, AWS), and a fuller `sameAs` (pull from `socialLinks`). Off-page lever to mention to user: link brignano.io from LinkedIn + GitHub profiles.

**Still in scope from original §5.4/§5.5:** footer "Built with" badge removal, `@heroicons/react` sweep (drop hand-rolled `<path>` SVGs incl. the two hero CTA icons), Highlights §5.5b redesign (outcome cards + skill pills + "Now" strip), `/coding` eyebrow copy, final CTA → "Let's build something."

**Open confirmation:** ✅ **Resolved** — **CCSU** = Central Connecticut State University (confirmed against `public/resume.yml` education); spelled out once on the homepage About line and in the résumé Leadership & Community section.

## 6. Phasing

```mermaid
graph LR
    P0["P0 — Correctness<br/>remove AOS → useInView<br/>fix CTA + FOUC"] --> P1["P1 — Identity<br/>type system + hero + contrast"]
    P1 --> P2["P2 — Polish<br/>copy, icons, footer, imagery"]
    P2 -.separate TSD.-> Future["Work / case studies"]
```

| Phase | Scope | Risk | Reviewable as |
|---|---|---|---|
| **P0** | §5.1, §5.6 | Low | 1 PR — bug fix, no visual change intended |
| **P1** | §5.2, §5.3 | Med | 1 PR — the visible refresh |
| **P2** | §5.4, §5.5 | Low | 1 PR — copy/asset cleanup |

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Removing AOS changes feel | `useInView` reproduces fade-up; verify on every page before merge |
| Static export quirks with new font loading | Use `next/font` (self-hosted, no layout shift); verify `output: export` build |
| Hero metrics become stale | Source from a single constant; note review cadence |
| Contrast regressions | Verify primary CTAs with `preview_inspect` + Lighthouse a11y before merge |
| Scope creep into "Work" section | Explicitly deferred to §9 |

## 8. Verification plan
- Local dev-server preview on `/`, `/resume`, `/coding` at desktop + mobile, light + dark.
- Assert CTA `opacity:1` and visible at page bottom (the original repro).
- Confirm `prefers-reduced-motion` shows all content with no transforms.
- Lighthouse run against targets in §4.
- `next build` (static export) succeeds; bundle size for `/coding` not increased.

## 9. Out of scope / future TSD: "Work" section
The highest-impact credibility + stickiness lever is **2–3 case studies** (10k-repo migration; AI/MCP DevOps-intelligence layer; enterprise CLI) with problem → constraints → build → measurable outcome, plus a `/work` route and IA expansion. Tracked separately because it is a content effort, not a visual refresh.

## 10. Decisions — RESOLVED
1. **Base sans font:** ✅ **Geist Sans** (modern, self-hosted via `next/font`, memorable when paired with Silkscreen accent). §5.2
2. **Hero imagery:** ✅ **Whitespace-forward + restrained "paved road" motif**; headshot reserved for future About/Work page. §5.3
3. **Accent color:** ✅ **Shift the hue** away from emerald. Candidate: an **electric indigo/violet** (modern, reads "AI/platform," breaks the matrix-terminal cliché); amber as fallback. Exact swatches (light + dark) finalized in P1 against WCAG AA. Replaces `--primary-color` greens in `globals.css`.
4. **Highlights:** ✅ **Best-of-both** — outcome cards with skill pills + a "Now" momentum strip (homelab / local-LLM / Claude Code). §5.5b
5. **"Built with" footer:** ✅ **Remove the badges** (accuracy + maturity); keep social icons + copyright.

**Projects / homelab / Claude Code:** added **now** as the lightweight "Now" strip (§5.5b); full case studies stay deferred to the Work TSD (§9).

---

*Approval = sign-off on §3 goals and §5 design (decisions in §10 are resolved). P0 can proceed immediately on approval since it carries no intended visual change.*
