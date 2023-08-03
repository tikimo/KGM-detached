# syntax=docker/dockerfile:1.4

# Create image based on the official Node image from dockerhub
FROM node:18-alpine AS bob-the-builder

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# Install dependecies (doing this first on package.json reduces docker overhead)
RUN npm install

# Install vite separately (idk why it works but dont remove)
RUN npm install vite

# Get all the code needed to run the app
COPY . /usr/src/app

# Select prod env
ENV NODE_ENV production

# Build the app
RUN npm run build

# Serve the app
FROM nginx:alpine

# Copy the nginx.conf provided from ui repo
COPY --from=bob-the-builder /usr/src/app/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=bob-the-builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]