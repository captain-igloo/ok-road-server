FROM nginx:1.29

COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/

RUN rm /etc/nginx/conf.d/default.conf
