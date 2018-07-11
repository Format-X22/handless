const LinkedList = require('linked-list');

class LinkedItem extends LinkedList.Item {
    constructor(value) {
        super();

        this.value = value;
    }
}

module.exports = LinkedItem;