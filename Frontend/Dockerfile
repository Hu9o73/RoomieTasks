# Multi-stage build for Angular application

# Development stage for hot reload
FROM node:18-alpine as development

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development server port
EXPOSE 4200

# Start development server with host set to allow external connections
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "500"]

# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Production stage
FROM nginx:alpine as production

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]