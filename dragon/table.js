const pool = require('../databasePool');

const Dragon  = require('./index');

const DragonTraitTable  = require('./../dragonTrait/table');

class DragonTable {
    static storeDragon(dragon) {
        const { birthdate, nickname, generationId, isPublic, saleValue, sireValue } = dragon;
        console.log('############## generationId', generationId)

        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO dragon(birthdate, nickname, "generationId", "isPublic", "saleValue", "sireValue") VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
                [birthdate, nickname, generationId, isPublic, saleValue, sireValue],
                (err, res) => {
                    if (err) return reject(err);

                    const dragonId = res.rows[0].id;

                    Promise.all(dragon.traits.map(({ traitType, traitValue }) => {
                        return DragonTraitTable.storeDragonTrait({
                            dragonId, traitType, traitValue
                        });
                    }))
                        .then(() => resolve({ dragonId }))
                        .catch(err => reject('err', err));
                }
            );
        });
    }

     static getDragon({ dragonId }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT birthdate, nickname, "generationId", "isPublic", "saleValue", "sireValue" FROM dragon WHERE dragon.id = $1`,
                [dragonId],
                (err, res) => {
                    if (err) return reject(err);

                    if (res.rows.length === 0) return reject(new Error('no dragon'));

                    resolve(res.rows[0]);
                }
            )
        });
     }

    static updateDragon({ dragonId, nickname, isPublic, saleValue, sireValue }) {
        const settingMap = { nickname, isPublic, saleValue, sireValue  };

        const validQueries = Object.entries(settingMap).filter(([settingKey, settingValue]) => {
            console.log('settingKey', settingKey, 'settingValue', settingValue)

            if (settingValue !== undefined) {
                return new Promise((resolve, reject) => {
                    pool.query(
                        `UPDATE dragon SET "${settingKey}" = $1 WHERE id = $2`,
                        [settingValue, dragonId],
                        (err, res) => {
                            if (err) return reject(err)

                            resolve();
                        }
                    )
                })
            }
        })

        return Promise.all(validQueries);
    }
}


for (let i=0; i < 4; i++) {
    setTimeout(() => {
        const dragon = new Dragon({});
        DragonTable.storeDragon(dragon)
            .then(() => console.log('successfully update dragon'))
            .catch(error => console.error(error))
    }, 1000)
}

module.exports = DragonTable;