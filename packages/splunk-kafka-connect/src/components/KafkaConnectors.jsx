import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@splunk/react-ui/Table';
import { Link } from 'react-router-dom';
import css from './KafkaConnectors.css';

class KafkaConnectors extends Component {
    static propTypes = {
        connectors: PropTypes.array,
    };

    handlerClick = (e, data) => {
        window.location.href = `#/connector/${data}`
    };

    render() {
        return (
            <div className={css.container}>
                <Link to="/connector">Click </Link>
                <Table stripeRows>
                    <Table.Head>
                        <Table.HeadCell>Name</Table.HeadCell>
                        {<Table.HeadCell>Status</Table.HeadCell>}
                        {<Table.HeadCell>Connection</Table.HeadCell>}
                    </Table.Head>
                    <Table.Body>
                        {this.props.connectors.map(row => (
                            <Table.Row key={row.name}>
                                <Table.Cell onClick={this.handlerClick} data={row.name}>{row.name}</Table.Cell>
                                <Table.Cell>{row.status}</Table.Cell>
                                <Table.Cell>{row.numTasks}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default KafkaConnectors;

