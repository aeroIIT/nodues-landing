# Build stage — install all deps and produce dist/ (vite client + esbuild server)
FROM node:22-alpine AS builder

WORKDIR /app
RUN corepack enable

# pnpm patches are applied during install, so patches/ must exist before it runs
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage — only prod deps (express) + the built dist/
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --prod --frozen-lockfile

# server/index.ts is bundled with --packages=external, so it imports express
# from node_modules at runtime and expects dist/public/ beside dist/index.js.
COPY --from=builder /app/dist ./dist

# Run as non-root (alpine adduser/addgroup syntax)
RUN addgroup -g 1001 -S nodejs \
    && adduser -S -u 1001 -G nodejs nodejs
USER nodejs

EXPOSE 3000

# Node 20+ has fetch built-in; probe the static server
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/index.js"]
