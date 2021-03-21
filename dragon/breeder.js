const Dragon = require('./index');
const base64 = require('base-64');

class Breeder {
    static breedDragon({ matron, patron }) {
        const matronTraits = matron.traits;
        const patronTraits = patron.traits;

        const babyTraits = [];

        matronTraits.forEach(({ traitType, traitValue }) => {
            const matronTrait = traitValue;

            const patronTrait = patronTraits.find(
                trait => trait.traitType === traitType
            ).traitValue;

            babyTraits.push({
                traitType,
                traitValue: Breeder.pickTrait({ traitType, matronTrait, patronTrait })
            });
         });

        return new Dragon({
            nickname: 'Unnamed baby dragon',
            traits: babyTraits
        })
    }

    // Two incoming traits: matronTrait and patronTrait
    // The matronTrait and patronTrait string values are encoded
    // Both traits have their character summed
    // Get a range by adding both character sums
    // Generate a random number, in the range
    // If the number is less than the matron's character sum, pick matron
    // Else, pick matron
    static pickTrait({ traitType, matronTrait, patronTrait }) {
        if (matronTrait === patronTrait) return matronTrait;

        // matronTrait => small
        // base64.encode(matronTrait) => sadSD5hasd=
        // Breader.charSum(base64.encode(matronTrait)) => 890
        const martonTraitCharSum = Breeder.charSum(base64.encode(matronTrait));
        const patronTraitCharSum = Breeder.charSum(base64.encode(patronTrait));

        const randNum = Math.floor(Math.random() * (martonTraitCharSum + patronTraitCharSum))

        console.log('###### martonTraitCharSum', Breeder.charSum('00'))


        return randNum < martonTraitCharSum ? matronTrait : patronTrait;
    }

    static charSum(string) {
        return string.split('').reduce(
            (sum, character) => sum + character.charCodeAt(),
            0
        );
    }
}

// const fooby = new Dragon();
// const gooby = new Dragon();
//
// console.log('matron', fooby);
// console.log('patron', gooby);
//
// const foobygooby = Breader.breedDragon({ matron: fooby, patron: gooby })
// console.log('child', foobygooby);


module.exports = Breeder;