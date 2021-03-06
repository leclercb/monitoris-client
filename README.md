<p align="center">
    <img 
        alt="Logo" 
        src="https://www.monitoris.app/resources/images/logo.png"
        height="150"/>
</p>

# Monitoris Client

Monitoris is a real-time monitoring tool for Redis.

This client allows you to securely connect your Redis instance with Monitoris Cloud.

# Usage

## Use binary (recommended)

* Download the latest binary file from [GitHub releases](https://github.com/leclercb/monitoris-client/releases)
* Copy the following content in a file named `.env` in the same directory as the binary file.
```
{
    "proxy": "wss://proxy.monitoris.app/socket",
    "instance": {
        "id": "",
        "secret": ""
    },
    "redis": {
        "host": "localhost",
        "port": 6379,
        "password": ""
    },
    "httpProxy": {
        "enabled": false,
        "url": ""
    }
}
```
* Edit the configuration file named `.env`:
  * instance: the id and secret of your instance (available in Monitoris Instances view)
  * redis: the connection information of your Redis server ([see ioredis API](https://github.com/luin/ioredis/blob/master/API.md))
  * httpProxy: only needed if your Redis server is behind a corporate proxy
* Start the client: `./client-XYZ`

## Use source code

* Download the content of this repository: [master.zip](https://github.com/leclercb/monitoris-client/archive/master.zip)
* Install the dependencies: `npm install`
* Edit the configuration file named `.env`:
  * instance: the id and secret of your instance (available in Monitoris Instances view)
  * redis: the connection information of your Redis server ([see ioredis API](https://github.com/luin/ioredis/blob/master/API.md))
  * httpProxy: only needed if your Redis server is behind a corporate proxy
* Start the client: `npm start`

# Connection Errors

| Code     | Reason                                                                                        |
|----------|-----------------------------------------------------------------------------------------------|
| 400      | The instance id and/or the secret are null or empty                                           |
| 403      | The secret is incorrect                                                                       |
| 404      | The instance id is incorrect or the instance type is not 'proxy'                              |
| 409      | The instance is not enabled or a websocket connection for the same instance already exists |

# License

The license is: **MIT**.
