const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

var node_modules = {};
fs.readdirSync('node_modules').filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
}).forEach(function(mod) {
    node_modules[mod] = 'commonjs ' + mod;
});

module.exports = {
    entry: {
        renderer: path.join(__dirname, '../src/main/index.js')
    },
    target: 'electron-main',
    output: {
        path: path.join(__dirname, '../dist/electron'),
        filename: '[name].js'
    },
    externals: node_modules,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    node: {
        __dirname: false
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.node']
    }
};