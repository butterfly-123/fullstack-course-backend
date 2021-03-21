const Generation = require('../generation/index');
const GenerationTable  = require('../generation/table');

class GenerationEngine {
    constructor(props) {
        this.generation = null;
        this.timer = null;
    }

    start() {
        this.builtNewGeneration();
    }

    stop() {
        clearTimeout(this.timer);
    }

    builtNewGeneration() {
        const generation = new Generation();

        const promise = GenerationTable.storeGeneration(generation)

        promise
            .then(({ generationId }) => {
                this.generation = generation;
                this.generation.generationId = generationId;

                console.log('new generation', this.generation);

                if (this.timer) clearTimeout(this.timer);

                this.timer =  setTimeout(
                    () =>
                        this.builtNewGeneration(),
                    this.generation.expiration.getTime() - Date.now()
                );
            })
            .catch(err => console.log('err', err));
    }
}

module.exports = GenerationEngine;