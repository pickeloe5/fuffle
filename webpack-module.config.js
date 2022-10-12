const common = require('./webpack-common.config.js')

module.exports = common('fuffle.js',
  {type: 'module'},
  {outputModule: true})
