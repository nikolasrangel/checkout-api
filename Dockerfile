# base
FROM node:14.17.3-alpine AS base

WORKDIR /usr/app

COPY package*.json ./

# development
FROM node:14.17.3-alpine AS development

RUN apk add --no-cache curl

WORKDIR /usr/app

COPY --from=base /usr/app .

COPY . .

RUN npm install -q

# production
FROM node:14.17.3-alpine AS production

WORKDIR /usr/app

COPY --from=base /usr/app .

RUN npm install --production -q

COPY . .

CMD npm run start
