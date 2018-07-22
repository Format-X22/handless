const core = require('griboyedov');
const logger = core.Logger;

class Main {
    async run() {
        // TODO -
    }
}

new Main().run().then(
    () => {
        logger.info('Main service started!');
    },
    error => {
        logger.error(`Main service failed - ${error}`);
        process.exit(1);
    }
);
