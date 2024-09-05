FROM php:8.3-fpm AS build

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY . /app

RUN apt update \
    && apt install unzip \
    && cd /app \
    && composer install --no-dev

FROM php:8.3-fpm

COPY bin /app/bin
COPY composer.json /app/composer.json
COPY config /app/config
COPY LICENSE /app/LICENSE
COPY public /app/public
COPY src /app/src
COPY templates /app/templates

COPY --from=build /app/vendor /app/vendor

RUN mkdir -p /app/var/cache \
    && chown www-data: /app/var/cache \
    && mkdir -p /app/var/log \
    && chown www-data: /app/var/log \
    && apt update \
    && apt install -y libpq-dev \
    && docker-php-ext-install opcache pdo pdo_pgsql \
    && apt clean

WORKDIR /app
