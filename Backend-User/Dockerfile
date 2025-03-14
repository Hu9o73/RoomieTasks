# Development image with hot-reload
FROM node:18-alpine

WORKDIR /app

# Copy package.json and tsconfig.json
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode (using ts-node for direct TypeScript execution)
CMD ["npm", "start"]