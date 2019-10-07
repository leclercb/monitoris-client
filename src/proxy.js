const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');
const { nconf } = require('./config');

function getAgent() {
    let proxy = nconf.get('httpProxy');

    if (!proxy) {
        proxy = nconf.get('http_proxy');
    }

    if (!proxy) {
        return null;
    }

    console.log('Using proxy server %j', url.parse(proxy).host);

    return new HttpsProxyAgent(proxy);
}

module.exports = {
    getAgent
};