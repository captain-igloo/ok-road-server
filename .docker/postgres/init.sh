#!/bin/sh

psql -U postgres -c "CREATE ROLE okroad WITH PASSWORD 'okroad' LOGIN"
psql -U postgres -c "CREATE DATABASE okroad WITH OWNER okroad"
psql -U postgres -d okroad -c "CREATE EXTENSION postgis"
psql -U okroad -d okroad < "/tmp/okroad.sql"

psql -U postgres -c "CREATE DATABASE okroad_test WITH OWNER okroad"
psql -U postgres -d okroad_test -c "CREATE EXTENSION postgis"
psql -U okroad -d okroad < "/tmp/okroad.sql"
