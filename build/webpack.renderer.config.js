const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        renderer: path.join(__dirname, '../src/renderer/index.js')
    },
    target: 'electron-renderer',
    output: {
        path: path.join(__dirname, '../dist/electron'),
        filename: '[name].js'
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
                test: /\.(png|jpg|gif|svg|ttf)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            }
        })
    ],
    resolve: {
        alias: { 'vue$': 'vue/dist/vue.esm.js' },
        extensions: ['*', '.js', '.vue', '.json']
    }
};