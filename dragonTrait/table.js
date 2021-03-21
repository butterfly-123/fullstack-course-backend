const pool = require('../databasePool');
const TraitTable = require('../trait/table');

class DragonTraitTable {
    static storeDragonTrait({ dragonId, traitType, traitValue }) {

        return new Promise((resolve, reject) => {
            TraitTable.getTraitId({ traitType, traitValue })
                .then(({ traitId }) => {
                    console.log(traitId)

                    pool.query(
                        `INSERT INTO dragonTrait("traitId", "dragonId") VALUES($1, $2)`,
                        [traitId, dragonId],
                        (err, res) => {
                            if (err) return reject('err', err);

                            resolve();
                        }
                    )
                })
        });
    }
}

module.exports = DragonTraitTable;