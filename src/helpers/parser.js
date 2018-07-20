const commander = require('commander')
const SqlString = require('sqlstring')
const endOfLine = require('os').EOL
const logger = require('./logger')

module.exports = {
  parseCommandOptions() {
    commander
      .usage('[options] <file ...>')
      .option('-t, --table [tableName]', 'Specify a table name.', 'default')
      .option('-c, --create', 'Specify if CREATE TABLE statement must be added to output.')
      .option('-o, --output [file]', 'Specify a file to write the SQL.', new Date().getTime() + '.sql')
      .option('-s, --separator [separator]', 'Specify a separator string.', ';')
      .option('-l, --collation [collation]', 'Specify a  collation for table.', 'utf8')
      .parse(process.argv)
    return commander
  },
  getInsert(data, tableName) {
    logger.info('Generating INSERT statement.')
    let { headers, rows } = data
    let out = ''
    let lastRow = rows.length - 1

    tableName = SqlString.escapeId(tableName)
    headers = headers.map(e => SqlString.escapeId(e)).join(', ')
    rows = rows.map(e => e.map(el => SqlString.escape(el)).join(', '))

    out += `INSERT INTO ${tableName} (${headers}) VALUES ${endOfLine}`
    rows.map((e, i) => {
      out += `(${e})${lastRow === i ? ';' : ','}${endOfLine}`
    })
    return out
  },
  getCreateTable(data, tableName, collation) {
    logger.info('Generating CREATE TABLE statement.')
    let { headers } = data

    tableName = SqlString.escapeId(tableName)
    headers = headers.map(e => SqlString.escapeId(e))

    let out = `CREATE TABLE ${tableName} (${endOfLine}\t`
    out += headers.join(` VARCHAR(500) DEFAULT NULL,${endOfLine}\t`)
    out += ` VARCHAR(500) DEFAULT NULL${endOfLine})`
    out += ` ENGINE=InnoDB DEFAULT CHARSET=${collation};${endOfLine + endOfLine}`

    return out
  }
}
