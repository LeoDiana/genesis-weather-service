#!/bin/sh

# Extract host and port from DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's/^.*@([^:/]+):[0-9]+\/.*$/\1/')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's/^.*:([0-9]+)\/.*$/\1/')

echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Still waiting..."
  sleep 1
done

echo "✅ DB is up. Running migrations..."
npx prisma migrate deploy

echo "🚀 Starting server..."
node dist/index.js