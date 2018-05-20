#!/usr/bin/env node
const bashTitle = require('node-bash-title')

process.title = 'data2sql'
bashTitle('data2sql')

require('../src/app')()
