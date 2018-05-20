const colors = require('colors/safe')

module.exports = {
  log(...args) {
    console.log(...args)
  },
  success(...args) {
    args = args.map(e => colors.green(e))
    console.log(...args)
  },
  info(...args) {
    args = args.map(e => colors.cyan(e))
    console.info(colors.cyan('[INFO]\t'), ...args)
  },
  warn(...args) {
    args = args.map(e => colors.yellow(e))
    console.warn(colors.yellow('[WARN]\t'), ...args)
  },
  error(...args) {
    args = args.map(e => colors.red(e))
    console.error(colors.red('[ERR]\t'), ...args)
  }
}
