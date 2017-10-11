const path = require('path');
const webpackMerge = require('webpack-merge');
const baseComponentConfig = require('@splunk/webpack-configs/base.config').default;

module.exports = webpackMerge(baseComponentConfig, {
    entry: path.join(__dirname, 'src/index'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'lib'),
    },
    devtool: 'source-map'
});
