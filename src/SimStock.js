class SimStock {
    constructor(publicKey, privateKey) {
        this._requestErrors = 0;
        this._publicKey = publicKey;
        this._privateKey = privateKey;
    }

    async makeOrder(type, price, amount) {
        // TODO -
    }

    async moveOrder(id, price, amount) {
        // TODO -
    }
}

module.exports = SimStock;
