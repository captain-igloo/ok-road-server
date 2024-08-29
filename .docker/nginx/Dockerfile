FROM php:8.3-fpm AS build

COPY . /app

ENV NVM_DIR=/root/.nvm

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install v20 \
    && cd /app \
    && npm ci \
    && npm run build

FROM nginx:1.25

COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/public /app/public

RUN rm /etc/nginx/conf.d/default.conf
