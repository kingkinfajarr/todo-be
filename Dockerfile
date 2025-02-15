FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

RUN ls -l prisma

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps

RUN ls -l prisma

RUN npx prisma generate

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD npx prisma migrate deploy && npm run start:prod