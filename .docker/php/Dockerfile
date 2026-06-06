FROM php:8.4-fpm AS build

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY --from=node:24 /usr/local/bin/node /usr/local/bin/node
COPY --from=node:24 /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY . /app

RUN apt update \
    && apt install unzip \
    && cd /app \
    && composer install --no-dev \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && npm ci \
    && npm run build

FROM php:8.4-fpm

COPY bin /app/bin
COPY composer.json /app/composer.json
COPY config /app/config
COPY LICENSE /app/LICENSE
COPY public /app/public
COPY src /app/src
COPY templates /app/templates

COPY --from=build /app/node_modules/bootstrap/dist/css/bootstrap.min.css /app/public/css/bootstrap.min.css
COPY --from=build /app/vendor /app/vendor
COPY --from=build /app/public/js /app/public/js

RUN mkdir -p /app/var/cache \
    && chown www-data: /app/var/cache \
    && mkdir -p /app/var/log \
    && chown www-data: /app/var/log \
    && mkdir -p /app/var/sessions \
    && chown www-data: /app/var/sessions \
    && apt update \
    && apt install -y libpq-dev \
    && docker-php-ext-install opcache pdo pdo_pgsql \
    && apt clean

WORKDIR /app
