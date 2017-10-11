import React, { Component } from 'react';
import Button from '@splunk/react-ui/Button';
import Text from '@splunk/react-ui/Text';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Select from '@splunk/react-ui/Select';
import Message from '@splunk/react-ui/Message';
import configTemplate from '../docs/configurationTemplates.json'
import urls from '../urls';


class NewConnectorModal extends Component {
  constructor(props) {
        super(props)
        this.state = { plugins: [], className: '', showError: false, showMessage: false, config: '', connectorName: ''};
    }

    handleRequestOpen = () => {
        this.setState({
            open: true,
        });

        const connectorPluginsUrl = urls.baseUrl + urls.connectorPlugins;

        fetch(connectorPluginsUrl)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error('Cannot get kafka connector plugins');
            }).then(res => {
                this.setState({ plugins: res });
            }).catch(err => {
                this.setState({ showError: true });
                console.error(err.message);
            });
    };

    handleChange = (e, { value }) => {
        this.setState({ config: value });
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    submit = () => {
        this.setState({ showError: false });
        try {
            const updateConfig = JSON.parse(this.state.config);
            const validationUrl = `${urls.baseUrl}${urls.connectorPlugins}/${updateConfig['connector.class']}/config/validate`;
            const createConnectorUrl = urls.baseUrl + urls.connectors;
            fetch(validationUrl, {
                method: 'put',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateConfig),
            }).then(res => {
                if (res.ok) {
                    return fetch(createConnectorUrl, {
                        method:  'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.state.connectorName,
                            config: updateConfig
                        })
                    })
                }

                throw new Error('Invalid configuration');
            }).then(res => {
                if (res.ok) {
                    this.setState({ showError: false, showMessage: true });
                } else {
                    throw new Error('Error happened when create new connector');
                }
            }).catch(error => {
                this.setState({ showError: true, showMessage: true });
                console.error(error.message);
            })
        }
        catch (error) {
            this.setState({ showError: true });
        }
    };

    handleSelectChange = (e, { value }) => {
        const className = value.split('.').pop();
        this.setState({className});
        const configTemplateString = configTemplate[className];
        this.setState({config: JSON.stringify(configTemplateString, null, 4)});
    }

    handleNameChange = (e, { value }) => {
        this.setState({ connectorName: value });
    };

    render() {
        const messageStyle = {
            float: "right"
        }
        return (
            <div>
                <Button
                label="Create New"
                appearance="primary"
                onClick={() => {
                    this.handleRequestOpen();
                }}
            />
            <Modal
                onRequestClose={this.handleRequestClose}
                open={this.state.open}
                style={{ width: '550px' }}
            >
                <Modal.Header title="Create a New Connector" onRequestClose={this.handleRequestClose} />
                <Modal.Body>
                    <ControlGroup label="Name">
                            <Text canClear value={this.state.connectorName} onChange={this.handleNameChange} />
                    </ControlGroup>
                    <ControlGroup label="Plugins">
                        <Select onChange={this.handleSelectChange}>
                            {this.state.plugins.map(plugin => (
                                <Select.Option label={plugin.class} description={`TYPE: ${plugin.type} VERSION: ${plugin.version}`} value={plugin.class} key={plugin.class} />
                            ))}
                        </Select>
                    </ControlGroup>
                    <ControlGroup label="Configuration">
                        <Text multiline value={this.state.config} rowsMin={10} rowsMax={15} onChange={this.handleChange}/>
                    </ControlGroup>
                    {
                        this.state.showError
                            ? <Message type="error" style={messageStyle}>Invalid Configuration</Message>
                            : null
                    }
                    {
                        this.state.showMessage && !this.state.showError
                            ? <Message type="success" style={messageStyle}>Connector is added</Message>
                            : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleRequestClose} label="Cancel" />
                    <Button appearance="primary" onClick={this.submit} label="Submit" />
                </Modal.Footer>
            </Modal>
        </div>
        );
    }
}

export default NewConnectorModal;
