FROM nginx:1.23

RUN rm /etc/nginx/conf.d/default.conf
COPY .docker/nginx/ok-road-server.conf /etc/nginx/conf.d/

WORKDIR /app
