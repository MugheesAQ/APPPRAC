FROM node:22-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./

# Use npm install instead of npm ci to prevent lockfile conflicts
RUN npm install

COPY . .
RUN npm run build

FROM node:22-bullseye-slim
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
