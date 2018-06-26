const Control = require('./Control');
const logger = require('./Logger');

class Main {
    async start() {
        logger.info('Настройка...');

        const { type, current, step, amount } = await new Control().start();

        logger.info('Запуск стратегии...');

        // TODO -
    }
}

(async () => await new Main().start())();
