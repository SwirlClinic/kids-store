# Multi-stage build for Kids Store Webapp
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build the frontend
FROM base AS frontend-builder
WORKDIR /app

# Copy frontend files
COPY frontend/package*.json ./frontend/
COPY frontend/ ./frontend/
COPY shared/ ./shared/

# Install frontend dependencies and build
RUN cd frontend && npm ci && npm run build

# Build the backend
FROM base AS backend-builder
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
COPY backend/ ./backend/
COPY shared/ ./shared/

# Install backend dependencies and build
RUN cd backend && npm ci && npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built applications
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/dist ./frontend/dist
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/package*.json ./backend/

# Install backend production dependencies
RUN cd backend && npm ci --only=production

# Create necessary directories
RUN mkdir -p database uploads/images uploads/sounds
RUN chown -R nextjs:nodejs database uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
CMD ["node", "backend/dist/src/index.js"] 