FROM node:24 AS build

COPY . /app

WORKDIR /app

RUN npm ci \
    && npm run build

FROM nginx:1.29

COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/
COPY .docker/nginx/fullchain.pem /etc/letsencrypt/live/okroad.nz/
COPY .docker/nginx/privkey.pem /etc/letsencrypt/live/okroad.nz/
COPY .docker/nginx/options-ssl-nginx.conf /etc/letsencrypt/
COPY .docker/nginx/ssl-dhparams.pem /etc/letsencrypt/
COPY --from=build /app/public /app/public

RUN rm /etc/nginx/conf.d/default.conf
