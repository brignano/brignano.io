# brignano.io

[![Website Deploy](https://deploy-badge.vercel.app/?url=https%3A%2F%2Fbrignano.io&style=for-the-badge&logo=vercel&name=brignano.io)](https://brignano.io)

A personal website and portfolio built with Next.js 16, React 19, and TailwindCSS 4, deployed on Vercel.

## 🚀 Features

- **Next.js 16** with App Router; pages are prerendered and the chat API runs as a Vercel function
- **AI chat assistant** that answers visitors' questions about my experience and projects (Claude Haiku)
- **React 19** with modern hooks and components
- **TailwindCSS 4** for styling
- **TypeScript** for type safety
- **Google Analytics 4** and **Vercel Speed Insights** integration
- **GitHub contribution calendar** rendered as plain SVG from the public contributions API (no chart library)
- **Scroll reveal** animations (a small IntersectionObserver hook; content is visible by default)
- **Resume Integration** at `/resume` path with YAML-based data and PDF download functionality
- **Coding Activity** page with WakaTime tiles and a GitHub contribution calendar
- **Scroll-to-top** button for long pages

## 🛠️ Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Getting Started

[![Open in Codespaces](https://img.shields.io/badge/-Open%20in%20Codespaces-181717?style=for-the-badge&logo=github)](https://codespaces.new/brignano/brignano.io)

The fastest way to get started is to open this repository in a [GitHub Codespace](https://github.com/features/codespaces) or any compatible Dev Container environment by clicking the badge above.

This will automatically set up your development environment with all dependencies pre-installed.

---

#### Manual Setup (optional)

If you prefer to run locally without a Dev Container:

1. Clone the repository:

   ```bash
   git clone https://github.com/brignano/brignano.io.git
   cd brignano.io
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Resume Content

The resume is integrated directly into the application and accessible at `/resume`. Resume data is stored in YAML format (`public/resume.yml`) for easy editing and maintenance.

**Features:**
- PDF download functionality using `@react-pdf/renderer`
- Client-side PDF generation from YAML data
- Theme toggling support
- Responsive design
- Clean, professional layout

The PDF is rendered once at build time by the `app/resume.pdf` route, so the download is a plain static file.

### Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the Next.js production server
- `npm run lint` - Run ESLint to check code quality
- `npm run check:fold` - Screenshot the first screen of every page at phone and desktop width (needs a running production server; see below)

### Continuous integration

Every pull request runs `.github/workflows/ci.yml`:

1. **Lint & build** — `npm run lint` and `npm run build`, with no secrets, so the pages must render their fallbacks (not errors) without API keys.
2. **Lighthouse budgets** — [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) audits `/`, `/projects`, `/resume` and `/coding` against the floors in `lighthouserc.json` (performance, accessibility, SEO). Reports are uploaded as a job artifact and to Lighthouse's temporary public storage.
3. **Fold screenshots** — `scripts/fold-check.mjs` captures the first screen of every page (including the 404) at 390×844 and 1440×900 in light and dark, uploads them as an artifact, and fails if the page scrolls sideways or the floating chat launcher covers a link or button in the fold.

To run the fold check locally:

```bash
npm run build && npm start &
npm run check:fold          # screenshots land in fold-screenshots/
```

## 📦 Building for Production

```bash
npm run build
```

Every page is still prerendered at build time; the only server code is the chat assistant's `/api/chat` route.

### Chat assistant

The floating chat widget (`components/chat-widget.tsx`) posts to `app/api/chat/route.ts`, which streams answers from Claude Haiku. Its context is built in `lib/chat/system-prompt.ts` from:

- `public/resume.yml` - the resume, picked up automatically
- `lib/constants.ts` - the projects list
- `lib/chat/about-me.md` - extra context in my own words (HTML comments are stripped before it reaches the model)

It needs an `ANTHROPIC_API_KEY` environment variable (set it in the Vercel project settings, or `.env.local` for `npm run dev`). Without one, the widget shows a "not configured" message. Set a monthly spend limit in the Anthropic Console as a backstop; the route also caps message length, conversation length, reply length, and per-IP request rate.

The route also enforces a site-wide daily request budget (`CHAT_DAILY_LIMIT`, default 300). Once it's used up, the widget asks visitors to email instead until the next UTC day. To share the count across all function instances, connect an Upstash Redis store (Vercel Marketplace → Upstash), which sets `KV_REST_API_URL`/`KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`). Without one, each instance counts on its own.

## 🚢 Deployment on Vercel

This project is optimized for deployment on [Vercel](https://vercel.com):

### Deploy Your Own

Deploy your own version with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbrignano%2Fbrignano.io)

### Manual Deployment

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import your project to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel will automatically detect the Next.js framework
   - Click "Deploy"

Vercel will automatically:

- Build your Next.js application
- Deploy to a global CDN
- Provide automatic HTTPS
- Set up preview deployments for pull requests
- Enable Speed Insights (already configured)

### Deploying with Vercel CLI

Use the Vercel CLI to deploy from your machine or CI. Commands vary slightly by CLI version — prefer `npx vercel` if you don't want a global install.

1. Authenticate and link the repo:

```bash
vercel login
vercel link       # or `vercel link --yes` to auto-confirm
```

2. Deploy:

```bash
# interactive preview deploy
vercel

# production deploy (non-interactive)
vercel --prod --confirm
# or with npx
npx vercel --prod --confirm
```

3. Fetch environment variables locally (when needed):

```bash
# older CLI: positional
vercel env pull .env.local production

# newer CLI: long option
vercel env pull .env.local --environment=production
```

Notes:

- `vercel env add <NAME> production` adds a variable to the Vercel project; run `vercel env pull` afterwards to fetch it locally.
- For CI, set env vars in the Vercel dashboard or use the Vercel Git integration.

## 🏗️ Infrastructure

There is no infrastructure-as-code for this site. Everything is managed through
provider dashboards.

| Concern | Where | Notes |
|---|---|---|
| **Hosting** | Vercel | Static Next.js export (`output: "export"`), auto-deployed on push to `main`. Headers and CSP in [`vercel.json`](vercel.json). |
| **DNS** | Cloudflare (free) | `brignano.io` and `anthonybrignano.com`. **All records are DNS-only (grey cloud)** — proxying breaks Vercel's certificate issuance. |
| **Email** | Cloudflare Email Routing | `hi@brignano.io` forwards to Gmail. SPF, DKIM and DMARC configured. |
| **Registration** | AWS Route 53 Domains | Registration only — nameservers point at Cloudflare. |

DNS and email ran on AWS (Route 53 + SES → S3 → Lambda) until 2026-08-23. That stack
was decommissioned; the migration record lives in
[`brignano/aws`](https://github.com/brignano/aws/blob/main/docs/tsd-domain-migration-cloudflare.md),
which is now a documentation-only archive.

### Environment Variables

If you need environment variables for your deployment:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, and Development environments

### Analytics (gtag)

This site sends events to Google Analytics 4 using the `event()` helper in `lib/gtag.ts` (e.g. CTA clicks, project links, résumé downloads, chat usage).

Notes about the analytics setup:

- The GA4 tag only loads in production (`VERCEL_ENV === 'production'`) and only when `GA_MEASUREMENT_ID` is set. There is no default ID — without it, nothing is sent.
- Page views, including client-side navigations, come from GA4's **enhanced measurement** ("Page changes based on browser history events"), which is on by default for a web data stream. Keep it on; there is no manual pageview code.
- Custom events show up in GA under Reports → Engagement → Events.

To enable Google Analytics:

```env
GA_MEASUREMENT_ID=G-YOURIDHERE
WAKATIME_API_KEY=your_wakatime_api_key_here
```

Generating `.env.local` from Vercel CLI

If you already have environment variables set up in the Vercel dashboard, you can pull them into a local `.env.local` file using the Vercel CLI. Follow these steps exactly:

1. Install the Vercel CLI (if needed):

```bash
npm install -g vercel
```

2. Authenticate and link the local repo to the Vercel project (this is required so `env pull` knows which project to read from):

```bash
vercel login
vercel link
# or `vercel link --yes` to auto-confirm when you already know the project
```

3. Pull environment variables into `.env.local` from the linked Vercel project. Specify the environment if needed (production/preview/development):

```bash
vercel env pull .env.local --environment=development
```

Notes and troubleshooting:

- `vercel env add <NAME> <environment>` only sets a variable on Vercel (it will prompt for the value) — it does not automatically write to your local `.env.local` file.
- `vercel env pull` reads variables from the currently linked Vercel project. If variables are missing after `env pull`, ensure your local repo is linked to the correct Vercel project (`vercel link`) and that you have permission to read that project's variables.
- To re-check or re-link the project use `vercel link --yes` or run `vercel` and follow the interactive prompts.
- If you prefer to add variables directly via CLI to Vercel (not local), you can run:

```bash
vercel env add GA_MEASUREMENT_ID production
vercel env add WAKATIME_API_KEY production
```

After adding variables on Vercel, re-run `vercel env pull .env.local --environment=production` to fetch them into your local file.

Be careful not to commit secrets — `.env.local` should remain local and is usually ignored by Git.

Required variables for development:

- `WAKATIME_API_KEY` — required to render the WakaTime coding statistics on the `/coding` page. If this is not set the coding page will show an error when fetching WakaTime data.

Optional:

- `GA_MEASUREMENT_ID` — your GA4 measurement ID (`G-…`). Without it, Google Analytics is not loaded.

## 🏗️ Project Structure

```
.
├── .devcontainer/          # DevContainer configuration
├── .github/                # GitHub workflows and configurations
├── app/                    # Next.js app directory (App Router)
│   ├── page.tsx            # Home page (/)
│   ├── coding/page.tsx     # Coding Activity (/coding)
│   ├── resume/page.tsx     # Resume (/resume)
│   ├── sitemap.ts          # sitemap.xml
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React components (reusable UI)
├── public/                 # Static assets
│   ├── robots.txt          # Robots rules
│   └── resume.yml          # Resume data (YAML format)
├── lib/                    # Site constants, analytics helpers
├── types/                  # TypeScript types
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 📄 Pages

- `/` - Home page
- `/work` - Case studies (`lib/work.ts`), one page per study at `/work/<slug>`
- `/coding` - Coding Activity (WakaTime tiles + GitHub contribution calendar)
- `/resume` - Resume page
- `/sitemap.xml` - Generated sitemap
- `public/robots.txt` - Robots rules for crawlers

## 📝 Configuration

### Next.js Config

- `outputFileTracingIncludes` - Ships `resume.yml` and `about-me.md` with the chat API function
- `images.unoptimized: true` - Serves images as-is
- `basePath: ""` - Set to your repository slug if deploying to a subdirectory

### Speed Insights

Visitor analytics come from Google Analytics (see [Analytics (gtag)](#analytics-gtag)). Page-load performance comes from Vercel Speed Insights via `@vercel/speed-insights`, which only collects data once it is enabled for the project in the Vercel dashboard (Project → Speed Insights → Enable).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Next.js](https://nextjs.org/) and deployed on [Vercel](https://vercel.com)
