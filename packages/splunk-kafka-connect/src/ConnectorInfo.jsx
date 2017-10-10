import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash'
import ColumnLayout from '@splunk/react-ui/ColumnLayout';
import Button from '@splunk/react-ui/Button';
import Code from '@splunk/react-ui/Code';
import Text from '@splunk/react-ui/Text';
import Message from '@splunk/react-ui/Message';
import Table from '@splunk/react-ui/Table';
import urls from './urls';


class ConnectorInfo extends Component {
    static propTypes = {
        match: PropTypes.object,
    };

    constructor(props) {
        super(props)
        this.name = this.props.match.params.name;
        const tasks = [];
        const config = '';
        const newConfig = {};
        this.state = {tasks, config, newConfig, showError: false, showMessage: false};

        const connectorUrl = `${urls.baseUrl}${urls.connectors}/${this.name}`;
        const connectorStatusUrl = `${urls.baseUrl}${urls.connectors}/${this.name}/status`;

        const fetchPromises = [fetch(connectorUrl), fetch(connectorStatusUrl)];
        Promise.all(fetchPromises)
            .then(promises => {
                const resArray = [];
                _.each(promises, promise=> {
                    resArray.push(promise.json());
                });

                return Promise.all(resArray);
            }).then(jsonArray => {
                this.setState({ config: JSON.stringify(jsonArray[0].config, null, 4) });
                this.setState({ newConfig: jsonArray[0].config });
                this.setState({ tasks: jsonArray[1].tasks });
            }).catch(err => {
                console.error(`Problems with fetching connectors: ${this.name}. \nErrors: ${err.message}`);
            });
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

        const configUrl = `${urls.baseUrl}${urls.connectors}/${this.name}/config`;
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
                <h2>
                    {this.name} Infomration
                </h2>
                <ColumnLayout>
                    <ColumnLayout.Row>
                        <ColumnLayout.Column span={4}>
                            <Table stripeRows>
                                <Table.Head>
                                    <Table.HeadCell>Work ID</Table.HeadCell>
                                    <Table.HeadCell>Status</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {this.state.tasks.map(row => (
                                        <Table.Row key={row.id}>
                                            <Table.Cell>{row.worker_id}</Table.Cell>
                                            <Table.Cell>{row.state}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </ColumnLayout.Column>
                        <ColumnLayout.Column span={8}>
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
                        </ColumnLayout.Column>
                    </ColumnLayout.Row>
            </ColumnLayout>
        </div>
        );
    }
}

export default ConnectorInfo;
