const pool = require('../databasePool');
const { STARTING_BALANCE } = require('../config');
const { hash } = require('../account/helper');

class AccountTable {
    static storeAccount({ usernameHash, passwordHash }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO account("usernameHash", "passwordHash", balance) VALUES($1, $2, $3)',
                [usernameHash, passwordHash, STARTING_BALANCE],
                (err, res) => {
                    console.log('##### STORE ACCOUNT ####', err)

                    if (err) return reject('err', err);

                    resolve();
                }
            );
        });
    }

    static getAccount({ usernameHash }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT id, "passwordHash", "sessionId", balance FROM account WHERE "usernameHash" = $1',
                [usernameHash],
                (err, res) => {
                    if (err) return reject('err', err);

                    resolve({ account: res.rows[0] });
                }
            );
        });
    }

    static updateSessionId({ sessionId, usernameHash }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'UPDATE account SET "sessionId" = $1 WHERE "usernameHash" = $2',
                [sessionId, usernameHash],
                (err, res) => {
                    if (err) return reject('err', err);

                    resolve();
                }
            );
        });
    }

    static updateBalance({ accountId, value }) {
        return new Promise(((resolve, reject) => {
            pool.query(
                'UPDATE account SET balance = balance + $1 WHERE id = $2',
                [value, accountId],
                (err, res) => {
                    if (err) return reject(err);

                    resolve();
                }
            )
        }))
    }
}
//
// for (let i=0; i < 4; i++) {
//     setTimeout(() => {
//         const params = {usernameHash: hash('aneta'), passwordHash: hash('aneta')};
//
//         AccountTable.storeAccount(params)
//             .then(({accountId}) => console.log('getDragonAccount: accountId', accountId))
//             .catch(error => console.error('getDragonAccount: error', error))
//     }, 0)
// }

module.exports = AccountTable;