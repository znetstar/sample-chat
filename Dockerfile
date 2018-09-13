FROM node:8

WORKDIR /app

ADD package.json /app/package.json

RUN npm install

ADD client /app

FROM node:8

ENV NODE_ENV production

WORKDIR /app

ADD package.json /app/package.json

RUN npm install

ADD . /app

EXPOSE 3000

ENV PORT 3000

CMD npm start