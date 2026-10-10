# syntax=docker/dockerfile:1.7
# Multi-stage build: compile every library + the home site with Node, then
# serve the static output from an unprivileged nginx (uid 101, port 8080).

# Base images are pinned by tag and digest directly in FROM (not via ARG) so
# Dependabot can bump both together. Node 24 LTS: upstream pins Node 20
# (.node-version), which is past end of life.

# ---------- build ----------
FROM node:24.16.0-alpine3.22@sha256:191c9f0080fcbbc6547a85dc0ff7988072214a355aabdc1d2ec55a7dae5eea8a AS build
WORKDIR /app
ENV CI=true \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# Workspace manifests and sources; the lockfile pins every dependency.
COPY package.json package-lock.json ./
COPY packages ./packages
COPY sites ./sites

# No lifecycle scripts: dependencies must not run code at install time.
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts
RUN npm run build:site-home

# ---------- runtime ----------
FROM nginxinc/nginx-unprivileged:1.31.6-alpine@sha256:b9241c6e7b8e9a862f129d8d4199ab64b10390949a78bdd5603379b32c844083 AS runtime

LABEL org.opencontainers.image.title="source-libraries" \
      org.opencontainers.image.description="Self-hosted build of the MIT-licensed Libraries.dev UI libraries and site" \
      org.opencontainers.image.source="https://github.com/Atlas-6174/source-libraries" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Atlas-6174 (https://github.com/Atlas-6174)"

# Pick up Alpine security fixes released after the base image was built
# (e.g. CVE-2026-4775 in tiff), then drop back to the image's unprivileged user.
USER root
RUN apk upgrade --no-cache
USER 101

COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
# Root-owned, world-readable: the nginx user can serve but not modify content.
COPY --from=build /app/sites/home/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --start-interval=1s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
