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
- **Resume Integration** at `/resume` path (served via CloudFront proxy)

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

The resume is accessible at `/resume` and is served via a CloudFront proxy in production. For local development, this route will return a 404 until the infrastructure is configured.

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

### Environment Variables

If you need environment variables for your deployment:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, and Development environments

## 🏗️ Project Structure

```
.
├── .devcontainer/          # DevContainer configuration
├── .github/               # GitHub workflows and configurations
├── app/                   # Next.js app directory
│   ├── about/            # About page
│   ├── skills/           # Skills page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
├── public/              # Static assets
├── utils/               # Utility functions
├── eslint.config.mjs    # ESLint configuration
├── next.config.ts       # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
├── tailwind.config.ts   # TailwindCSS configuration
└── tsconfig.json        # TypeScript configuration
```

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
