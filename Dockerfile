# Stage 1: Build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy the full project and build TypeScript
COPY . .
RUN npm run build

RUN npx prisma generate

# Stage 2: Production image
FROM node:18-alpine

# Install tiny shell utilities (for `nc`)
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy built output and node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/swagger.yaml ./swagger.yaml

# Copy custom entrypoint script
COPY scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Set environment variable for production port
ENV NODE_ENV=production

# Run custom entrypoint that waits for DB, migrates, then starts app
CMD ["./entrypoint.sh"]