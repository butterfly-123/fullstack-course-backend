const { Pool } = require('pg');

//DATABASE_URL
let config = {};

if (process.env.DATABASE_URL) {
    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };
} else {
     config = {
        user: 'postgres',
        password: process.env.PASSWORD,
        host: process.env.DB_HOST,
        database: 'dragon',
        port: 5432
    };
}

console.log('INIT DB', process.env, config);

const pool = new Pool(config);

module.exports = pool;
