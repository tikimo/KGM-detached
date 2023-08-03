# syntax=docker/dockerfile:1.4

FROM node:18-alpine AS bob-the-builder

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm ci

COPY . /usr/src/app

EXPOSE 3086

CMD [ "npm", "run", "build" ]
#RUN npm run dev


