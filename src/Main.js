const core = require('griboyedov');
const logger = core.Logger;
const BasicService = core.service.Basic;
const Control = require('./service/Control');
const Strategy = require('./service/Strategy');
const Bitmex = require('./service/Bitmex');

class Main extends BasicService {
    constructor() {
        super();

        this._control = new Control();
        this._bitmexStrategy = new Strategy(Bitmex);
        this.addNested(this._bitmexStrategy);
    }

    async start() {
        logger.info('Настройка...');

        const config = await this._control.start();

        logger.info('Запуск стратегий...');

        await this._bitmexStrategy.start(config);
    }

    async stop() {
        await this.stopNested();
        process.exit(0);
    }
}

new Main().start().then(
    () => {
        logger.info('Main service started!');
    },
    error => {
        logger.error(`Main service failed - ${error}`);
        process.exit(1);
    }
);
