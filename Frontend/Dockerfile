# Development image with hot-reload
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Start dev server with host 0.0.0.0 to allow external access
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

# Expose Angular dev server port
EXPOSE 4200