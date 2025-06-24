#!/bin/bash

# --- Ensure you're in the root of your project ---

echo "⏳ Starting local setup for Lien Manager App..."

# Step 1: Start the database container only
echo "🚀 Starting Postgres container..."
docker compose up -d db

# Step 2: Wait for the DB to be ready (basic wait)
echo "⏱️ Waiting 5 seconds for DB to be ready..."
sleep 5

# Step 3: Setup backend
echo "🔧 Installing backend dependencies..."
cd backend
npm install

echo "🔄 Generating and applying Prisma schema..."
npx prisma generate
npx prisma migrate dev --name init

echo "🚀 Starting backend server..."
npm run dev &
cd ..

# Step 4: Setup frontend
echo "🔧 Installing frontend dependencies..."
cd frontend
npm install

echo "🚀 Starting frontend server..."
npm run dev &
cd ..

echo "✅ All systems should now be running locally at:"
echo "➡ Frontend: http://localhost:3000"
echo "➡ Backend:  http://localhost:4000"
