const core = require('griboyedov');
const logger = core.Logger;
const Stock = require('./Stock');
const SimStock = require('./SimStock');
const CandleState = require('./CandleState');
const EdgeGenerator = require('./EdgeGenerator');
const Strategy = require('Strategy');

class Main {
    async run() {
        let stock;
        const {
            HL_PUBLIC: publicKey,
            HL_PRIVATE: privateKey,
            HL_MODE: mode,
            HL_INDENT: indent,
        } = process.env;

        if (mode === 'dev') {
            stock = new SimStock();
        } else {
            stock = new Stock(publicKey, privateKey);
        }

        const strategy = new Strategy(new EdgeGenerator(indent), new CandleState(), stock);

        // TODO options
        await strategy.run({});
    }
}

logger.info('Start...');
new Main().run().then(
    () => {
        logger.info('Main service started!');
    },
    error => {
        logger.error(`Main service failed - ${error}`);
        process.exit(1);
    }
);
