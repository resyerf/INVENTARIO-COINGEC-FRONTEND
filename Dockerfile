# Stage 1: build the Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: serve with nginx
FROM nginx:alpine AS production

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled application from build stage
COPY --from=build /app/dist/inventario-frontend /usr/share/nginx/html

# Expose port and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
