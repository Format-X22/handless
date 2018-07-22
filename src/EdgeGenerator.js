const core = require('griboyedov');
const logger = core.Logger;

class EdgeGenerator {
    constructor(indent) {
        indent = +indent;

        if (isNaN(indent)) {
            logger.error('Invalid edge indent!');
            process.exit(1);
        }

        this._indent = indent;
    }

    edgeMaxValue() {
        // TODO -
    }

    edgeMinValue() {
        // TODO -
    }
}

module.exports = EdgeGenerator;
