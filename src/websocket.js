const WebSocket = require('ws');

function connectWebSocket(url, options, redisClient) {
    const ws = new WebSocket(url, options);

    ws.on('open', function open() {
        console.log("Connected");
    });

    ws.on('close', function close() {
        console.log("Connection closed. Trying to reconnect...");

        setTimeout(function () {
            connectWebSocket(url, options, redisClient);
        }, 10000);
    });

    ws.on('message', async function message(data) {
        try {
            const message = JSON.parse(data);

            if ('messageId' in message) {
                console.log(`${message.messageId} (${message.db}): ${message.command} ${(message.parameters || []).join(' ')}`)

                if (redisClient.status === 'ready') {
                    await redisClient.select(message.db);

                    try {
                        const result = await redisClient.call(message.command, message.parameters);

                        ws.send(JSON.stringify({
                            messageId: message.messageId,
                            status: 200,
                            data: result
                        }));
                    } catch (e) {
                        ws.send(JSON.stringify({
                            messageId: message.messageId,
                            status: 400,
                            data: {
                                code: 'redis_execution',
                                message: e.toString()
                            }
                        }));
                    }
                } else {
                    ws.send(JSON.stringify({
                        messageId: message.messageId,
                        status: 405,
                        data: {
                            code: 'redis_not_connected',
                            message: 'Redis instance is not connected'
                        }
                    }));
                }
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

module.exports = {
    connectWebSocket
};