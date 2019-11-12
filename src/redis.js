const Redis = require('ioredis');
const { nconf } = require('./config');

function createRedisClient() {
    if (!nconf.get('redis')) {
        throw new Error('Redis options are missing');
    }

    const options = {
        enableOfflineQueue: false,
        connectionName: 'monitoris-proxy',
        ...nconf.get('redis')
    };

    return new Redis(options);
}

module.exports = {
    createRedisClient
};