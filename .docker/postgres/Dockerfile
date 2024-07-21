FROM postgis/postgis:16-3.4

COPY .docker/postgres/init.sh /docker-entrypoint-initdb.d/
COPY .docker/postgres/okroad.sql /tmp/
