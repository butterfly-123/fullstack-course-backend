const { Router } = require('express');
const DragonTable = require('../dragon/table');
const AccountDragonTable = require('../accountDragon/table');
const AccountTable = require('../account/table');
const Breeder = require('../dragon/breeder');
const { authenticatedAccount } = require('./helper');
const { getPublicDragons, getDragonWithTraits } = require('../dragon/helper');

const router = new Router();

router.get('/new', (req, res, next) => {
    let accountId, dragon;

    console.log('req.headers.authorization', req.headers.authorization);

    authenticatedAccount({ sessionId: req.headers.authorization })
        .then(({ account }) => {
            accountId = account.id;

            console.log('ACCOUNT', account);
            dragon = req.app.locals.engine.generation.newDragon({ accountId });
            console.log('DRAGON', dragon);

            return DragonTable.storeDragon(dragon);
        })
        .then(({ dragonId }) => {
            dragon.dragonId = dragonId;
            console.log('resolved dragonId', dragonId);

            return AccountDragonTable.storeAccountDragon({ accountId, dragonId });
        })
        .then(() => res.json({ dragon }))
        .catch(error => {
            console.log(error)


            next(error)

        });
});

router.put('/update', (req, res, next) => {
    const { dragonId, nickname, isPublic, saleValue, sireValue } = req.body;

    DragonTable.updateDragon({ dragonId, nickname, isPublic, saleValue, sireValue  })
        .then(() => res.json({
            message: 'successfully update dragon',
            dragon: {
                dragonId,
                nickname,
                isPublic,
                saleValue,
                sireValue
            }
        }))
        .catch(error => next(error ))
});

router.get('/public-dragons', (req, res, next) => {
    getPublicDragons()
        .then(({ dragons }) => res.json({ dragons }))
        .catch(error => next(error));
});

/**
 Exercise:
 * 1. Fetch dragon by dagonID
 * 2. Fetch account connected to this dragon(seller)
 * 3. Fetch account of the current user(buyer)
 * 4. Attach dragon to buyer account
 *  -> seller account add dragon price
 *  -> from buyer account subtract dragon price
 */


router.post('/buy', (req, res, next) => {
    const { dragonId, saleValue } = req.body;
    let buyerId;

    DragonTable.getDragon({ dragonId })

        .then(dragon => {
            if (dragon.saleValue !== saleValue) {
                throw new Error('Sale value is not correct')
            }

            if (!dragon.isPublic) {
                console.log('################## dragon.isPublic', dragon.isPublic)
                throw new Error('Dragon must be public')
            }

            return authenticatedAccount({ sessionString: req.cookies.sessionString });
        })
        .then(({ account, authenticated }) => {
            if (!authenticated) {
                throw new Error('Unauthenticated')
            }

            if (saleValue > account.balance) {
                console.log('############ account.balance', account.balance)
                throw new Error('Sale value exceeds balance')
            }

            buyerId = account.id;

            return AccountDragonTable.getDragonAccount({ dragonId });
        })
        .then(({ accountId }) => {
            if (accountId === buyerId) {
                throw new Error('Cannot buy your own dragon!')
            }

            const sellerId = accountId;

            return Promise.all([
                AccountTable.updateBalance({
                    accountId: buyerId, value: -saleValue
                }),
                AccountTable.updateBalance({
                    accountId: sellerId, value: saleValue
                }),
                AccountDragonTable.updateAccountDragon({
                    dragonId, accountId: buyerId
                }),
                DragonTable.updateDragon({
                    dragonId, isPublic: false
                }),
            ])
        })
        .then(() => res.json({ message: 'success' }))
        .catch(error => next(error))
});

router.post('/mate', async (req, res, next) => {
    const { matronDragonId, patronDragonId } = req.body;
    console.log()

    if (matronDragonId === patronDragonId) {
        return res.json({ error: 'Cannot breed with the same dragon!'})
    }

    let matronDragon, patronDragon, patronSireValue;
    let matronAccountId, patronAccountId;

    let dragon = await getDragonWithTraits({ dragonId: patronDragonId });
    if (!dragon.isPublic) {
        return res.json({ error: 'Dragon must be public'})
    }

    patronDragon = dragon;
    patronSireValue = dragon.sireValue;
    console.log('##patronDragon', patronDragon);

    dragon = await getDragonWithTraits({ dragonId: matronDragonId })
    matronDragon = dragon;
    console.log('##matronDragon', matronDragon);

    const { account, authenticated } = await authenticatedAccount({ sessionString: req.cookies.sessionString });
    console.log('##account', account);

    if (!authenticated) {
        return res.json({ error: 'Unauthenticated'})
    }

    if (patronSireValue > account.balance) {
        return res.json({ error: 'Sire value exceeds balance'})
    }

    matronAccountId = account.id;

    const { accountId } = await AccountDragonTable.getDragonAccount({ dragonId: patronDragonId })
    patronAccountId = accountId;
    console.log('##getDragonAccount', matronAccountId, patronAccountId);

    if (matronAccountId === patronAccountId) {
        return res.json({ error: 'Cannot breed your own dragons!'})
    }

    dragon = await Breeder.breedDragon({ matron: matronDragon, patron: patronDragon })

    console.log('##breedDragon', dragon);


    const { dragonId } = await DragonTable.storeDragon(dragon);

    await AccountTable.updateBalance({
        accountId: matronAccountId,
        value: -patronSireValue
    })

    await AccountTable.updateBalance({
        accountId: patronAccountId,
        value: patronSireValue
    })

    await AccountDragonTable.storeAccountDragon({
        dragonId, accountId: matronAccountId
    })

    res.json({ message: 'success!'})
});

module.exports = router;