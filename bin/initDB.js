const pool = require('../databasePool');
const insertTraits = require('./insertTraits');

const sql = `
    DROP TABLE IF EXISTS dragonTrait CASCADE;
    DROP TABLE IF EXISTS generation CASCADE;
    DROP TABLE IF EXISTS dragon CASCADE;
    DROP TABLE IF EXISTS trait CASCADE;
    DROP TABLE IF EXISTS account CASCADE;
    DROP TABLE IF EXISTS accountDragon CASCADE;


    CREATE TABLE trait(
        id           SERIAL PRIMARY KEY,
        "traitType"  VARCHAR NOT NULL,
        "traitValue" VARCHAR NOT NULL
    );
    
    CREATE TABLE generation(
        id         SERIAL PRIMARY KEY,
        expiration TIMESTAMP NOT NULL
    );
    
    
    CREATE TABLE dragon(
        id SERIAL                    PRIMARY KEY,
        birthdate                    TIMESTAMP NOT NULL,
        nickname                     VARCHAR(64),
        "isPublic"                   BOOLEAN NOT NULL,
        "saleValue"                  INTEGER NOT NULL,
        "sireValue"                  INTEGER NOT NULL,
        "generationId"               INTEGER,
        FOREIGN KEY ("generationId") REFERENCES generation(id)
    );
    
    CREATE TABLE dragonTrait (
        "traitId"                INTEGER,
        "dragonId"               INTEGER,
        FOREIGN KEY ("traitId")  REFERENCES trait(id),
        FOREIGN KEY ("dragonId") REFERENCES dragon(id)
    );
    
     CREATE TABLE account(
        id SERIAL      PRIMARY KEY,
        "usernameHash" CHARACTER(64),
        "passwordHash" CHARACTER(64),
        "sessionId"    CHARACTER(36),
        balance        INTEGER NOT NULL
    );
    
    CREATE TABLE accountDragon(
        "accountId"     INTEGER REFERENCES account(id),
        "dragonId"      INTEGER REFERENCES dragon(id),
        PRIMARY KEY     ("accountId", "dragonId")
    );
    
    INSERT INTO trait (id, "traitType", "traitValue") 
    VALUES
    (1,'backgroundColor', 'black'),
    (2,'backgroundColor','white'),
    (3,'backgroundColor','orange'),
    (4,'backgroundColor','pink'),
    (5,'pattern','plain'),
    (6,'pattern','striped'),
    (7,'pattern','spotted'),
    (8,'pattern','patchy'),
    (9,'built','slender'),
    (10,'built','stocky'),
    (11,'built','sporty'),
    (12,'built','skinny'),
    (13,'size','small'),
    (14,'size','big'),
    (15,'size','medium'),
    (16,'size','large');
`

pool.query(
    sql,
    (err, res) => {
        if (err) console.log(err);

        console.log('Success');
    }
)

