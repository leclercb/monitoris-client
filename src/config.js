const nconf = require('nconf');

nconf
    .argv({
        parseValues: true
    })
    .env({
        parseValues: true
    })
    .file({
        file: process.env.CONFIG_FILE || '.env'
    });

module.exports = {
    nconf
};