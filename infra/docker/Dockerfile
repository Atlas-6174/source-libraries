# syntax=docker/dockerfile:1.7
# Multi-stage build: compile every library + the home site with Node, then
# serve the static output from an unprivileged nginx (uid 101, port 8080).

ARG NODE_IMAGE=node:20.20.2-alpine3.22
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.30.5-alpine

# ---------- build ----------
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV CI=true \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

# Workspace manifests and sources; the lockfile pins every dependency.
COPY package.json package-lock.json ./
COPY packages ./packages
COPY sites ./sites

RUN --mount=type=cache,target=/root/.npm npm ci
RUN npm run build:site-home

# ---------- runtime ----------
FROM ${NGINX_IMAGE} AS runtime

LABEL org.opencontainers.image.title="source-libraries" \
      org.opencontainers.image.description="Self-hosted build of the MIT-licensed Libraries.dev UI libraries and site" \
      org.opencontainers.image.source="https://github.com/Atlas-6174/source-libraries" \
      org.opencontainers.image.licenses="MIT"

COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
# Root-owned, world-readable: the nginx user can serve but not modify content.
COPY --from=build /app/sites/home/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --start-interval=1s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
