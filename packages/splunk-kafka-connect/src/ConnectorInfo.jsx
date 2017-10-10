import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash'
import Button from '@splunk/react-ui/Button';
import urls from './urls';

class ConnectorInfo extends Component {
    static propTypes = {
        name: PropTypes.string,
    };


    render() {
        return (
            <h1>
                Infomration
            </h1>
        );
    }
}

export default ConnectorInfo;
