#!/bin/sh
set -e

echo "Waiting for Postgres..."

until pg_isready -h db -p 5432; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Postgres is up, running migrations..."

yarn prisma migrate deploy
yarn prisma db seed

echo "Starting app..."

# node dist/main.js
yarn nest start
