const execa = require('execa')
const os = require('os')
const request = require('superagent')
const { createFileStream } = require('./utils')

const {
  LOCALHOST,
  PROXY_PORT_API,
  PROXY_PORT_HTTP,
  PROXY_PORT_HTTPS,
  SERVER_PORT
} = require('./constants')

const BIN_PATH = `bin/${os.platform()}/${os.arch()}/martian-proxy`

const BIN_ARGS = [
  `-addr=:${PROXY_PORT_HTTP}`,
  `-api-addr=:${PROXY_PORT_API}`,
  `-api=${LOCALHOST}`,
  '-cert=ca-keystore-ec.pem',
  '-cors', // Allows directly loading the HAR logs into the online viewer. Useful for debugging
  '-har',
  `-key=ca-keystore-ec.pem`,
  '-skip-tls-verify', // Ignore self-signed certificate of Express server sitting behind the proxy
  `-tls-addr=:${PROXY_PORT_HTTPS}`,
  '-v=1' // 0: errors-only (default), 1: errors + info, 2: debug
]

async function startProxy () {
  console.log(`$ ${BIN_PATH} ${BIN_ARGS.join(' ')}`)
  execa(BIN_PATH, BIN_ARGS, {
    stdout: await createFileStream('logs/martian-proxy-stdout.log'),
    stderr: await createFileStream('logs/martian-proxy-stderr.log')
  })
  await new Promise(resolve => setTimeout(resolve, 500)) // Give 500ms for the proxy to finish setting up

  /**
   * This is a hack that redirects HTTPS requests from port 443 to port 8443.
   * It provides a dirty fix to avoid running the server on the privileged
   * port 443 but should really be avoided if possible
   */
  // await configureProxy()
}

function configureProxy (cfg) {
  return request
    .post(`http://${LOCALHOST}:${PROXY_PORT_API}/configure`)
    .send({
      'url.Filter': {
        'scope': ['request', 'response'],
        'scheme': 'https',
        'host': LOCALHOST,
        'modifier': {
          'port.Modifier': {
            'scope': ['request'],
            'port': 8443
          }
        }
      }
    })
}

module.exports = startProxy
