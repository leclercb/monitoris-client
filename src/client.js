const { nconf } = require('./config');
const { createRedisClient } = require('./redis');
const WebSocket = require('ws');

const redisClient = createRedisClient();

const instanceId = nconf.get('instanceId');
const secret = nconf.get('secret');

if (!instanceId || !secret) {
    console.error('The instance id and/or the secret are missing');
    return;
}

const ws = new WebSocket(`ws://localhost:5000/socket?instanceId=${instanceId}&secret=${secret}`);

let interval;

ws.on('open', function open() {
    interval = setInterval(async () => {
        const info = await redisClient.info();

        ws.send(JSON.stringify({
            action: 'info',
            data: info
        }));
    }, 5000);
});

ws.on('close', function open() {
    clearInterval(interval);
    interval = null;
});

ws.on('message', function message(data) {
    console.log(data);
});

ws.on('error', function error(error) {
    console.error(error.toString());
});