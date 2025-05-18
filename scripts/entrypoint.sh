#!/bin/sh

echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Still waiting..."
  sleep 2
done

echo "✅ DB is up. Running migrations..."
npx prisma migrate deploy

echo "🚀 Starting server..."
node dist/index.js