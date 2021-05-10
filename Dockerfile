# syntax=docker/dockerfile:1

FROM node:14.16.0-alpine3.13
ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN yarn --production


CMD [ "node","./dist/server.js" ]