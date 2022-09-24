FROM php:8.1-fpm

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

RUN apt update && apt install -y git libpq-dev unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug

WORKDIR /app
