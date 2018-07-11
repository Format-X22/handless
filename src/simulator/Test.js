const fs = require('fs');
const moment = require('moment');
const LinkedList = require('linked-list');
const LinkedItem = require('../LinkedItem');

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
            if (moment().subtract(10, 'days') > moment(tick[0] * 1000)) { // TODO
                continue;
            }

            if (!edge) {
                edge = this._findZone(tick[4]);
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
                } else if (close < edge.value) {
                    this._state = 'short';
                }
                break;
            case 'long':
                console.log('long');
                break;
            case 'short':
                console.log('short');
                break;
        }
    }
}

new Test().run();
