const startProxy = require('./proxy')
const startServer = require('./server')
const startTunnel = require('./tunnel')

async function main () {
  await startServer()
  await startProxy()
  await startTunnel()
}

main().catch(err => {
  console.err(err.stack)
  process.exit(1)
})
