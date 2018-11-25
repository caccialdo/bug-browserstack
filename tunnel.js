const execa = require('execa')
const os = require('os')
const { createFileStream } = require('./utils')

const {
  BROWSERSTACK_KEY,
  LOCALHOST,
  PROXY_PORT_HTTP
} = require('./constants')

const BIN_PATH = `bin/${os.platform()}/${os.arch()}/BrowserStackLocal`

const BIN_ARGS = [
  '--force-local=true',
  '--force-proxy=true',
  `--key=${BROWSERSTACK_KEY}`,
  `--local-proxy-host=${LOCALHOST}`,
  `--local-proxy-port=${PROXY_PORT_HTTP}`,
  `--verbose=3`
]

async function startTunnel () {
  console.log(`$ ${BIN_PATH} ${BIN_ARGS.join(' ')}`)
  await execa(BIN_PATH, BIN_ARGS, {
    stdout: await createFileStream('logs/BrowserStackLocal-stdout.log'),
    stderr: await createFileStream('logs/BrowserStackLocal-stderr.log')
  })
}

module.exports = startTunnel
