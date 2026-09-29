const { randomUUID } = require('crypto');

function generatedId() {
    return randomUUID();
}

module.exports = generatedId;