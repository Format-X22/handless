const fs = require('fs');

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

        this._zones = [];

        while (true) {
            this._zones.push(current);
            current *= 1.01;

            if (current > 25000) {
                break;
            }
        }
    }

    _loop(data) {
        let up, down;

        this._state = 'init';

        for (let tick of Object.values(data)) {
            const [date, open, high, low, close] = tick;

            if (!up) {
                [up, down] = this._findZone(close);
            }

            this._iteration(date, open, high, low, close, up, down);
        }
    }

    _findZone(value) {
        let last = 0;

        for (let edge of this._zones) {
            if (edge > value) {
                return [last, edge];
            }

            last = edge;
        }
    }

    _iteration(date, open, high, low, close, up, down) {
        switch (this._state) {
            case 'init':
                //
                break;
            case 'long':
                //
                break;
            case 'short':
                //
                break;
        }
    }
}

new Test().run();
