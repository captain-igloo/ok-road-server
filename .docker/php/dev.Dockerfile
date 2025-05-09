FROM php:8.4-fpm

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

RUN apt update \
    && apt install -y git libpq-dev unzip \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && docker-php-ext-install pdo pdo_pgsql

WORKDIR /app
