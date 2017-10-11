import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Code from '@splunk/react-ui/Code';
import Text from '@splunk/react-ui/Text';
import Message from '@splunk/react-ui/Message';
import urls from '../urls';


class ConfigurationBox extends Component {
    static propTypes = {
        name: PropTypes.string,
        isNew: PropTypes.bool
    };
  constructor(props) {
        super(props)
        const config = '';
        const newConfig = {};
        this.state = {config, newConfig, showError: false, showMessage: false};

        if (!this.props.isNew) {
            const connectorUrl = `${urls.baseUrl}${urls.connectors}/${this.props.name}`;
            
            fetch(connectorUrl)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
    
                    throw new Error('Cannot get connector infomation');
                }).then(res => {
                    this.setState({ config: JSON.stringify(res.config, null, 4) });
                    this.setState({ newConfig: res.config });
                }).catch(err => {
                    console.error(`Problems with fetching connectors. Errors: ${err.message}`);
                });
        }
    }

    handleChange = (e, data) => {
        this.setState({ config: data.value });
        try {
            this.setState({ newConfig: JSON.parse(data.value) });
        } catch(error) {
            this.setState({ newConfig: {Error: 'Cannot parse the JSON input' } });
        }
    };

    handleClick = () => {
        this.setState({ showError: false, showMessage: true });
        if (this.state.newConfig.Error) {
            return false;
        }

        const configUrl = `${urls.baseUrl}${urls.connectors}/${this.props.name}/config`;
        fetch(configUrl, {
            method: 'put',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.newConfig),
        }).then(res => {
            if (res.ok) {
                console.log('Configuration updated successfully');
            } else{
                this.setState({ showError: true });
                console.error('Configuration updated with error');
            }
        })
    }

    render() {
        const messageStyle = {
            display: 'inline'
        }
        return (
            <div>
                <Text multiline value={this.state.config} onChange={this.handleChange} rowsMin={10} rowsMax={15}/>
                <Code value={JSON.stringify(this.state.newConfig, null, 4)} />
                <Button label="Update" appearance="primary" onClick={this.handleClick}/>
                {
                    this.state.showMessage && this.state.showError
                        ? <Message type="error" style={messageStyle}>Error happened when updating the configuration.</Message>
                        : null
                }
                {
                    this.state.showMessage && !this.state.showError
                        ? <Message type="success" style={messageStyle}>Configuration updated succesfully.</Message>
                        : null
                }
        </div>
        );
    }
}

export default ConfigurationBox;
