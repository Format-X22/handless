const core = require('griboyedov');
const logger = core.Logger;
const BasicService = core.service.Basic;
// TODO -

class Strategy extends BasicService {
    constructor(Stock) {
        super();

        this._stock = new Stock();
    }

    async start({ type, current, step, amount }) {
        this._type = type;
        this._current = current;
        this._step = step;
        this._amount = amount;
        // TODO -
    }

    async stop() {
        // TODO -
    }
}

module.exports = Strategy;
