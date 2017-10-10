import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash'
import Code from '@splunk/react-ui/Code';
import Table from '@splunk/react-ui/Table';
import urls from './urls';
import css from './ConnectorInfo.css';

class ConnectorInfo extends Component {
    static propTypes = {
        match: PropTypes.object,
    };

    constructor(props) {
        super(props)
        this.name = this.props.match.params.name;
        const tasks = [];
        const config = {};
        this.state = {tasks, config};

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
                this.setState({ config: jsonArray[0].config });
                this.setState({ tasks: jsonArray[1].tasks });
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
                <Code value={JSON.stringify(this.state.config, null, 4)} />
        </div>
        );
    }
}

export default ConnectorInfo;
