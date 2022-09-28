FROM php:8.1-apache AS build

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY . /app
COPY .env.dist /app/.env

WORKDIR /app

RUN apt update \
    && apt install -y git unzip \
    && composer install --no-dev \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
    && NVM_DIR=/root/.nvm \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && nvm install 16.17.1 \
    && npm ci \
    && npm run build

FROM php:8.1-apache

COPY .docker/php/ok-road-server.conf /etc/apache2/sites-available/ok-road-server.conf
COPY .env.dist /app/.env
COPY composer.json /app/composer.json
COPY config /app/config
COPY --from=build /app/public /app/public
COPY src /app/src
COPY templates /app/templates
COPY --from=build /app/vendor /app/vendor

RUN apt update \
    && apt install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && a2dissite 000-default \
    && a2ensite ok-road-server \
    && a2enmod rewrite \
    && service apache2 restart \
    && mkdir -p /app/var/cache/prod \
    && chown www-data:www-data /app/var/cache/prod \
    && mkdir -p /app/var/log \
    && chown www-data:www-data /app/var/log

WORKDIR /app
