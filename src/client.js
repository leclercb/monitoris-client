const { URL } = require('url');
const { nconf } = require('./config');
const { getAgent } = require('./proxy');
const { createRedisClient } = require('./redis');
const { connectWebSocket } = require('./websocket');

const redisClient = createRedisClient();

const instance = nconf.get('instance');

if (!instance) {
    console.error('The instance configuration is missing');
    return;
}

const instanceId = nconf.get('instance:id');
const secret = nconf.get('instance:secret');

if (!instanceId || !secret) {
    console.error('The instance id and/or the secret are missing');
    return;
}

const url = new URL(nconf.get('proxy'));
url.searchParams.set('instanceId', instanceId);
url.searchParams.set('secret', secret);

const agent = getAgent();
const options = agent ? { agent } : {};

connectWebSocket(url, options, redisClient);