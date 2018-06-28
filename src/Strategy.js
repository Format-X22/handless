const Bitmex = require('./Bitmex');

class Strategy {
    constructor({ type, current, step, amount }) {
        this._type = type;
        this._current = current;
        this._step = step;
        this._amount = amount;
        this._bitmex = new Bitmex();
        this._state = 'Init';
        this._enterOrderId = null;
    }

    async start() {
        this._enterOrderId = await this._bitmex[this._type](
            this._current,
            this._amount
        );
        this._state = 'WaitPosition';

        await this._loop();
    }

    async _loop() {
        switch (this._state) {
            case 'WaitPosition':
                await this._handleWaitPosition();
                break;
            case 'ActivePosition':
                await this._handleActivePosition();
                break;
            case 'WaitTake':
                await this._handleWaitTake();
                break;
        }

        setTimeout(this._loop.bind(this), 2000);
    }

    async _handleWaitPosition() {
        if (await this._isPositionGet()) {
            // TODO -
            this._state = 'ActivePosition';
        } else {
            // TODO -
        }
    }

    async _handleActivePosition() {
        // TODO -
    }

    async _handleWaitTake() {
        // TODO -
    }

    async _isPositionGet() {
        const orders = this._bitmex.orders();

        // TODO -
    }
}

module.exports = Strategy;
