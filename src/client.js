const { nconf } = require('./config');
const { createRedisClient } = require('./redis');
const { URL } = require('url');
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

const url = new URL(nconf.get('proxy'));
url.searchParams.set('instanceId', instanceId);
url.searchParams.set('secret', secret);

function connect() {
    const ws = new WebSocket(url);

    let interval;

    ws.on('open', function open() {
        console.log("Connected");

        interval = setInterval(async () => {
            const info = await redisClient.info();

            ws.send(JSON.stringify({
                messageId: 'info',
                data: JSON.stringify(info)
            }));
        }, 5000);
    });

    ws.on('close', function open() {
        clearInterval(interval);
        interval = null;

        console.log("Connection closed. Trying to reconnect...");

        setTimeout(function () {
            connect();
        }, 10000);
    });

    ws.on('message', async function message(data) {
        try {
            const message = JSON.parse(data);
            const result = await redisClient.call(message.command, message.parameters);

            if ('messageId' in message) {
                ws.send(JSON.stringify({
                    messageId: message.messageId,
                    data: JSON.stringify(result)
                }))
            }
        } catch (e) {
            // Skip message
        }
    });

    ws.on('error', function error(error) {
        console.error(error.toString());
        ws.close();
    });
}

connect();