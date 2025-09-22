FROM node:20-alpine

# Enable corepack so pnpm is available
RUN corepack enable

WORKDIR /app

# Copy only root manifest + lockfile first (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Copy the workspaces you need
COPY apps/server ./apps/server
COPY apps/types ./apps/types

# Install only the deps needed for server (resolves workspace: correctly)
RUN pnpm install --filter ./apps/server...

WORKDIR /app/apps/server

# Generate Prisma client
RUN pnpm exec prisma generate

# Build server
RUN pnpm build

EXPOSE 5000
CMD ["node", "dist/index.js"]
