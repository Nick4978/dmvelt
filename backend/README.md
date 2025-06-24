# Lien Manager Backend

## Setup

1. Run Prisma migration:
   ```
   npx prisma generate
   npx prisma migrate dev --name init
   ```

2. Start the server:
   ```
   npm run dev
   ```

3. API runs at http://localhost:4000/api

## Endpoints

- GET /api/liens
- GET /api/liens/:id
- PATCH /api/liens/:id/satisfy
- DELETE /api/liens/:id
- POST /api/liens/:id/report-error

## Recommended VSCode Extensions

- Prisma
- REST Client or Thunder Client
- ESLint
- DotEnv
