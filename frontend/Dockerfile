# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY ./frontend ./frontend
COPY ./shared ./shared

WORKDIR /app/frontend

RUN npm install
RUN npm run build

# Stage 2: Serve
FROM node:20
WORKDIR /app

COPY --from=builder /app/frontend ./
COPY --from=builder /app/shared ../shared

RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
