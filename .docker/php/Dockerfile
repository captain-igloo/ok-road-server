FROM php:8.3-fpm AS build

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY . /app

WORKDIR /app

ENV NVM_DIR=/root/.nvm

RUN apt update \
    && apt install unzip \
    && composer install --no-dev \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install v20 \
    && nvm use v20 \
    && npm ci \
    && npm run build

FROM php:8.3-fpm

COPY bin /app/bin
COPY composer.json /app/composer.json
COPY config /app/config
COPY LICENSE /app/LICENSE
COPY public /app/public
COPY src /app/src
COPY templates /app/templates

COPY --from=build /app/vendor /app/vendor
COPY --from=build /app/public/js /app/public/js

RUN mkdir -p /app/var/cache \
    && chown www-data: /app/var/cache \
    && mkdir -p /app/var/log \
    && chown www-data: /app/var/log \
    && apt update \
    && apt install -y libpq-dev \
    && docker-php-ext-install opcache pdo pdo_pgsql \
    && apt clean

WORKDIR /app
