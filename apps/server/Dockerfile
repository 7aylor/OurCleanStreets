FROM node:20-alpine

# Enable corepack so pnpm is available
RUN corepack enable

WORKDIR /app

# Copy only root manifest + lockfile first (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Copy the workspaces you need
COPY apps/library ./apps/library
COPY apps/types ./apps/types
COPY apps/server ./apps/server

# Install dependencies for the whole monorepo
RUN pnpm install --recursive

# Build the shared library first so its dist output exists
RUN pnpm --filter @ocs/library build

# Then build the server (which depends on the library)
RUN pnpm --filter @ocs/server build

# hacky work around to get library into server
RUN mkdir -p /app/apps/server/node_modules/@ocs/library && \
    cp -r /app/apps/library/dist/* /app/apps/server/node_modules/@ocs/library/


WORKDIR /app/apps/server

# Generate Prisma client
RUN pnpm exec prisma generate

EXPOSE 5000
CMD ["node", "dist/index.js"]
