const sleep = require('then-sleep');

const ITERATIONS_INDENT = 3000;

class Strategy {
    constructor(edgeGenerator, candleState, stock) {
        this._edgeGenerator = edgeGenerator;
        this._candleState = candleState;
        this._stock = stock;
        this._direction = null;
    }

    async run(options) {
        await this._restoreState(options);

        while (true) {
            await this._sync();
            await this._iterate();
            await sleep(ITERATIONS_INDENT);
        }
    }

    async _restoreState(options) {
        // TODO -
    }

    async _sync() {
        await this._candleState.sync();
    }

    async _iterate() {
        const maxEdge = this._getMaxEdge();
        const minEdge = this._getMinEdge();

        if (await this._isFlip()) {
            this._flipDirection();
            await this._iterate();
            return;
        }

        if (this._directionIsUp()) {
            if (this._getMaxPrice() >= maxEdge) {
                await this._moveUp();
            }
        } else {
            if (this._getMinPrice() <= minEdge) {
                await this._moveDown();
            }
        }
    }

    _getMaxEdge() {
        return this._edgeGenerator.edgeMaxValue();
    }

    _getMinEdge() {
        return this._edgeGenerator.edgeMinValue();
    }

    async _isFlip() {
        return await this._stock.isFlip();
    }

    _flipDirection() {
        if (this._direction === 'up') {
            this._direction = 'down';
        } else {
            this._direction = 'up';
        }
    }

    _directionIsUp() {
        return this._direction === 'up';
    }

    _getMaxPrice() {
        return this._candleState.getLastMaxPrice();
    }

    _getMinPrice() {
        return this._candleState.getLastMinPrice();
    }

    async _moveUp() {
        this._calcCurrentEdge();
        await this._stock.move(this._edgeGenerator.edgeMinValue());
    }

    async _moveDown() {
        this._calcCurrentEdge();
        await this._stock.move(this._edgeGenerator.edgeMaxValue());
    }

    _calcCurrentEdge() {
        // TODO -
    }
}
