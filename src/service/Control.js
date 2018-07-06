const inquirer = require('inquirer');
const core = require('griboyedov');
const BasicService = core.service.Basic;

class Control extends BasicService {
    async start() {
        const type = await this._getType();
        const current = await this._getCurrent();
        const after4Hours = await this._getAfter4Hours();
        const amount = await this._getAmount();
        const step = (after4Hours - current) / 49;
        const confirm = await this._getConfirm(current, step, amount);

        if (!confirm) {
            console.log('Отмена!');
            process.exit(0);
        }

        this.done();

        return { type, current, step, amount };
    }

    async _getType() {
        const typeRaw = await inquirer.prompt({
            type: 'list',
            name: 'Тип позиции?',
            choices: ['Short', 'Long'],
        });

        return this._extractValue(typeRaw).toLowerCase();
    }

    async _getCurrent() {
        const currentRaw = await inquirer.prompt({
            type: 'input',
            name: 'Текущее значение входа?',
            validate: value => value.length > 0 && isFinite(+value),
        });

        return +this._extractValue(currentRaw);
    }

    async _getAfter4Hours() {
        const after4HoursRaw = await inquirer.prompt({
            type: 'input',
            name: 'Значение входа через 4 часа?',
            validate: value => value.length > 0 && isFinite(+value),
        });

        return +this._extractValue(after4HoursRaw);
    }

    async _getAmount() {
        const amountRaw = await inquirer.prompt({
            type: 'input',
            name: 'Количество долларов?',
            validate: value => value.length > 0 && isFinite(+value),
        });

        return +this._extractValue(amountRaw);
    }

    async _getConfirm(current, step, amount) {
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

        return this._extractValue(confirmRaw);
    }

    _extractValue(obj) {
        return obj[Object.keys(obj)[0]];
    }

    _checkText(text, value) {
        console.log('-> '.bold.green + text + ' ' + `${value}`.bold);
    }
}

module.exports = Control;
