# Example: backend Dockerfile
FROM node:20

WORKDIR /app

COPY ./backend ./backend
COPY ./prisma ./prisma
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma

CMD ["npm", "run", "start"]
