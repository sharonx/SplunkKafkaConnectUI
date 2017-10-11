import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@splunk/react-ui/Table';
import Pause from '@splunk/react-icons/Pause';
import Refresh from '@splunk/react-icons/Refresh';
import Play from '@splunk/react-icons/Play';
import Trash from '@splunk/react-icons/Trash';
import Button from '@splunk/react-ui/Button';
import Tooltip from '@splunk/react-ui/Tooltip';
import urls from '../urls';
import css from './KafkaConnectors.css';

class KafkaConnectors extends Component {
    static propTypes = {
        connectors: PropTypes.array,
        refresh: PropTypes.func
    };

    handlerClick = (e, data) => {
        window.location.href = `#/connector/${data}`
    };

    handlePause = (e, {value}) => {
        const url = `${urls.baseUrl}${urls.connectors}/${value}/pause`
        fetch(url, {
            method: 'put'
        }).then(res => {
            if (res.ok) {
                this.props.refresh();
            }
        }).catch(error => {
            console.error(error.message);
        })
    };

    handleResume = (e, {value}) => {
        const url = `${urls.baseUrl}${urls.connectors}/${value}/resume`
        fetch(url, {
            method: 'put'
        }).then(res => {
            if (res.ok) {
                this.props.refresh();
            }
        }).catch(error => {
            console.error(error.message);
        })
    };

    handleRestart = (e, {value}) => {
        const url = `${urls.baseUrl}${urls.connectors}/${value}/restart`
        fetch(url, {
            method: 'post'
        }).then(res => {
            if (res.ok) {
                this.props.refresh();
            }
        }).catch(error => {
            console.error(error.message);
        })
    };

    handleDelete = (e, {value}) => {
        const url = `${urls.baseUrl}${urls.connectors}/${value}`
        fetch(url, {
            method: 'delete'
        }).then(res => {
            if (res.ok) {
                this.props.refresh();
            }
        }).catch(error => {
            console.error(error.message);
        })
    };

    render() {
        const tooltipStyle = {
            marginRight: '5px'
        }
        return (
            <div className={css.container}>
                <Table stripeRows>
                    <Table.Head>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Connection</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {this.props.connectors.map(row => (
                            <Table.Row key={row.name}>
                                <Table.Cell onClick={this.handlerClick} data={row.name}>{row.name}</Table.Cell>
                                <Table.Cell>{row.numTasks}</Table.Cell>
                                <Table.Cell>{row.status}</Table.Cell>
                                <Table.Cell>
                                    {
                                        row.status === 'RUNNING'?
                                        <Tooltip style={tooltipStyle} content="Pause">
                                            <Button size="small" value={row.name} icon={<Pause />} onClick={this.handlePause}/>
                                        </Tooltip> :
                                        <Tooltip style={tooltipStyle} content="Resume">
                                            <Button size="small" value={row.name} icon={<Play />} onClick={this.handleResume}/>
                                        </Tooltip>
                                    }
                                    <Tooltip style={tooltipStyle} content="Restart">
                                        <Button size="small" value={row.name} icon={<Refresh />} onClick={this.handleRestart} />
                                    </Tooltip>
                                    <Tooltip style={tooltipStyle} content="Delete">
                                        <Button error size="small" value={row.name} icon={<Trash />} onClick={this.handleDelete}/>
                                    </Tooltip>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default KafkaConnectors;

