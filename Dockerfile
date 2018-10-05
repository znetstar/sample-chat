FROM node:8 AS build

WORKDIR /app

ADD package.json /app/package.json

RUN npm install

ADD . /app

RUN npm run build

FROM node:8

ENV NODE_ENV production

WORKDIR /app

ADD package.json /app/package.json

RUN npm install

ADD server.js /app/server.js

COPY --from=build /app/build /app/build

EXPOSE 3000

ENV PORT 3000

CMD npm start