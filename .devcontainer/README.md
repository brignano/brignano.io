# DevContainer Setup for GitHub Copilot

This DevContainer is optimized for development with GitHub Copilot and includes automated dependency installation and caching.

## Features

### Automated Dependency Management

The DevContainer uses lifecycle commands to ensure dependencies are always up-to-date:

1. **onCreateCommand**: Runs when the container is first created
   - Sets up dependency cache
   - Installs dependencies using `npm ci --prefer-offline --no-audit` for faster, more reliable installs

2. **postCreateCommand**: Runs after the container is fully created
   - Attempts to build the project to verify everything is working
   - Continues even if build fails (useful for initial setup)

3. **updateContentCommand**: Runs when the container is rebuilt or repository is updated
   - Updates dependencies to match package-lock.json
   - Uses cached packages when available for faster updates

### Performance Optimizations

- **Node Modules Volume Mount**: The `node_modules` directory is mounted as a Docker volume for significantly faster I/O operations
- **Offline-First Install**: Uses `npm ci --prefer-offline` to prefer cached packages, reducing network requests
- **No Audit**: Skips npm audit checks during installation for faster setup (audit can be run manually with `npm audit`)

## Container Configuration

- **Base Image**: `mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm`
  - Node.js 20 LTS
  - TypeScript pre-installed
  - Git and common development tools

- **Additional Features**:
  - Git (latest version)
  - GitHub CLI (`gh`)

- **VS Code Extensions**:
  - ESLint - Code linting
  - Prettier - Code formatting
  - Tailwind CSS IntelliSense - CSS class completion
  - Material Icon Theme - File icons
  - Auto Rename Tag - HTML/JSX tag editing
  - ES7+ React/Redux/React-Native snippets - React code snippets

## Development Workflow

### First Time Setup

When you first open the repository in the DevContainer:

1. The container builds (2-3 minutes)
2. Dependencies are automatically installed via `onCreateCommand`
3. The project is built via `postCreateCommand` to verify setup
4. You're ready to start coding!

### Working with Dependencies

**Adding new dependencies:**
```bash
npm install <package-name>
```

**Updating dependencies:**
```bash
npm update
```

**Cleaning cache and reinstalling:**
```bash
rm -rf node_modules
npm ci
```

### Rebuilding the Container

If you update the DevContainer configuration or need a fresh start:

1. Command Palette (`Ctrl/Cmd + Shift + P`)
2. Select "Dev Containers: Rebuild Container"
3. The `updateContentCommand` will run automatically

## Port Forwarding

- **Port 3000**: Next.js development server
  - Automatically forwarded
  - Shows notification when server starts
  - Access at `http://localhost:3000`

## Tips for Copilot Users

1. **Use npm ci for reproducible builds**: The DevContainer uses `npm ci` instead of `npm install` to ensure consistent dependency versions across all environments

2. **Cached dependencies**: Dependencies are cached in Docker volumes, making subsequent container rebuilds much faster

3. **Automatic formatting**: Code is automatically formatted on save using Prettier

4. **ESLint integration**: ESLint runs automatically and can fix issues on save

5. **Pre-configured for TypeScript**: Full TypeScript support with IntelliSense and type checking

## Troubleshooting

### Dependencies not installing
```bash
# Manually install dependencies
npm ci
```

### Build errors
```bash
# Run build manually to see full error output
npm run build
```

### Container performance issues
- Ensure Docker Desktop has sufficient resources (4GB RAM minimum, 8GB recommended)
- The node_modules volume mount should significantly improve performance

### Need to reset everything
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm ci
```

## Manual Setup (Without DevContainer)

If you're not using the DevContainer but want similar benefits:

1. Ensure you have Node.js 20+ installed
2. Install dependencies:
   ```bash
   npm ci --prefer-offline --no-audit
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Additional Resources

- [VS Code DevContainers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Next.js Documentation](https://nextjs.org/docs)
- [npm ci Documentation](https://docs.npmjs.com/cli/v10/commands/npm-ci)
