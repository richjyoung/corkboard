const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    mode: 'development',
    target: 'electron-renderer',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },{
                test: /\.vue$/,
                loader: 'vue-loader'
            },{
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {'vue$': 'vue/dist/vue.esm.js'},
        extensions: ['*', '.js', '.vue', '.json']
    }
}