const request = require('request-promise-native');
const moment = require('moment');
const sleep = require('then-sleep');
const core = require('griboyedov');
const logger = core.Logger;

const MAX_ERRORS = 750;
const RETRY_TIME = 5000;
const LAST_MINUTES = 90;

class CandleState {
    constructor() {
        this._requestErrors = 0;
    }

    async sync() {
        // TODO -
    }

    getLastMaxPrice() {
        // TODO -
    }

    getLastMinPrice() {
        // TODO -
    }

    async _getCandles() {
        let response;
        let result;

        try {
            response = await request(this._makeCandlesRequestConfig());

            if (!response['t']) {
                throw 'Bad candles data';
            }

            result = this._convertCandlesToObject(response);
        } catch (err) {
            logger.error(`Fail to load candles, sleep and retry... ${err}`);
            await sleep(RETRY_TIME);

            this._requestErrors++;

            if (this._requestErrors === MAX_ERRORS) {
                logger.error(`Fail to load candles ${MAX_ERRORS} times, exit.`);
                process.exit(1);
            }

            return await this._getCandles();
        }

        return result;
    }

    _convertCandlesToObject(raw) {
        const result = {};

        for (let i = 0; i < raw['t'].length; i++) {
            result[raw['t'][i]] = [raw['t'][i], raw['o'][i], raw['h'][i], raw['l'][i], raw['c'][i]];
        }

        return result;
    }

    _makeCandlesRequestConfig() {
        const now = moment();

        return {
            uri: 'https://www.bitmex.com/api/udf/history',
            qs: {
                symbol: 'XBTUSD',
                from: this._seconds(now.subtract(LAST_MINUTES, 'minutes')),
                to: this._seconds(now),
                resolution: 1,
            },
            json: true,
        };
    }

    _seconds(ms) {
        return +ms / 100;
    }
}

module.exports = CandleState;
