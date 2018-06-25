const inquirer = require('inquirer');

class Control {
    async start() {
        const typeRaw = await inquirer.prompt({
            type: 'list',
            name: 'Тип позиции?',
            choices: ['Short', 'Long'],
        });
        const type = typeRaw[Object.keys(typeRaw)[0]];

        const currentRaw = await inquirer.prompt({
            type: 'input',
            name: 'Текущее значение входа?',
            validate: value => value.length > 0 && isFinite(+value),
        });
        const current = +currentRaw[Object.keys(currentRaw)[0]];

        const after4HoursRaw = await inquirer.prompt({
            type: 'input',
            name: 'Значение входа через 4 часа?',
            validate: value => value.length > 0 && isFinite(+value),
        });
        const after4Hours = +after4HoursRaw[Object.keys(after4HoursRaw)[0]];

        const step = (after4Hours - current) / 49;

        const after1Hour = current + step * 13;
        const after8Hour = current + step * 97;
        const after24Hour = current + step * 289;

        console.log(`-> Через час значение будет ${after1Hour}.`);
        console.log(`-> Через 8 часов значение будет ${after8Hour}.`);
        console.log(`-> Через 24 часа значение будет ${after24Hour}.`);

        const confirmRaw = await inquirer.prompt({
            type: 'confirm',
            name: 'Всё верно?',
        });
        const confirm = confirmRaw[Object.keys(confirmRaw)[0]];

        if (!confirm) {
            console.log('Отмена!');
            process.exit(0);
        }

        return { type, current, step };
    }
}
