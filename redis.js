const { nconf } = require('./config');
const Redis = require('ioredis');

function createRedisClient() {
    if (!nconf.get('redis:host')) {
        throw new Error('Redis host is missing');
    }

    if (!nconf.get('redis:port')) {
        throw new Error('Redis port is missing');
    }

    const options = {
        host: nconf.get('redis:host'),
        port: nconf.get('redis:port'),
        db: nconf.get('redis:db'),
        enableOfflineQueue: false
    };

    if (nconf.get('redis:password')) {
        options.password = nconf.get('redis:password');
    }

    return new Redis(options);
}

module.exports = {
    createRedisClient
};