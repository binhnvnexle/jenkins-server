FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
COPY .env ./
RUN yarn install --only=development

COPY . .

# Generate Prisma database client code
RUN yarn prisma:generate
RUN yarn build

# FROM node:18-alpine as production
FROM node:18-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./
RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist
COPY .env ./
CMD ["node", "dist/main"]