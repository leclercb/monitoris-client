const { nconf } = require('./config');
const { createRedisClient } = require('./redis');
const WebSocket = require('ws');

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

function connect() {
    const ws = new WebSocket(`ws://localhost:5000/socket?instanceId=${instanceId}&secret=${secret}`);

    let interval;

    ws.on('open', function open() {
        console.log("Connected");

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

        console.log("Connection closed. Trying to reconnect...");

        setTimeout(function () {
            connect();
        }, 2000);
    });

    ws.on('message', function message(data) {
        console.log(data);
    });

    ws.on('error', function error(error) {
        console.error(error.toString());
        ws.close();
    });
}

connect();