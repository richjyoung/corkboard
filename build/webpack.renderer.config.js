const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: { renderer: path.join(__dirname, '../src/renderer/index.js') },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                loader: 'vue-loader',
                test: /\.vue$/
            },
            {
                loader: 'file-loader',
                options: { name: '[hash].[ext]' },
                test: /\.(png|jpg|gif|svg|ttf)$/
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist/electron')
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            template: path.resolve(__dirname, '../src/index.ejs')
        })
    ],
    resolve: {
        alias: { vue$: 'vue/dist/vue.esm.js' },
        extensions: [
            '*',
            '.js',
            '.vue',
            '.json'
        ]
    },
    target: 'electron-renderer'
};
