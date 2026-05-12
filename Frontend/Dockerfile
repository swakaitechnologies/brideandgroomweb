# Production Dockerfile for Matrimony Frontend (Vite/React)
# Optimized for minimal footprint (<20MB)

# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Environment variables for build time (Vite requires VITE_ prefix)
ARG VITE_API_URL
ARG VITE_STORAGE_URL
ARG VITE_UMAMI_URL
ARG VITE_UMAMI_WEBSITE_ID
ARG VITE_PLATFORM_NAME
ARG VITE_PLATFORM_DOMAIN
ARG VITE_SUPPORT_EMAIL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STORAGE_URL=$VITE_STORAGE_URL
ENV VITE_UMAMI_URL=$VITE_UMAMI_URL
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID
ENV VITE_PLATFORM_NAME=$VITE_PLATFORM_NAME
ENV VITE_PLATFORM_DOMAIN=$VITE_PLATFORM_DOMAIN
ENV VITE_SUPPORT_EMAIL=$VITE_SUPPORT_EMAIL

RUN npm run build

# Stage 2: Production
FROM nginx:1.27-alpine

# Copy built assets to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Custom Nginx config to handle SPA routing
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
