# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Build the application for production
# This will create a 'dist' directory
RUN npm run build

# Stage 2: Serve the application
FROM node:22-alpine AS runner

WORKDIR /app

# Install the 'serve' package globally
RUN npm install -g serve

# Copy only the built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the static file server
# -s : serve single page applications (rewrites all not-found requests to `index.html`)
# -l : listen on specified port
CMD ["serve", "-s", "dist", "-l", "3000"]
