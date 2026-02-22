# Stage 1: Build the Angular application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Remove package-lock.json if it exists (we use pnpm-lock.yaml)
RUN rm -f package-lock.json || true

# Install dependencies (skip prepare script which requires git)
RUN pnpm i --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Build the application for production (using docker configuration with relaxed budgets)
RUN pnpm build --configuration docker

# Stage 2: Serve with Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install serve globally to serve static files
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist/dosi-bridge/browser ./dist

# Expose port 4200 (Angular default port)
EXPOSE 4200

# Start serve
CMD ["serve", "-s", "dist", "-l", "4200"]

