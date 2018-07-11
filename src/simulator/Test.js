const fs = require('fs');
const moment = require('moment');
const LinkedList = require('linked-list');
const LinkedItem = require('../LinkedItem');

const FROM = moment('2018-07-01T12:01:00.000');

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

            if (current > 25000) {
                break;
            }
        }
    }

    _loop(data) {
        let edge;

        this._state = 'init';

        for (let tick of Object.values(data)) {
            if (FROM > moment(tick[0] * 1000)) {
                continue;
            }

            if (!edge) {
                edge = this._findZone(tick[4]);
                this._up = edge.value;
                this._down = edge.prev.value;
            }

            this._iteration(tick, edge);
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

    _iteration([date, open, high, low, close], edge) {
        switch (this._state) {
            case 'init':
                if (close > edge.value) {
                    this._state = 'long';
                    this._logMoment(date, close, edge);
                } else if (close < edge.value) {
                    this._state = 'short';
                    this._logMoment(date, close, edge);
                }
                break;
            case 'long':
                //console.log('long'); TODO
                break;
            case 'short':
                //console.log('short'); TODO
                break;
        }
    }

    _logMoment(date, close, edge) {
        const now = moment(date * 1000).format('DD/MM HH:mm');
        const closed = close.toFixed(1);
        const value = edge.value;
        const zone = edge.value - edge.prev.value;

        console.log(
            `${this._state} - ${now} (${closed} :: ${value} :: ${zone})`
        );
    }
}

new Test().run();
