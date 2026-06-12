FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json ./server/
RUN pnpm install --frozen-lockfile --filter nodeproyectosena...

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server ./server
WORKDIR /app/server
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/server
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/package.json ./
COPY --from=deps /app/server/node_modules ./node_modules
EXPOSE 8000
CMD ["node", "dist/index.js"]
