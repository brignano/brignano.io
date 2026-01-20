# GitHub Copilot Instructions for brignano.io

This is a personal portfolio website built with Next.js 16, React 19, and TailwindCSS 4, deployed on Vercel.

## Tech Stack

- **Framework**: Next.js 16 with App Router and static export (`output: "export"`)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4 with dark mode support via `class` strategy
- **Language**: TypeScript with strict mode enabled
- **Package Manager**: npm
- **Deployment**: Vercel (static export to `out/` directory)

## Project Structure

- `app/` - Next.js app directory with pages and layouts
  - `page.tsx` - Home page
  - `coding/page.tsx` - Coding activity page (WakaTime + GitHub calendar)
  - `resume/page.tsx` - Resume page
  - `layout.tsx` - Root layout with header, footer, and global providers
  - `globals.css` - Global styles and Tailwind directives
- `components/` - Reusable React components
- `lib/` - Utilities, constants, and helper functions
  - `constants.ts` - Site metadata, social links, and constants
  - `gtag.ts` - Google Analytics helper
- `public/` - Static assets (images, favicon, resume.json, robots.txt)
- `types/` - TypeScript type definitions

## Coding Conventions

### TypeScript

- Use TypeScript for all new files with strict mode enabled
- Use explicit typing where it improves clarity
- Use `@/` import alias for absolute imports (e.g., `@/components/header`)
- Follow React 19 conventions (e.g., `React.ReactNode` for children)
 - Prefer optional chaining (`obj?.prop`) and nullish coalescing (`??`) when appropriate to reduce nested conditional checks and simplify runtime-safe property access.

### React Components

- Use functional components with hooks
- Client components should use `"use client"` directive at the top
- Server components are the default (no directive needed)
- Export components as default exports
- Use proper prop typing with TypeScript interfaces or types

### Styling

- Use TailwindCSS utility classes for styling
- Follow dark mode pattern: `dark:bg-zinc-900 bg-zinc-100` (dark class first)
- Use zinc color palette for neutral colors
- Use semantic color classes like `primary-color` when defined
- Responsive design: use `md:` prefix for tablet/desktop breakpoints
- Print styles: use `print:hidden` for elements that shouldn't appear in print

### Code Style

- Use Prettier for formatting (see `.prettierrc.json`):
  - 2 spaces for indentation
  - Double quotes for strings
  - Semicolons required
  - Trailing commas in ES5 style
  - 80 character line width
- Follow ESLint rules from `eslint.config.mjs` (Next.js + TypeScript rules)
- Use `eslint-disable-next-line` comments when necessary (e.g., for `console.error`, `alert`)

### State Management

- Use React hooks (`useState`, `useEffect`, etc.) for local state
- Use `localStorage` for persisting user preferences (e.g., theme)
- Check for browser APIs before using them (e.g., `typeof window !== "undefined"`)

### Images

- Use Next.js `Image` component from `next/image`
- Images are unoptimized due to static export (`images.unoptimized: true`)
- Always provide `alt`, `width`, and `height` attributes

### Analytics

- Google Analytics is configured via `lib/gtag.ts`
- Use `GA_MEASUREMENT_ID` constant for the tracking ID
- Analytics only load in production (`VERCEL_ENV === 'production'`)
- Vercel Analytics and Speed Insights are enabled

### Navigation

- Use Next.js `Link` component for internal navigation
- Use `usePathname()` hook to get current route

## Build & Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production (static export to `out/`)
- `npm run start` - Start Next.js production server (not used for static exports)
- `npm run lint` - Run ESLint

### Environment Setup

- Node.js 22 or higher recommended (see `.github/workflows/copilot-setup-steps.yml`)
- Dependencies are installed via `npm ci` in CI/CD
- Dev Container configuration available in `.devcontainer/`

### Environment Variables

- `GA_MEASUREMENT_ID` - Google Analytics tracking ID (optional, has default)
- `WAKATIME_API_KEY` - Required for coding statistics page
- `VERCEL_ENV` - Automatically set by Vercel (production/preview/development)
- `NODE_ENV` - Node environment (production/development)

## Key Features & Patterns

### Theme Toggle

- Dark mode is controlled via `dark` class on `<html>` element
- Theme preference is stored in `localStorage` with key `theme`
- Fallback to system preference via `prefers-color-scheme` media query

### Fonts

- Custom Google Fonts: Inconsolata and Silkscreen
- Font variables: `--font-inconsolata-mono`, `--font-silkscreen-mono`

### Static Export

- Next.js is configured for static export (`output: "export"`)
- No server-side rendering or API routes
- All pages are pre-rendered at build time
- Dynamic features requiring a server are disabled

### Structured Data

- JSON-LD structured data for SEO (Person schema)
- Configured in `app/layout.tsx`

## Testing & Quality

- ESLint is configured for code quality
- TypeScript strict mode for type safety
- No test framework currently configured

## Deployment

- Automatic deployment to Vercel on push
- Static files exported to `out/` directory
- GitHub Actions workflow for setup steps

## Important Notes

- This is a **static export** - avoid features that require a server
- Always check browser API availability before use
- Print functionality is important for resume page
- Responsive design is critical - test mobile and desktop
- Dark mode support is a core feature - always test both themes
- Google Fonts may fail to fetch in certain environments (network issues)

## Common Tasks

### Adding a new page

1. Create a new directory in `app/` with a `page.tsx` file
2. Export a default React component
3. Update navigation if needed (in `components/header.tsx`)
4. Add to sitemap if needed (`app/sitemap.ts`)

### Adding a new component

1. Create in `components/` directory
2. Use TypeScript for props
3. Follow existing naming conventions (kebab-case for files)
4. Export as default

### Updating metadata

- Edit `lib/constants.ts` for site-wide metadata
- Use Next.js `Metadata` API for page-specific metadata

### Adding environment variables

1. Add to `.env.local` for local development (not committed)
2. Add to Vercel project settings for production
3. Document in README.md

## Resources

- Next.js 16 docs: https://nextjs.org/docs
- TailwindCSS 4 docs: https://tailwindcss.com/docs
- React 19 docs: https://react.dev
- Vercel deployment: https://vercel.com/docs
