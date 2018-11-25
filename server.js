const express = require('express')
const fse = require('fs-extra')
const https = require('https')
const morgan = require('morgan')

const {
  LOCALHOST,
  SERVER_PORT
} = require('./constants')

async function startServer () {
  const app = express()
  const pemFile = await fse.readFile('ca-keystore-ec.pem')

  app.use(morgan('tiny'))
  app.use('/', (req, res) => res.sendStatus(200))

  const httpsServer = https.createServer({ cert: pemFile, key: pemFile }, app)

  await new Promise(resolve => httpsServer.listen(SERVER_PORT, resolve))

  console.log(`Server ready at https://${LOCALHOST}:${SERVER_PORT}`)
}

module.exports = startServer
