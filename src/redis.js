const { nconf } = require('./config');
const Redis = require('ioredis');

function createRedisClient() {
    if (!nconf.get('redis')) {
        throw new Error('Redis options are missing');
    }

    const options = {
        enableOfflineQueue: false,
        ...nconf.get('redis')
    };

    return new Redis(options);
}

module.exports = {
    createRedisClient
};