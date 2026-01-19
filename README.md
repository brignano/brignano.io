# brignano.io

![Website Deploy](https://deploy-badge.vercel.app/?url=https%3A%2F%2Fbrignano.io&style=for-the-badge&logo=vercel&name=brignano.io)

A personal website and portfolio built with Next.js 16, React 19, and TailwindCSS 4, deployed on Vercel.

## 🚀 Features

- **Next.js 16** with App Router and static export support
- **React 19** with modern hooks and components
- **TailwindCSS 4** for styling
- **TypeScript** for type safety
- **Vercel Analytics** and **Speed Insights** integration
- **GitHub Calendar** visualization
- **AOS** (Animate On Scroll) animations
- **Resume Integration** at `/resume` path (now served directly from the application)
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

The resume is now integrated directly into the application and accessible at `/resume`. It features a dedicated layout with theme toggling, PDF download functionality, and comprehensive professional experience.

### Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production (static export to `out/` directory)
- `npm run start` - Start Next.js production server (not used for static exports; serve the `out/` directory with a static file server instead)
- `npm run lint` - Run ESLint to check code quality

## 📦 Building for Production

Next.js is configured with static exports to ensure compatibility with various hosting platforms:

```bash
npm run build
```

The build output will be in the `out/` directory.

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
- Enable Vercel Analytics and Speed Insights (already configured)

## 🏗️ Infrastructure

Infrastructure-as-code (IaC) for this site is maintained in a separate repository:

- `brignano/aws` — contains Terraform/CloudFormation and deployment configuration used to provision cloud resources for this site and related projects. See https://github.com/brignano/aws for details.

### Environment Variables

If you need environment variables for your deployment:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, and Development environments

### Analytics (gtag)

This site sends events via Google Analytics using the helper in `lib/gtag.ts` and the `GA_MEASUREMENT_ID` constant. The file is located at `lib/gtag.ts` and the `event()` helper is used throughout the codebase to send analytics events (e.g. contribution graph interactions).

Notes about the default analytics setup:

- `lib/gtag.ts` currently provides a default, hardcoded `GA_MEASUREMENT_ID` value. You do not need to configure Google Analytics to run or build the site locally — the hardcoded ID will be used by default.
- If you want to use your own Google Analytics property, either set `GA_MEASUREMENT_ID` in Vercel environment variables or add it to a local `.env.local` file (example below).

To enable your own Google Analytics (optional):

```env
GA_MEASUREMENT_ID=G-YOURIDHERE
WAKATIME_API_KEY=your_wakatime_api_key_here
```

Generating `.env.local` from Vercel CLI

If you already have environment variables set up in the Vercel dashboard, you can pull them into a local `.env.local` file using the Vercel CLI:

1. Install the Vercel CLI if you don't have it:

```bash
npm install -g vercel
```

2. Login and link the project (follow prompts):

```bash
vercel login
vercel link
# or run `vercel` and follow the interactive setup
```

3. Pull environment variables into `.env.local`:

```bash
vercel env pull .env.local
```

This creates a `.env.local` file containing environment variables from the linked Vercel project. Be careful not to commit secrets — `.env.local` should remain in your local environment and is usually ignored by Git.

Alternatively, you can add variables from the CLI directly:

```bash
vercel env add GA_MEASUREMENT_ID production
vercel env add WAKATIME_API_KEY production
```

Required variables for development:

- `WAKATIME_API_KEY` — required to render the WakaTime coding statistics on the `/coding` page. If this is not set the coding page will show an error when fetching WakaTime data.

Optional:

- `GA_MEASUREMENT_ID` — only necessary if you want analytics sent to your own Google Analytics property; otherwise the default hardcoded value will be used.

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
│   └── resume.json         # Resume data
├── lib/                    # Site constants, analytics helpers
├── types/                  # TypeScript types
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # TailwindCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 📄 Pages

- `/` - Home page
- `/coding` - Coding Activity (WakaTime tiles + GitHub contribution calendar)
- `/resume` - Resume page
- `/sitemap.xml` - Generated sitemap
- `public/robots.txt` - Robots rules for crawlers

## 📝 Configuration

### Next.js Config

The `next.config.ts` is configured for static exports:
- `output: "export"` - Enables static HTML export
- `images.unoptimized: true` - Disables server-side image optimization
- `basePath: ""` - Set to your repository slug if deploying to a subdirectory

### Vercel Analytics

Vercel Analytics and Speed Insights are already integrated via:
- `@vercel/analytics`
- `@vercel/speed-insights`

These packages are automatically enabled when deployed on Vercel.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Next.js](https://nextjs.org/) and deployed on [Vercel](https://vercel.com)
