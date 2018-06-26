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
        const current = +this._extractValue(currentRaw);

        const after4HoursRaw = await inquirer.prompt({
            type: 'input',
            name: 'Значение входа через 4 часа?',
            validate: value => value.length > 0 && isFinite(+value),
        });
        const after4Hours = +this._extractValue(after4HoursRaw);

        const amountRaw = await inquirer.prompt({
            type: 'input',
            name: 'Количество долларов?',
            validate: value => value.length > 0 && isFinite(+value),
        });
        const amount = +this._extractValue(amountRaw);

        const step = (after4Hours - current) / 49;

        const after1Hour = current + step * 13;
        const after8Hour = current + step * 97;
        const after24Hour = current + step * 289;

        this._checkText('Через час значение будет', after1Hour);
        this._checkText('Через 8 часов значение будет', after8Hour);
        this._checkText('Через 24 часа значение будет', after24Hour);
        this._checkText('Вход в позицию на', `$${amount}`);

        const confirmRaw = await inquirer.prompt({
            type: 'confirm',
            name: 'Всё верно?',
        });
        const confirm = this._extractValue(confirmRaw);

        if (!confirm) {
            console.log('Отмена!');
            process.exit(0);
        }

        return { type, current, step, amount };
    }

    _extractValue(obj) {
        return +obj[Object.keys(obj)[0]]
    }

    _checkText(text, value) {
        console.log('-> '.bold.green + text + ' ' + `${value}`.bold);
    }
}

module.exports = Control;