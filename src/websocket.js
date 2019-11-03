const WebSocket = require('ws');

function connectWebSocket(url, options, redisClient) {
    const ws = new WebSocket(url, options);

    let interval;

    const sendInfo = async function () {
        ws.send(JSON.stringify({
            messageId: 'status',
            status: 200,
            data: redisClient.status
        }));

        const info = await redisClient.info();

        if (redisClient.status === 'ready') {
            ws.send(JSON.stringify({
                messageId: 'info',
                status: 200,
                data: info
            }));
        }
    }

    ws.on('open', function open() {
        console.log("Connected");

        setTimeout(function () {
            sendInfo();
        }, 2000);

        interval = setInterval(function () {
            sendInfo();
        }, 60000);
    });

    ws.on('close', function open() {
        clearInterval(interval);
        interval = null;

        console.log("Connection closed. Trying to reconnect...");

        setTimeout(function () {
            connectWebSocket(url, options, redisClient);
        }, 10000);
    });

    ws.on('message', async function message(data) {
        try {
            const message = JSON.parse(data);

            if ('messageId' in message) {
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
                            data: e.toString()
                        }));
                    }
                } else {
                    ws.send(JSON.stringify({
                        messageId: message.messageId,
                        status: 405,
                        data: null
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