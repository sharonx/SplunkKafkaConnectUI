import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColumnLayout from '@splunk/react-ui/ColumnLayout';
import Table from '@splunk/react-ui/Table';
import urls from './urls';
import ConfigurationBox from './components/ConfigurationBox';


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

        const connectorStatusUrl = `${urls.baseUrl}${urls.connectors}/${this.name}/status`;

        fetch(connectorStatusUrl)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error('Cannot get connector status');
            }).then(res => {
                this.setState({ tasks: res.tasks });
            }).catch(err => {
                console.error(`Problems with fetching connectors: ${this.name}. \nErrors: ${err.message}`);
            });
    }

    render() {
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
                            <ConfigurationBox name={this.name} isNew={false}/>
                        </ColumnLayout.Column>
                    </ColumnLayout.Row>
            </ColumnLayout>
        </div>
        );
    }
}

export default ConnectorInfo;
