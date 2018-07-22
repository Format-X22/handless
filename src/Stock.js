const request = require('request-promise-native');
const moment = require('moment');
const sleep = require('then-sleep');
const core = require('griboyedov');
const logger = core.Logger;

const MAX_ERRORS = 750;
const RETRY_TIME = 5000;

class Stock {
    constructor(publicKey, privateKey) {
        this._requestErrors = 0;
        this._publicKey = publicKey;
        this._privateKey = privateKey;
    }

    async makeOrder(type, price, amount) {
        // TODO -
    }

    async move(price) {
        // TODO -
    }

    async isFlip() {
        // TODO -
    }
}

module.exports = Stock;
