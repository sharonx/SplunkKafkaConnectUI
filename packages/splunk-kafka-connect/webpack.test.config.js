const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseComponentConfig = require('@splunk/webpack-configs/component.config').default;

module.exports = webpackMerge(baseComponentConfig, {
    externals: {
        'react/addons': 'react',
        'react/lib/ExecutionEnvironment': 'react',
        'react/lib/ReactContext': 'react',
    },
    plugins: [new webpack.IgnorePlugin(/react-addons-test-utils/)],
});
