const request = require('request-promise-native');
const moment = require('moment');
const sleep = require('then-sleep');
const core = require('griboyedov');
const logger = core.Logger;

const MAX_ERRORS = 750;
const RETRY_TIME = 5000;

class Candles {
    constructor() {
        this._requestErrors = 0;
    }

    async getCandles() {
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

            return await this.getCandles();
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
        return {
            uri: 'https://www.bitmex.com/api/udf/history',
            qs: {
                symbol: 'XBTUSD',
                from: +moment().subtract(90, 'minutes') / 1000,
                to: +moment() / 1000,
                resolution: 1,
            },
            json: true,
        };
    }
}

module.exports = Candles;
