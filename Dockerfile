# ----- Build stage -----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps using lockfile if present
COPY package*.json ./
RUN npm ci

# Copy the rest and build
COPY . .
RUN npm run build   # Vite -> /app/dist

# ----- Runtime stage -----
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build artifacts
COPY --from=build /app/dist .

# SPA routing + gzip, etc.
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Optional: container healthcheck (Nginx responds on :80)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
