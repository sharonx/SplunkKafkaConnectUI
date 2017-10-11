const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const baseConfig = require('@splunk/webpack-configs/base.config').default;

module.exports = webpackMerge(baseConfig, {
    entry: path.join(__dirname, 'demo'),
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: path.join(__dirname, 'standalone/index.html'),
        }),
    ],
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true
    },
    devtool: 'eval-source-map',
});
