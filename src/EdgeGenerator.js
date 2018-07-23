const core = require('griboyedov');
const logger = core.Logger;

const MAX = 100000;

class EdgeGenerator {
    constructor(start, step, indent) {
        indent = +indent;

        if (isNaN(indent)) {
            logger.error('Invalid edge indent!');
            process.exit(1);
        }

        this._start = start;
        this._step = step;
        this._indent = indent;
        this._current = 0;
        this._values = [this._start];

        this._generate();
    }

    edgeMaxValue() {
        return this._values[this._current + 1];
    }

    edgeMinValue() {
        return this._values[this._current - 1];
    }

    moveUp() {
        this._current++;
    }

    moveDown() {
        this._current--;
    }

    _generate() {
        while (true) {
            let last = this._values[this._values.length - 1];
            let val = last * this._step + last * this._indent;

            if (val > MAX) {
                break;
            }

            this._values.push(val);
        }

        this._values = this._values.map(value => {
            value = +value.toFixed(1);

            const splits = value.toString().split('.');
            const dig = +splits[1] || 0;
            const val = +splits[0];

            if (dig >= 0 && dig < 3) {
                return val;
            } else if (dig >= 3 && dig < 7) {
                return val + 0.5;
            } else {
                return val + 1;
            }
        });
    }
}

module.exports = EdgeGenerator;
