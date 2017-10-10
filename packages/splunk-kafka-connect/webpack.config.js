const path = require('path');
const webpackMerge = require('webpack-merge');
const baseComponentConfig = require('@splunk/webpack-configs/component.config').default;

module.exports = webpackMerge(baseComponentConfig, {
    entry: path.join(__dirname, 'src/SplunkKafkaConnect.jsx'),
    output: {
        filename: 'SplunkKafkaConnect.js',
        path: path.join(__dirname, 'lib'),
    },
});
