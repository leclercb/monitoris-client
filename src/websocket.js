const WebSocket = require('ws');

function connectWebSocket(url, options, redisClient) {
    const ws = new WebSocket(url, options);

    let interval;

    ws.on('open', function open() {
        console.log("Connected");

        interval = setInterval(async () => {
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
        }, 5000);
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

                    const result = await redisClient.call(message.command, message.parameters);

                    ws.send(JSON.stringify({
                        messageId: message.messageId,
                        status: 200,
                        data: result
                    }));
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