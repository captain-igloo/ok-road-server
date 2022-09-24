FROM php:8.1-fpm AS build

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

RUN apt update \
    && apt install -y git libpq-dev unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && mkdir /app

COPY . /app
COPY .env.dist /app/.env

WORKDIR /app

RUN composer install --no-dev

FROM php:8.1-fpm

COPY .env.dist /app/.env
COPY composer.json /app/composer.json
COPY config /app/config
COPY public /app/public
COPY src /app/src
COPY templates /app/templates
COPY --from=build /app/vendor /app/vendor

RUN mkdir -p /app/var/cache/prod \
    && chown www-data:www-data /app/var/cache/prod \
    && mkdir -p /app/var/log \
    && chown www-data:www-data /app/var/log

WORKDIR /app
