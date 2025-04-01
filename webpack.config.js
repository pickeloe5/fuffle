// const path = require('path')

module.exports = {
    entry: './src-client/index.ts',
    output: {
        filename: 'Fuffle.js',
        library: {
            type: 'module'
        }
    },
    module: {rules: [{
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
    }]},
    resolve: {extensions: ['.ts']},
    experiments: {
        outputModule: true
    }
}