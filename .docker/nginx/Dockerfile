FROM node:24 AS build

COPY . /app

WORKDIR /app

RUN npm ci \
    && npm run build

FROM nginx:1.31

COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/public /app/public

RUN rm /etc/nginx/conf.d/default.conf
