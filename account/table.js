const pool = require('../databasePool');
const { STARTING_BALANCE } = require('../config');
const { hash } = require('../account/helper');

class AccountTable {
    static storeAccount({ username, passwordHash }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO account("username", "passwordHash", balance) VALUES($1, $2, $3)',
                [username, passwordHash, STARTING_BALANCE],
                (err, res) => {
                    console.log('##### STORE ACCOUNT ####', err)

                    if (err) return reject('err', err);

                    resolve();
                }
            );
        });
    }

    static getAccount({ username }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT id, "passwordHash", "sessionId", balance FROM account WHERE "username" = $1',
                [username],
                (err, res) => {
                    if (err) return reject('err', err);

                    resolve({ account: res.rows[0] });
                }
            );
        });
    }

    static getAccountBySessionId(sessionId) {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT id, username, "passwordHash", "sessionId", balance FROM account WHERE "sessionId" = $1',
                [sessionId],
                (err, res) => {
                    console.log('asdfasdf', err, res)
                    if (err) return reject('err', err);

                    resolve({ account: res.rows[0] });
                }
            );
        });
    }

    static updateSessionId({ sessionId, username }) {
        return new Promise((resolve, reject) => {
            pool.query(
                'UPDATE account SET "sessionId" = $1 WHERE "username" = $2',
                [sessionId, username],
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

module.exports = AccountTable;