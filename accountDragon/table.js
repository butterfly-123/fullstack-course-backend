const pool = require('../databasePool');

class AccountDragonTable {
    static storeAccountDragon({ accountId, dragonId }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO accountDragon("accountId", "dragonId") VALUES($1, $2)',
                [accountId, dragonId],
                (error, res) => {
                    console.log('storeAccountDragon', res, error)
                    if (error) return reject('err', error);

                    resolve();
                }
            )
        });
    }

    static getAccountDragons({ accountId }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT "dragonId" FROM accountDragon WHERE "accountId" = $1',
                [accountId],
                (error, response) => {
                    if (error) return reject(error);

                    resolve({ accountDragons: response.rows });
                }
            )
        })
    }

    static getDragonAccount({ dragonId }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT "accountId" FROM accountDragon WHERE "dragonId" = $1',
                [dragonId],
                (error, response) => {
                    if (error) return reject(error);

                    console.log(response.rows)

                    if (response.rows.length > 0) {
                        resolve({ accountId: response.rows[0].accountId });
                    } else {
                        resolve({ accountId: null });
                    }
                }
            )
        });
    }

    static updateAccountDragon({ dragonId, accountId }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'UPDATE accountDragon SET "accountId" = $1 WHERE "dragonId" = $2',
                [accountId, dragonId],
                (error, response) => {
                    console.log(response)

                    if (error) return reject(error);

                    resolve();
                }
            )
        });
    }
}
//
// setTimeout(() => {
//     AccountDragonTable.getDragonAccount({ dragonId: 2 })
//         .then(({ accountId }) => console.log('getDragonAccount: accountId', accountId))
//         .catch(error => console.error('getDragonAccount: error', error))
// }, 3000)
//
//
// setTimeout(() => {
//     AccountDragonTable.getDragonAccount({dragonId: 2})
//         .then((result) => {
//             if (result.accountId === null) {
//                 AccountDragonTable.storeAccountDragon({ dragonId: 2, accountId: 3 })
//                     .then(() => console.log('success: updateAccountDragon'))
//                     .catch(error => console.error('error: updateAccountDragon', error))
//             }
//         });
// }, 2000)
//
// const v = 2;

module.exports = AccountDragonTable;