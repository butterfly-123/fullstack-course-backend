const { Pool } = require('pg');

const config = {
    user: 'postgres',
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    database: 'dragon',
    port: 5432
};

console.log(config);

const pool = new Pool(config);

// const query = `
//         SELECT * FROM dragon
//     `;
//
// pool.query(query, (err, res) => {
//         if (err) return console.log('ERRROROOROROR', err);
//
//         console.log('ok', {
//             foundRow: res.rowCount,
//             rows: res.rows
//         })
//     }
// );

module.exports = pool;
