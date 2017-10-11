const testRunner = require('@splunk/karma-unit-test-runner');

module.exports = config => {
    testRunner.config(config, {
        basePath: __dirname,
        testRegexp: '(.+)\\.unit(?:\\.jsx?)$',
        testApps: { SplunkKafkaConnect: { path: 'src' } },
    });
};
