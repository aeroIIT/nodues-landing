# nodues-web

Marketing/waitlist site for NoDues. React SPA built with Vite, served in production by a
tiny Express static server, containerized, and deployed to Coolify via GitHub Actions →
GitLab registry.

Waitlist submissions are written directly to the shared Vocallabs Hasura database
(`website_leads` table, `type = "nodues"`) using Hasura's public `anonymous` role — no
backend secret involved.

## Stack

| Layer      | Tech                                                            |
| ---------- | -------------------------------------------------------------- |
| UI         | React 19, Vite 7, TypeScript, Tailwind CSS 4, Radix UI, wouter |
| Server     | Express 4 (serves the built SPA, SPA-fallback routing)         |
| Data       | Hasura GraphQL (`https://db.vocallabs.ai/v1/graphql`)          |
| Build      | Vite (client) + esbuild (server bundle)                        |
| Package mgr| pnpm 10                                                        |
| Container  | Docker (multi-stage, `node:22-alpine`, non-root)               |
| CI/CD      | GitHub Actions → GitLab Container Registry → Coolify (SSH)     |

## Layout

```
client/               # React SPA (Vite root)
  src/
    pages/Home.tsx     # landing page + waitlist form (Hasura insert)
    pages/NotFound.tsx
    components/        # Snippets, ErrorBoundary, ui/ (Radix primitives)
    contexts/          # ThemeContext
    lib/utils.ts       # cn() etc.
    App.tsx, main.tsx
  public/
server/index.ts        # Express static server + SPA fallback
Dockerfile             # multi-stage build → runtime
vite.config.ts         # @ alias → client/src, build → dist/public
.github/workflows/     # build + deploy pipeline
```

Build output: client → `dist/public/`, server → `dist/index.js`. The server serves
`dist/public/` and falls back to `index.html` for client-side routes.

## Local development

Requires Node 22+ and pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev          # Vite dev server on http://localhost:3000
```

Other scripts:

```bash
pnpm build        # vite build (client) + esbuild bundle (server) → dist/
pnpm start        # run the production build: NODE_ENV=production node dist/index.js
pnpm preview      # preview the built client
pnpm check        # tsc --noEmit
pnpm format       # prettier --write .
```

## Configuration

| Env var           | Where   | Default                                  | Purpose                                  |
| ----------------- | ------- | ---------------------------------------- | ---------------------------------------- |
| `VITE_HASURA_URL` | client  | `https://db.vocallabs.ai/v1/graphql`     | GraphQL endpoint the waitlist form posts to |
| `PORT`            | server  | `3000`                                   | Express listen port                      |
| `NODE_ENV`        | server  | —                                        | `production` serves `dist/public`        |

`VITE_*` vars are inlined into the client bundle at build time.

## Waitlist → Hasura

`Home.tsx` posts a GraphQL mutation straight to Hasura on submit:

- Table: `vocallabs.website_leads`
- Role: `anonymous` (public insert permission — no admin secret in the client)
- Fields: `name`, `phone_number`, `company_email_id` (email), `referral`, `type: "nodues"`

> ⚠️ The insert is unauthenticated and has **no captcha or rate limiting** — anyone can
> submit leads. Add bot protection (Turnstile/hCaptcha) or proxy the insert through the
> Express server before relying on lead quality.

## Docker

```bash
docker build -t nodues-landing .
docker run -p 3000:3000 nodues-landing   # → http://localhost:3000
```

Multi-stage: builder installs all deps and runs `pnpm build`; runner keeps only prod deps
plus `dist/`, runs as a non-root `nodejs` user, and ships a `HEALTHCHECK` that probes `/`.

## Deployment

Push to `main` triggers [`.github/workflows/nodues-landing-gitlab.yml`](.github/workflows/nodues-landing-gitlab.yml):

1. **build-and-push** — build the Docker image, push to GitLab Container Registry.
2. **deploy** — SSH to the host and run `coolify` `setup.sh build nodues-landing`.
3. **notify** — WhatsApp deploy notification.

Required GitHub Actions secrets: `GITLAB_USERNAME`, `GITLAB_TOKEN`, `SSH_PRIVATE_KEY`,
`WHATSAPP_API_KEY`.

## Notes

- `.mcp.json` (Hasura MCP config with admin secrets) is gitignored — keep it that way.
- `patches/` holds a pnpm patch for `wouter`; it must exist before `pnpm install` (the
  Dockerfile copies it in first).
```
