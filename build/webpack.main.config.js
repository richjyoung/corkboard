const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const nodeModules = {};

fs.readdirSync('node_modules').filter((mod) => { // eslint-disable-line no-sync
    return [
        '.bin'
    ].indexOf(mod) < 0;
})
    .forEach((mod) => {
        nodeModules[mod] = `commonjs ${mod}`;
    });

module.exports = {
    devtool: 'source-map',
    entry: { main: path.join(__dirname, '../src/main/index.js') },
    externals: nodeModules,
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    node: { __dirname: false },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist/electron')
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.node'
        ]
    },
    target: 'electron-main'
};
