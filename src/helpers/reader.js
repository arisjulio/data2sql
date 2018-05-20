const fs = require('fs')
const path = require('path')
const AutodetectDecoderStream = require('autodetect-decoder-stream')
const xlsx = require('xlsx')
const CsvReader = require('csv-reader')
const logger = require('./logger')
const PromptList = require('prompt-list')

function getCSVData(filepath, separator) {
  logger.info(`Reading data from CSV file.`)
  return new Promise((resolve, reject) => {
    let rows = []
    try {
      let inputStream = fs.createReadStream(filepath)
        .pipe(new AutodetectDecoderStream({ defaultEncodig: '1258' }))

      inputStream
        .pipe(CsvReader({
          trim: true,
          delimiter: separator,
          skipEmptyLines: true
        }))
        .on('data', row => rows.push(row))
        .on('end', data => {
          let headers = rows.shift();
          resolve({ headers, rows })
        })
        .on('error', reject)
    } catch (error) {
      reject(error)
    }
  })
}

function getExcelData(filepath) {
  logger.info(`Reading data from Excel file.`)
  return new Promise((resolve, reject) => {
    try {
      let workbook = xlsx.readFile(filepath)
      let sheets = workbook.SheetNames

      if (sheets.length > 1) {
        let list = new PromptList({
          name: 'Sheet',
          message: 'What sheet contains the dataset?',
          choices: sheets
        })

        list.run()
          .then(sheet => {
            resolve(getDataFromExcelJson(workbook, sheet))
          })
          .catch(reject)
      } else {
        resolve(getDataFromExcelJson(workbook, sheets[0]))
      }
    } catch (error) {
      reject(error)
    }
  })
}

function getDataFromExcelJson(workbook, sheet) {
  logger.info(`Getting data from sheet '${sheet}'.`)
  let parsed = xlsx.utils.sheet_to_json(workbook.Sheets[sheet])
  if (parsed.length <= 0) {
    logger.error(`The sheet '${sheet}' doesn't contain data.`)
    process.exit(-1)
  }

  let headers = Object.keys(parsed[0])
  let rows = []
  parsed.forEach(e => {
    let fields = []
    Object.keys(e).forEach(i => fields.push(e[i]))
    rows.push(fields)
  })

  return { headers, rows }
}

module.exports = {
  getFileData(filepath, options) {
    if (!fs.existsSync(filepath)) {
      logger.error(`The file ${filepath} doesn't exists.`)
      process.exit(-1)
    }

    let extension = path.extname(filepath)

    if (['.csv', '.CSV'].indexOf(extension) !== -1) {
      return getCSVData(filepath, options.separator)
    } else if (['.xls', '.XLS', '.xlsx', '.XLSX'].indexOf(extension) !== -1) {
      return getExcelData(filepath)
    } else {
      logger.error(`Invalid file format. The file must be .xls, .xlsx or .csv`)
      process.exit(-1)
    }
  },
  saveData(output, data) {
    if (!output) {
      logger.error('You must be provide a output file. See data2sql --help for more information.')
      process.exit(-1)
    } else if (!fs.existsSync(path.dirname(output))) {
      logger.error(`The destination path '${output}' doesn't exist.`)
      process.exit(-1)
    }

    try {
      fs.writeFileSync(output, data)
      logger.success(`File generated in ${output}`)
    } catch (error) {
      logger.error(error)
      process.exit(-1)
    }
  }
}
