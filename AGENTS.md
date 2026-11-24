<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repo facts

Workflow, merge and wireframe rules live in brignano/ai-tools `fleet/README.md`. This section holds only what is specific to this repo.

### Merging and CI

- Only merge commits are allowed. A squash merge fails with a 405. Head branches delete themselves on merge.
- Auto-merge is off. "Merge when ready" means wait for CI, then merge by hand. Lighthouse CI takes about 8 minutes.
- CI runs on pull requests only. Main gets no run after a merge (the workflow also allows `workflow_dispatch`). Production deploys through Vercel, which shows up as the commit status "Vercel".
- CI fonts render 2 to 4px wider than they do locally. A layout that just fits at 390px locally can still fail `scripts/fold-check.mjs`, so leave some room.

### Production and logs

- Agents can't read Vercel env vars: the Vercel connector gets a 403.
- `/coding` is prerendered, so its `[coding]` errors show up in the build logs, not runtime logs. The Hobby plan keeps runtime logs for only 1 hour.

### Hosting map

- DNS is on Cloudflare.
- The apex (`brignano.io`) is on Vercel, project `brignano-io`.
- `guidebook.brignano.io` is on Vercel, project `guidebook`.
- hoststats, driftwood and sites are Cloudflare Workers.
- `sites.brignano.io` is the front door of brignano/sites. Each client gets a `<slug>.brignano.io` preview, and the goal is a custom domain per client.
- When a new brignano.io subdomain or Worker ships, add it to `projects` in `lib/constants.ts`. Personal Workers stay off that list on purpose.
