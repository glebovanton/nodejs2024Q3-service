FROM node:22.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

CMD npx prisma generate && npx prisma migrate deploy && npm run start:dev

LABEL authors="antonglebov"
LABEL version="1.0"
LABEL description="This Docker image runs a Next.js application with PostgreSQL database"

RUN npm run build

EXPOSE 5432

CMD ["npm", "start"]
