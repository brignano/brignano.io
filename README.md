# brignano.io

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbrignano%2Fbrignano.io)

A personal website and portfolio built with Next.js 15, React 19, and TailwindCSS 4, deployed on Vercel.

## 🚀 Features

- **Next.js 15** with App Router and static export support
- **React 19** with modern hooks and components
- **TailwindCSS 4** for styling
- **TypeScript** for type safety
- **Vercel Analytics** and **Speed Insights** integration
- **GitHub Calendar** visualization
- **AOS** (Animate On Scroll) animations

## 🛠️ Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Getting Started

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

### Development with DevContainer

This repository includes a DevContainer configuration for VS Code. To use it:

1. Install [Docker](https://www.docker.com/products/docker-desktop) and [VS Code](https://code.visualstudio.com/)
2. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open the repository in VS Code
4. When prompted, click "Reopen in Container" (or run the command "Dev Containers: Reopen in Container")
5. The container will automatically install dependencies after building

The DevContainer includes:
- Node.js 20
- Git and GitHub CLI
- ESLint and Prettier extensions
- TailwindCSS IntelliSense
- All recommended VS Code extensions for Next.js/React development

### Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
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
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── skills/            # Skills page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── public/               # Static assets
├── utils/                # Utility functions
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # TailwindCSS configuration
└── tsconfig.json         # TypeScript configuration
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
