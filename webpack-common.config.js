const path = require('path')

module.exports = (filename, library, experiments) => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename,
    library
  },
  experiments
})
