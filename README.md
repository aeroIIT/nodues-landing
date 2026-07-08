# NoDues

**The OS for intelligent collection at scale.**

NoDues is a voice-AI-powered, agentic infrastructure layer for debt recovery. It unifies
**decisioning, orchestration, and execution** into a single platform so that intelligence —
not headcount — drives every account. It decides *whom* to pursue, *when*, and *how*, then
autonomously carries out that strategy across voice, WhatsApp, SMS, and email, escalating to
human agents only when it matters.

Built for enterprise lenders, fintechs, and collection teams operating from one account to
tens of millions.

## The problem it solves

Collection at scale is a decision problem, not a dialing problem. Enterprise recovery teams
have too many accounts and too little intelligence about who to pursue, when, and how — the
usual result being manual outreach with no strategy, best people wasted on accounts that
won't pay (or would have anyway), siloed CRM/dialer/payment systems, compliance exposure on
every manual interaction, and growth that only comes from adding headcount.

## Platform capabilities

- **Intelligent targeting** — scores and prioritizes every account (who, when, how hard)
  using behavioral, risk, and payment signals.
- **Decision engine** — codify your collection strategy as policies the system executes
  consistently across millions of accounts.
- **Omnichannel orchestration** — coordinates voice, WhatsApp, SMS, and email as one
  strategy per account, not disconnected blasts.
- **Real-time negotiation** — AI agents remind, offer payment plans, and handle objections
  across channels, firm but empathetic, per your defined strategy.
- **Portfolio intelligence** — live visibility into recovery, risk, and automation
  performance across the whole book.
- **Human-in-the-loop** — autonomous execution that escalates to your team only when needed.
- **Built for scale & compliance** — deploy in your own cloud or on-prem so data never
  leaves your perimeter; audit trails and guardrails baked into every action; integrates
  with existing CRMs, dialers, and core banking (no rip-and-replace).

## Why enterprises build on NoDues

- **Runs on your infrastructure** — your cloud or on-prem; full data residency and
  compliance control.
- **Integrates with your stack** — CRMs, dialers, core banking, data pipelines.
- **Decisions, not just dials** — the intelligence layer single-point tools never solve.
- **Scales without headcount** — grow recovery by adding intelligence, not agents.

---

# This repository — `nodues-web`

The public marketing / waitlist site for NoDues. React SPA built with Vite, served in
production by a small Express static server, containerized, and deployed to Coolify.

Waitlist submissions are written directly to the Vocallabs Hasura database
(`website_leads` table, `type = "nodues"`) via Hasura's public `anonymous` role — no backend
secret in the client.

## Stack

| Layer       | Tech                                                           |
| ----------- | -------------------------------------------------------------- |
| UI          | React 19, Vite 7, TypeScript, Tailwind CSS 4, Radix UI, wouter |
| Server      | Express 4 (serves the built SPA, SPA-fallback routing)         |
| Data        | Hasura GraphQL (`https://db.vocallabs.ai/v1/graphql`)          |
| Build       | Vite (client) + esbuild (server bundle)                        |
| Package mgr | pnpm 10                                                        |
| Container   | Docker (multi-stage, `node:22-alpine`, non-root)              |
| CI/CD       | GitHub Actions → GitLab Container Registry → Coolify (SSH)     |

## Layout

```
client/                # React SPA (Vite root)
  src/
    pages/Home.tsx      # landing page + waitlist form (Hasura insert)
    pages/NotFound.tsx
    components/         # Snippets, ErrorBoundary, ui/ (Radix primitives)
    contexts/           # ThemeContext
    lib/utils.ts
    App.tsx, main.tsx
  public/
server/index.ts         # Express static server + SPA fallback
Dockerfile              # multi-stage build → runtime
vite.config.ts          # @ alias → client/src, build → dist/public
.github/workflows/      # build + deploy pipeline
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

| Env var           | Where  | Default                              | Purpose                                     |
| ----------------- | ------ | ------------------------------------ | ------------------------------------------- |
| `VITE_HASURA_URL` | client | `https://db.vocallabs.ai/v1/graphql` | GraphQL endpoint the waitlist form posts to |
| `PORT`            | server | `3000`                               | Express listen port                         |
| `NODE_ENV`        | server | —                                    | `production` serves `dist/public`           |

`VITE_*` vars are inlined into the client bundle at build time.

## Waitlist → Hasura

`Home.tsx` posts a GraphQL mutation straight to Hasura on submit:

- Table: `vocallabs.website_leads`
- Role: `anonymous` (public insert permission — no admin secret in the client)
- Fields: `name`, `phone_number`, `company_email_id` (email), `referral`, `type: "nodues"`

> ⚠️ The insert is unauthenticated with **no captcha or rate limiting** — anyone can submit
> leads. Add bot protection (Turnstile/hCaptcha) or proxy the insert through the Express
> server before relying on lead quality.

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
