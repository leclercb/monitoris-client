const HttpsProxyAgent = require('https-proxy-agent');
const { parse } = require('url');
const { nconf } = require('./config');

function getAgent() {
    let proxy = nconf.get('httpProxy');

    if (!proxy) {
        return null;
    }

    if (!proxy.enabled) {
        return null;
    }

    let url = proxy.url

    if (!url) {
        url = nconf.get('http_proxy');
    }

    if (!url) {
        return null;
    }

    console.log('Using proxy server %j', parse(url).host);

    return new HttpsProxyAgent(url);
}

module.exports = {
    getAgent
};