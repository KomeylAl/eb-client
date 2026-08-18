# syntax=docker/dockerfile:1

# Debian/glibc — avoids Alpine musl native binary issues with lightningcss/Next SWC.
FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
# Install app deps, then force the Linux glibc lightningcss binary
# (lockfiles generated on Windows often skip the correct optional native package).
RUN npm install --no-audit --no-fund --include=optional \
  && npm install --no-save --no-package-lock lightningcss-linux-x64-gnu@1.32.0 \
  && node -e "require('lightningcss'); console.log('lightningcss ok')"

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Re-assert native binding after COPY (in case context ever interfered).
RUN npm install --no-save --no-package-lock lightningcss-linux-x64-gnu@1.32.0 \
  && node -e "require('lightningcss')" \
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
