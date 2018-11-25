const ip = require('ip')

exports.BROWSERSTACK_KEY = process.env.BROWSERSTACK_KEY

exports.LOCALHOST = ip.address() || '0.0.0.0'

exports.SERVER_PORT = 8443

exports.PROXY_PORT_API = 5000
exports.PROXY_PORT_HTTP = 5001
exports.PROXY_PORT_HTTPS = 5002
