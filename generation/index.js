const Dragon = require('../dragon/index');
const { REFRESH_RATE, SECONDS } = require('../config');

const refreshRate = REFRESH_RATE * SECONDS;

class Generation {
    constructor() {
        this.expiration = this.calculateExploration();
        this.generationId = undefined;
    }

    calculateExploration() {
        this.expiration = null;

        const explorationPeriod = Math.floor(Math.random() * (refreshRate/2));

        const msUntilExploration = Math.random() < 0.5 ?
            refreshRate - explorationPeriod :
            refreshRate + explorationPeriod;

        return new Date(Date.now() + msUntilExploration);
    }

    newDragon() {
        if (Date.now() > this.expiration) {
            throw new Error(`This exploration expired on ${this.expiration}`);
        }

        //dragonId, birthdate, nickname, traits, generationId

        return new Dragon({});
    }
}

module.exports = Generation;