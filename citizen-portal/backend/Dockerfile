# Stage 1: Dependency builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Runtime Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install essential ssl libraries for Prisma Postgres checks
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

# Create uploads storage mount points
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=12s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "dist/index.js"]
