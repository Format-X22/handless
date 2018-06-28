const Control = require('./Control');
const Strategy = require('./Strategy');
const logger = require('./Logger');

class Main {
    async start() {
        logger.info('Настройка...');

        const config = await new Control().start();

        logger.info('Запуск стратегии...');

        await new Strategy(config).start();
    }
}

(async () => await new Main().start())();
