const fse = require('fs-extra')

function createFileStream (path) {
  return new Promise(async resolve => {
    await fse.ensureFile(path)
    const stream = fse.createWriteStream(path)
    stream.on('open', resolve)
  })
}

module.exports = {
  createFileStream
}
