const { Router } = require('express');
const AccountTable = require('../account/table');
const AccountDragonTable = require('../accountDragon/table');
const { hash } = require('../account/helper');
const Session =  require('../account/session');
const { setSession, authenticatedAccount } = require('../api/helper');
const { getDragonWithTraits } = require('../dragon/helper');

const router = new Router();

router.get('/test', (req, res) => {
    res.json({message: 'ok'})
});

/*
* Passwords must be
* - At least 5 characters long, max length anything
* - Include at least 1 lowercase letter
* - 1 capital letter
* - 1 number
* - 1 special character => !@#$%^&*
*/
const isPassValid = (pass) => {
    return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{5,}$/.test(pass)
}

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    const usernameHash = hash(username);
    const passwordHash = hash(password);

    const errors = [];
    if (username.length < 5) {
        errors.push('ACCOUNT_TOO_SHORT_USER_NAME');
    }

    if (!isPassValid(password)) {
        errors.push('IS_NOT_PASSWORD');
    }

    if (errors.length > 0) {
        return res.status(409).json({
            type: 'error', message: 'VALIDATION_ERRORS', errors
        });
    }

    setTimeout(() => {
        AccountTable.getAccount({ usernameHash })
            .then(({ account }) => {
                if (!account) {
                    return AccountTable.storeAccount({ usernameHash, passwordHash })
                } else {
                    errors.push('ACCOUNT_USER_ALREADY_EXISTS');
                }

                return res.status(409).json({
                    type: 'error', message: 'VALIDATION_ERRORS', errors
                })

            })
            .then(() => {
                return setSession({ username, res });
            })
            .then(({ message }) => {
                res.json({ message: 'success!' });
            })
            .catch(next);
    }, 2000);
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    AccountTable.getAccount({ usernameHash: hash(username) })
        .then(({ account }) => {
            if (account && account.passwordHash === hash(password)) {
                const { sessionId } = account;

                return setSession({ username, res, sessionId })
            } else {

                return res.status(409).json({
                    type: 'error',
                    message: 'USERNAME_OR_PASS_INCORRECT',
                    errors:['USERNAME_OR_PASS_INCORRECT']
                })
            }
        })
        .then(({ message }) => res.json({ message }))
        .catch(next);
});

router.get('/logout', (req, res, next) => {
    const { username } = Session.parse(req.cookies.sessionString);

   AccountTable.updateSessionId({
       sessionId: null,
       usernameHash: hash(username)
   })
       .then(() => {
           res.clearCookie('sessionString');

           res.json({ message: 'Successful logout' })
       })
       .catch(next);
});

router.get('/authenticated', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ authenticated }) => res.json({ authenticated }))
        .catch(error => next(error))
});

router.get('/dragons', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ account }) => {
            console.log('### account ####', account)

            return AccountDragonTable.getAccountDragons({
                accountId: account.id
            });
        })
        .then(({ accountDragons }) => {
            console.log('### accountDragons ####', accountDragons)

            return Promise.all(
                accountDragons.map(accountDragon => {
                    return getDragonWithTraits({ dragonId: accountDragon.dragonId });
                })
            );
        })
        .then(dragons => {
            res.json({ dragons });
        })
        .catch(error => next(error));
});

router.get('/info', (req, res, next) => {
    authenticatedAccount({ sessionString: req.cookies.sessionString })
        .then(({ account, username }) => {
            res.json({ info: { balance: account.balance, username }})
        })
        .catch(error => next(error));
});

module.exports = router;