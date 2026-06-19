###############################################################################
# Dockerfile — kopkarpay-backoffice
#
# Build  : Bun
# Runtime: Node 24 Alpine
#
# Stages:
#   deps
#   build
#   staging
#   production
#
# Requires:
#   output: 'standalone'
###############################################################################

# ─────────────────────────────────────────────────────────────────────────────
# Base (Bun)
# ─────────────────────────────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# ─────────────────────────────────────────────────────────────────────────────
# Dependencies
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS deps

COPY package.json bun.lock ./

RUN \
    --mount=type=cache,target=/root/.bun/install/cache \
    bun install \
    --frozen-lockfile

# ─────────────────────────────────────────────────────────────────────────────
# Build
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS build

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN bun run build

###############################################################################
# TARGET: staging
###############################################################################
FROM node:24-alpine AS staging

RUN addgroup -S appgroup \
    && adduser -S -G appgroup appuser

WORKDIR /app

ENV NODE_ENV=staging
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=build --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=build --chown=appuser:appgroup /app/public ./public

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]

###############################################################################
# TARGET: production
###############################################################################
FROM node:24-alpine AS production

RUN addgroup -S appgroup \
    && adduser -S -G appgroup appuser

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=build --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=build --chown=appuser:appgroup /app/public ./public

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]