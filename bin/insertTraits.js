const pool = require('../databasePool');
const TRAITS = require('../data/traits.json');


async function addTrait(traitType, traitValue) {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO trait("traitType", "traitValue")
                   VALUES($1, $2)
                   RETURNING id`,
            [traitType, traitValue],
            (error, response) => {
                console.log(error, response)

                if (error) reject(error);


                const traitId = response.rows[0].id;
                resolve(traitId);
            }
        );
    })
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

async function insertTraits () {
    const traits = [];

    TRAITS.forEach(TRAIT => {
        const traitType = TRAIT.type;
        const traitValues = TRAIT.values;

        traitValues.forEach(traitValue => {
            traits.push({traitType, traitValue})
        });
    });

    await asyncForEach(traits, async (trait) => {
        const id = await addTrait(trait.traitType, trait.traitValue);

        console.log(id);
    })

}

module.exports = insertTraits;