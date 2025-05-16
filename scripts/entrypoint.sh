#!/bin/sh

echo "⏳ Waiting for PostgreSQL at $DATABASE_URL..."

until nc -z db 5432; do
  echo "Still waiting..."
  sleep 1
done

echo "✅ DB is up. Running migrations..."
npx prisma migrate deploy

echo "🚀 Starting server..."
node dist/index.js