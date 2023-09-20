FROM node:lts-alpine AS dev
ENV NODE_ENV development

WORKDIR /opt/app

COPY package.json .
COPY package-lock.json .
COPY src .
COPY public .
RUN npm install --silent
CMD npm start
