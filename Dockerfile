# syntax=docker/dockerfile:1

# Use Debian (glibc) — Alpine/musl often breaks lightningcss + Next SWC optional binaries.
FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
# Prefer install over ci when lockfile may lag optional/platform transitive deps (emnapi, lightningcss).
RUN npm install --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Ensure native CSS/SWC bindings match this Linux image after any lockfile quirks.
RUN npm rebuild lightningcss || true \
  && npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3003
ENV HOSTNAME=0.0.0.0
ENV BACKEND_API_URL=https://api.ebrazclinic.ir/

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3003

CMD ["node", "server.js"]
