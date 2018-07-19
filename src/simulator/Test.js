const fs = require('fs');
const moment = require('moment');
const LinkedList = require('linked-list');
const LinkedItem = require('../LinkedItem');

const FROM = moment('2018-07-05T00:00:00.000');

class Test {
    run() {
        const dataBuffer = fs.readFileSync(`${__dirname}/data.json`);
        const dataString = dataBuffer.toString();
        const data = JSON.parse(dataString);

        this._makeZones();
        this._loop(data);
    }

    _makeZones() {
        let current = 1000;

        this._zones = new LinkedList();

        while (true) {
            this._zones.append(new LinkedItem(Math.round(current)));
            current *= 1.01;

            if (current > 5500 && current < 10100) {
                console.log(Math.round(current));
            }

            if (current > 25000) {
                break;
            }
        }
    }

    _loop(data) {
        this._state = 'init';

        for (let tick of Object.values(data)) {
            if (FROM > moment(tick[0] * 1000)) {
                continue;
            }

            if (!this._edge) {
                this._edge = this._findZone(tick[4]);
                this._up = this._edge.value;
                this._down = this._edge.prev.value;
            }

            this._iteration(tick);
        }
    }

    _findZone(value) {
        let edge = this._zones.head;

        while (true) {
            if (edge.value > value) {
                return edge;
            }

            edge = edge.next;
        }
    }

    _iteration([date, open, high, low, close]) {
        switch (this._state) {
            case 'init':
                if (close > this._edge.value) {
                    this._state = 'long';
                    this._logMoment(date, close);
                } else if (close < this._edge.value) {
                    this._state = 'short';
                    this._logMoment(date, close);
                }
                break;

            case 'long':
                while (true) {
                    if (close >= this._edge.value) {
                        this._edge = this._edge.next;
                        this._logMoment(date, close);
                    } else if (close <= this._edge.prev.prev.value) {
                        this._state = 'short';
                        this._edge = this._edge.prev.prev;
                        this._logMoment(date, close);
                    } else {
                        break;
                    }
                }
                break;

            case 'short':
                while (true) {
                    if (close < this._edge.prev.value) {
                        this._edge = this._edge.prev;
                        this._logMoment(date, close);
                    } else if (close >= this._edge.next.value) {
                        this._state = 'long';
                        this._edge = this._edge.next;
                        this._logMoment(date, close);
                    } else {
                        break;
                    }
                }
                break;
        }
    }

    _logMoment(date, close) {
        const now = moment(date * 1000).format('DD/MM HH:mm');
        const closed = close.toFixed(1);
        const up = this._edge.value;
        const down = this._edge.prev.value;
        const zone = this._edge.value - this._edge.prev.value;

        console.log(
            `${this._state} - ${now} (${closed} :: ${up} :: ${down} :: ${zone})`
        );
    }
}

new Test().run();
