const logger = require('./helpers/logger')
const parser = require('./helpers/parser')
const reader = require('./helpers/reader')

module.exports = function run() {
  const options = parser.parseCommandOptions()
  reader.getFileData(options.args[0], options)
    .then(data => {
      let createTable = ''
      if (options.create) {
        createTable += parser.getCreateTable(data, options.table, options.collation)
      }
      let insert = parser.getInsert(data, options.table)
      reader.saveData(options.output, createTable + insert)
      process.exit(0)
    })
    .catch(error => {
      logger.error(error)
      process.exit(-1)
    })
}
