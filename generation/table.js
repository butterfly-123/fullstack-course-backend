const pool = require('../databasePool');

class GenerationTable {
    static storeGeneration(generation) {

        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO generation(expiration) VALUES($1) RETURNING id',
                [generation.expiration],
                (err, res) => {
                    if (err) return reject('err', err);

                    const generationId = res.rows[0];

                    resolve({ generationId });

                    return generationId;
                }
            );
        });

    }
}

module.exports = GenerationTable;