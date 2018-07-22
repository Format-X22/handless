const crypto = require('crypto');
const request = require('request-promise-native');
const moment = require('moment');
const sleep = require('then-sleep');
const core = require('griboyedov');
const logger = core.Logger;

const MAX_ERRORS = 750;
const RETRY_TIME = 5000;
const DOMAIN = 'https://www.bitmex.com';
const API_POINT = '/api/v1/';

class Stock {
    constructor(publicKey, privateKey) {
        this._requestErrors = 0;
        this._publicKey = publicKey;
        this._privateKey = privateKey;
        this._positionId = null;
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

    async _getOrder() {
        const method = 'GET';
        const endpoint = 'order';
        const payload = 'filter={"symbol": "XBTUSD", "open": true}';
        const expires = this._makeExpires();
        const sign = this._sign(method, { endpoint, payload, expires });

        const raw = await this._request(
            method,
            this._requestUrl(endpoint, payload),
            this._makeHeaders(sign, expires)
        );

        return JSON.parse(raw)[0];
    }

    async _getPosition() {
        const method = 'GET';
        const endpoint = 'position';
        const payload = 'filter={"symbol": "XBTUSD"}';
        const expires = this._makeExpires();
        const sign = this._sign(method, { endpoint, payload, expires });

        const raw = await this._request(
            method,
            this._requestUrl(endpoint, payload),
            this._makeHeaders(sign, expires)
        );

        return JSON.parse(raw)[0];
    }

    _requestUrl(endpoint, payload = '') {
        if (payload) {
            payload = `?${payload}`;
        }

        return encodeURI(`${DOMAIN}${API_POINT}${endpoint}${payload}`);
    }

    _sign(method, { endpoint, payload, expires }) {
        const hmac = crypto.createHmac('sha256', this._privateKey);
        let data = `${method}${API_POINT}${endpoint}`;

        if (method === 'GET') {
            data += `?${payload}${expires}`;
        } else {
            data += `?${expires}${payload}`;
        }

        hmac.update(encodeURI(data));

        return hmac.digest('hex');
    }

    _makeHeaders(sign, expires) {
        return {
            'api-expires': expires,
            'api-key': this._publicKey,
            'api-signature': sign,
        };
    }

    _makeExpires() {
        return +moment().add(5, 'minutes') / 1000;
    }

    async _request(method, uri, headers, payload = null) {
        return await request({
            method,
            uri,
            headers,
            body: JSON.stringify(payload),
            json: true,
            timeout: 5000,
        });
    }
}

module.exports = Stock;
