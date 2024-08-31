FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

FROM base AS dev

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build

RUN npm run build

FROM nginx:alpine AS prod

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]