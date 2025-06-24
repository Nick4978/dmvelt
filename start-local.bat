@echo off
echo Starting local setup for Lien Manager App...

:: Step 1: Start the database container
echo Starting Postgres container...
docker compose up -d db

:: Step 2: Wait for DB to come online
echo Waiting for Postgres container to be healthy...
:waitloop
docker inspect -f "{{.State.Health.Status}}" elt-db-1 | findstr healthy >nul
IF ERRORLEVEL 1 (
  timeout /t 2 >nul
  GOTO waitloop
)
echo Postgres is healthy!


:: Step 3: Setup backend
echo Installing backend dependencies...
cd backend
call npm install
start cmd /k "npm run dev"
call npx prisma generate
call npx prisma migrate dev --name init

echo Generating and applying Prisma schema...
cd ../frontend


:: Step 4: Setup frontend
echo Installing frontend dependencies...
call npm install

echo Starting frontend server...
start cmd /k "npm run dev"
cd ..

echo All systems should now be running locally:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:4000
pause
