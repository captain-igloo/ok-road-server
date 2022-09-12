FROM nginx:1.23

RUN rm /etc/nginx/conf.d/default.conf
COPY .docker/nginx/speedo.conf /etc/nginx/conf.d/

WORKDIR /app
