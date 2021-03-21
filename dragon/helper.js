const pool = require('../databasePool');
const DragonTable = require('./table');
const Dragon = require('./index');

const getDragonWithTraits = ({ dragonId }) => {
    const fetchTraitsPromise = new Promise((resolve, reject) => {
        pool.query(
            `
                SELECT "traitType", "traitValue" FROM trait 
                INNER JOIN dragonTrait ON trait.id = dragonTrait."traitId" 
                WHERE dragonTrait."dragonId" = $1
            `,
            [dragonId],
            (err, res) => {
                if (err) return reject('err', err);

                resolve(res.rows);
            }
        )
    });
    const fetchDragonPromise = DragonTable.getDragon({ dragonId });

    return Promise.all([
        fetchDragonPromise,
        fetchTraitsPromise
    ]).then(([dragon, dragonTrait]) => {
        const dragonTmp = {...dragon, traits: dragonTrait, dragonId}

        return new Dragon(dragonTmp)
    }).catch(err => console.log('err', err));
};

const getPublicDragons = () => {
    return new Promise(((resolve, reject) => {
        pool.query(
            `SELECT id FROM dragon WHERE "isPublic" = TRUE`,
            (err, res) => {
                if (err) return reject(err)

                const publicDragonRows = res.rows;

                Promise.all(
                    publicDragonRows.map(
                        ({ id }) => getDragonWithTraits({ dragonId: id })
                    )
                )
                    .then(dragons => resolve({ dragons }))
                    .catch(error => reject(error))
            }
        )
    }))
}

module.exports = { getDragonWithTraits, getPublicDragons };