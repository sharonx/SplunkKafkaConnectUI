import React, { Component } from 'react';
import Clickable from '@splunk/react-ui/Clickable';
import { Splunk } from '@splunk/react-ui/Logo';
import css from './SplunkBanner.css';

class SplunkBanner extends Component {
    handleClick = () => {
        window.location.href = `/#/`
    };

    render() {
        return (
            <header className={css.header}>
                <Clickable onClick={this.handleClick}>
                    <Splunk invert/>
                </Clickable>
            </header>
        )
    }
}

export default SplunkBanner;

