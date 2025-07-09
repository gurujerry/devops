# Use Node.js as base image
FROM node:18-alpine

# Install bash for scripts
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies with verbose output
RUN npm install --verbose

# Copy application files
COPY . .

# Make startup script executable
RUN chmod +x start.sh

# Create public directory if it doesn't exist
RUN mkdir -p public

# Expose port
EXPOSE 3000

# Use startup script
CMD ["./start.sh"]