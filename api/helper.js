const Session = require('../account/session');
const AccountTable = require('../account/table');
const { hash } = require('../account/helper');

const setSession = ({ username, res, sessionId}) => {
    return new Promise((resolve, reject) => {
        const session = new Session({ username });

        AccountTable.updateSessionId({
            sessionId: session.id,
            username
        })
            .then(() => {
                // setSessionCookie({ sessionString, res});

                resolve({ message: 'session created ', sessionId: session.id});
            })
            .catch(error => reject('err', error));
    })
 }

// Because of heroku problems with setting cookies it will be stored in local storage
 const setSessionCookie = ({ sessionString, res}) => {
     res.cookie('sessionString', sessionString, {
         expire: Date.now() + 3600000,
         httpOnly: true
         // secure: true // use with https
     });
}

const authenticatedAccount = ({ sessionId }) => {
    return new Promise((resolve, reject) => {
        AccountTable.getAccountBySessionId(sessionId)
            .then(({ account }) => {
                console.log('authenticatedAccount', account);

                if (typeof account === 'undefined') {
                    console.log('ERROR - authenticatedAccount');
                    const error = {};
                    error.statusCode = 409;

                    return reject('err', error);
                }

                resolve({ account, authenticated: true, username: account.username });
            })
            .catch(error => {
                console.log('ERROR - authenticatedAccount', error);
                reject('err', error);
            });
    })
}

 module.exports = { setSession, authenticatedAccount  } ;