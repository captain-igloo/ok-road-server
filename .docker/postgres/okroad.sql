
CREATE TABLE "user" (
    id serial NOT NULL PRIMARY KEY,
    username character varying NOT NULL UNIQUE,
    email character varying NOT NULL UNIQUE,
    full_name character varying NOT NULL,
    password character varying NOT NULL,
    roles json NOT NULL
);

CREATE TABLE device (
    id serial NOT NULL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES "user"(id),
    name character varying NOT NULL,
    description character varying
);

CREATE TABLE speed_limit (
    id serial NOT NULL PRIMARY KEY,
    speed_limit integer NOT NULL,
    description character varying NOT NULL,
    area Geometry(MultiPolygon, 4326) NOT NULL
);

CREATE INDEX speed_limit_area_idx ON speed_limit USING gist(area);

CREATE TABLE location (
    id serial NOT NULL PRIMARY KEY,
    device_id integer NOT NULL REFERENCES device(id),
    speed_limit_id integer,
    timestamp timestamp NOT NULL,
    location Geometry(Point, 4326) NOT NULL,
    accuracy integer,
    speed integer
);
