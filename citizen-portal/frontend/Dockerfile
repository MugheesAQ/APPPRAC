FROM node:22-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./
# Use npm install instead of npm ci to prevent lockfile mismatch issues
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
# Copy the built assets from Vite's dist folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Provide SPA fallback routing for React Router
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
