FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Install platform-specific lightningcss binaries for both architectures
RUN npm install lightningcss-linux-arm64-gnu lightningcss-linux-x64-gnu --save-optional

# Install platform-specific tailwindcss oxide binaries for both architectures
RUN npm install @tailwindcss/oxide-linux-arm64-gnu @tailwindcss/oxide-linux-x64-gnu --save-optional

# Rebuild native modules to ensure compatibility
RUN npm rebuild

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# Set production environment
ENV NODE_ENV=production

# AWS environment variables for build time (if needed during build)
ARG AWS_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy public directory and standalone build
COPY --from=builder /app/public ./public

# Set up .next directory with proper permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build and static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Note: AWS environment variables should be provided at runtime
# via docker run -e or docker-compose environment configuration

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"] 