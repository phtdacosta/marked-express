# marked-express
Simple and modular blog engine combining a powerful Markdown render library and a extendable web framework, based on Node.js

This project aims to be small, intuitive and focused in provide a basic solution for a blog engine using Node.js runtime. Only the essential parts are going to be provided and maintained, which creates room for high customization and modularity.

### Installation:
```
$ git clone https://github.com/phtdacosta/marked-express.git
$ cd marked-express
$ npm i
```

### Basic usage:
To run the blog engine server:
```
$ node ./index.js
```
In order to begin publishing content, open the browser and go to the following web address:

`
http://127.0.0.1:3300/write?username=admin&password=12345
`

Once the engine started successfully, a basic yet useful text editor is going to load in the browser window and the blog is ready to be used.

> The basic editor comes with a live Markdown render, allowing the author to write and preview exactly which content is going to be published.

> After initial tests, remember to update the [user settings](#user-settings).

# Documentation
### Summary
* [Dependencies](#dependencies)
* [Configuration file](#configuration-file)
    * [System settings](#system-settings)
    * [User settings](#user-settings)
* [Tools included](#tools-included)
* [License](#license)

## Dependencies
Main packages at the core of the project:
1. [Marked](https://www.npmjs.com/package/marked)
2. [Express](https://www.npmjs.com/package/express)

Auxiliary packages easily replaceable to meet specific needs:
1. [Drapid](https://www.npmjs.com/package/drapid)


## Configuration file
The default configuration file (`.config.json`) contains all the settings needed to properly run the project on any system. It is located at the project root directory and uses the JSON format.

```json
{
    "hostname": {
        "ipv4": "127.0.0.1",
        "ipv6": "::1"
    },
    "protocol": {
        "http": {
            "port": "3300"
        },
        "https": {
            "port": "443",
            "key": "./key.pem",
            "cert": "./cert.pem",
            "ca": "./"
        }
    },
    "preferences": {
        "netlayer": "ipv4",
        "applayer": ["http", "https"]
    },
    "domain": "127.0.0.1:3300",
    "username": "admin",
    "password": "12345"
}
```
## System settings
## `hostname.ipv4`
Sets the server **IPv4** address, if available.
## `hostname.ipv6`
Sets the server **IPv6** address, if available.
## `protocol.http.port`
Sets the server port for **HTTP** traffic, if available.
## `protocol.https.port`
Sets the server port for **HTTPS** traffic, if available.
## `protocol.https.key`
Sets the relative path to **SSL/TLS Private Key** file, if available.
## `protocol.https.cert`
Sets the relative path to **SSL/TLS Certificate** file, if available.
## `protocol.https.ca`
Sets the relative path to **SSL/TLS Certificate Authority** file, if available.
## `preferences.netlayer`
Defines the TCP/IP version used by the server instance. This preference depends on the `hostname` parameters.
> Possible values: `ipv4` or `ipv6`
## `preferences.applayer`
Defines the protocol version(s) used by the server instance. This preference depends on the `protocol` parameters.
> Possible values: `http` and/or `https`
## `domain`
Defines the domain that points to the server. It is used to reference URL addresses related to the blog content.
## User settings
> Be sure to update both `username` and `password` values. Keeping the default values makes the blog instance vulnerable to unauthorized people to manage it.
## `username`
Defines the username used by the blog author for authentication.
## `password`
Defines the password used by the blog author for authentication.

## License
This project exists under the [MIT license](https://github.com/phtdacosta/drapid/blob/master/LICENSE).