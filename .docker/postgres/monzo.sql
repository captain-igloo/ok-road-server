CREATE TABLE "user" (
    id serial NOT NULL PRIMARY KEY,
    email character varying NOT NULL UNIQUE,
    password character varying NOT NULL,
    roles json NOT NULL
);

CREATE TABLE device (
    id serial NOT NULL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES "user"(id),
    mac_address character varying NOT NULL
);

CREATE TABLE location (
    id serial NOT NULL PRIMARY KEY,
    device_id integer NOT NULL REFERENCES device(id),
    accuracy double precision NOT NULL,
    speed double precision NOT NULL,
    time timestamp with time zone NOT NULL,
    location geometry(Point, 4326) NOT NULL
);

CREATE TABLE camera (
    id serial NOT NULL PRIMARY KEY,
    description character varying NOT NULL,
    location geometry(Point, 4326) NOT NULL
);

INSERT INTO camera (description, location) values ('Ngauranga', ST_GeomFromText('POINT(174.807175 -41.234226)', 4326)); 

CREATE TABLE speed_limit (
    id serial NOT NULL PRIMARY KEY,
    speed_limit integer NOT NULL,
    description character varying NOT NULL,
    area geometry(Polygon, 4326) NOT NULL,
    area_simplified geometry(Polygon, 4326) NOT NULL
);

CREATE INDEX speed_limit_area_idx on speed_limit using gist(area);

update speed_limit set area_simplified = st_simplify(area, 0.001);

CREATE TABLE log (
    id serial NOT NULL PRIMARY KEY,
    insert_datetime timestamp with time zone,
    location geometry(Point, 4326) NOT NULL
);

juYh37n36behyTW6I9bbV
