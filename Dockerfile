FROM node:18-alpine

RUN apk update && apk add bash
RUN npm i -g pnpm

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

CMD [ "/bin/bash", "-c", "if [ ${NODE_ENV} = 'development' ]; then pnpm start:dev; else pnpm start; fi"]