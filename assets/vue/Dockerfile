FROM node:lts-alpine AS node_upstream

# Base stage for dev and build
FROM node_upstream AS base

WORKDIR /app

# install vite globally
RUN npm install -g vite

# Development image
FROM base as dev

EXPOSE 5173
ENV PORT 5173
ENV HOSTNAME localhost

CMD ["sh", "-c", "yarn install; yarn dev"]
