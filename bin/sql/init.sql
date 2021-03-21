CREATE DATABASE dragon;

DROP TABLE IF EXISTS generation;
DROP TABLE IF EXISTS dragon;

CREATE TABLE generation(
    id         SERIAL PRIMARY KEY,
    expiration TIMESTAMP NOT NULL
);

CREATE TABLE dragon(
    id SERIAL                    PRIMARY KEY,
    expiration                   TIMESTAMP NOT NULL,
    nickname                     VARCHAR(64),
    "generationId"               INTEGER,
    FOREIGN KEY ("generationId") REFERENCES generation(id)
);

CREATE TABLE trait {
    id SERIAL    PRIMARY KEY,
    "traitType"  VARCHAR NOT NULL,
    "traitValue" VARCHAR NOT NULL
};

DROP TABLE trait;

CREATE TABLE trait(
    id         SERIAL PRIMARY KEY,
    "traitType"  VARCHAR NOT NULL,
    "traitValue" VARCHAR NOT NULL
);