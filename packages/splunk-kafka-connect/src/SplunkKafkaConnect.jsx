import React, { Component } from 'react';
import * as _ from 'lodash'
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Select from '@splunk/react-ui/Select';
import Text from '@splunk/react-ui/Text';
import urls from './urls';
import configTemplate from './docs/configurationTemplates.json'
import KafkaConnectors from './components/KafkaConnectors';
import css from './SplunkKafkaConnect.css';

class SplunkKafkaConnect extends Component {
    constructor(props) {
        super(props);
        const connectors = [];
        this.state = { connectors, open: false, plugins: [] };
        const connectorsUrl = urls.baseUrl + urls.connectors;
        fetch(connectorsUrl)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error('Cannot fetch connectors');
            }).then(res => {
                const promises = [];

                _.each(res, (connector) => {
                    promises.push(fetch(`${connectorsUrl}/${connector}/status`));
                })

                return Promise.all(promises);
            }).then(promises => {
                const resArray = [];
                _.each(promises, promise=> {
                    resArray.push(promise.json());
                });

                return Promise.all(resArray);
            }).then(jsonArray => {
                _.each(jsonArray, data => {
                    const connector = {};
                    connector.name = data.name;
                    connector.status = data.connector.state;
                    connector.numTasks = data.tasks.length;
                    connectors.push(connector);
                });

                this.setState({connectors});
            }).catch(err => {
                console.error(`Problems with fetching connectors ${err.message}`);
            })
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
                console.error(err.message);
            });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    submit = () => {
        // eslint-disable-next-line no-alert
        window.alert('Submitted!');
        this.handleRequestClose();
    };

    handleSelectChange = (e, { value }) => {
        const configTemplateString = configTemplate[value];
        this.setState({config: JSON.stringify(configTemplateString, null, 4)});
    }

    render() {
        return (
            <div className={css.container}>
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
                            <Text />
                        </ControlGroup>
                        <ControlGroup label="Plugins">
                            <Select onChange={this.handleSelectChange}>
                                {this.state.plugins.map(plugin => (
                                    <Select.Option label={plugin.class} description={`TYPE: ${plugin.type} VERSION: ${plugin.version}`} value={plugin.class} />
                                ))}
                            </Select>
                        </ControlGroup>
                        <ControlGroup label="Configuration">
                            <Text multiline value={this.state.config} rowsMin={10} rowsMax={15}/>
                        </ControlGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleRequestClose} label="Cancel" />
                        <Button appearance="primary" onClick={this.submit} label="Submit" />
                    </Modal.Footer>
                </Modal>
                <KafkaConnectors connectors={this.state.connectors} />
            </div>
        );
    }
}

export default SplunkKafkaConnect;
