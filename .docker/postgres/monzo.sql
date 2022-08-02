CREATE TABLE "user" (
    id serial NOT NULL PRIMARY KEY,
    email character varying NOT NULL,
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
