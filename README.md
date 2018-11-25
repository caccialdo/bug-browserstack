## Bug description

When the following conditions are met:

1. Local HTTPS server running on a port other than 443
1. HTTP Proxy running
1. BrowserStackLocal tunnel running, configured to connect through the previous proxy.

...trying to access the server (1) from a Live or Automate device fails at the proxy level.
In this example, we use Google's Martian Proxy which throws the following error:

```
ERROR: martian: failed to read request: malformed HTTP request "\x16\x03\x01\x02\x00\x01\x00\x01\xfc\x03\x03\xa9+̮\x9d\xd1}\x97g"
```

Testing the same setup with [Charles proxy](https://www.charlesproxy.com/), also results in the browser failing to reach the server (1), this time with a 5xx request to host `null:0`.

Using the privileged port 443 instead of 8443 for the HTTPS server solves this issue.

**There seems to be something wrong with the https://localhost:8443/ request after it exits the tunnel.**

## Steps to reproduce

### Failing scenario

- Ensure you have [Node 8+](https://nodejs.org/) and [Yarn](https://yarnpkg.com/lang/) installed.
- Create a `.env` file following the example from the `.env.example` file with your own Browserstack API key.

```sh
# Install dependencies
yarn

# Run the HTTPS server, Martian proxy and BrowserStackLocal tunnel
yarn start

# Verify the server works
curl -k 'https://localhost:8443/'

# Verify the proxy works
curl -k -x 'localhost:5001' 'https://localhost:8443/'
```

You can now head to the [BrowserStack Live](https://live.browserstack.com/) interface, choose a device, navigate to https://localhost:8443/ and see it failing.

Logs for BrowserStackLocal and Martian proxy can be found in the `logs` directory.

### Successful scenario

Edit the `constants.js` file and replace the `SERVER_PORT` variable to `443` instead of `8443`. Run `$ sudo yarn start` to allow for the privileged port access.

Navigating to https://localhost/ should now work correctly.
