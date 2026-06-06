FROM node:24 AS build

COPY . /app

WORKDIR /app

RUN npm ci \
    && npm run build

FROM nginx:1.31

COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/public /app/public
COPY --from=build /app/node_modules/bootstrap/dist/css/bootstrap.min.css /app/public/css/bootstrap.min.css

RUN rm /etc/nginx/conf.d/default.conf
