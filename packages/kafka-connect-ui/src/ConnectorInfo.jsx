import React, { Component } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import ColumnLayout from '@splunk/react-ui/ColumnLayout';
import Table from '@splunk/react-ui/Table';
import Button from '@splunk/react-ui/Button';
import Popover from '@splunk/react-ui/Popover';
import Question from '@splunk/react-icons/Question';
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
        this.state = {
            tasks,
            config,
            newConfig,
            showError: false,
            showMessage: false,
            open: {},
            anchor: {}
        };

        const connectorStatusUrl = `${urls.baseUrl}${urls.connectors}/${this.name}/status`;
        const connectorTasksUrl = `${urls.baseUrl}${urls.connectors}/${this.name}/tasks`;

        const promises = [fetch(connectorStatusUrl), fetch(connectorTasksUrl)];

        Promise.all(promises)
        .then(resPromises => {
            const resArray = [];
            _.each(resPromises, promise=> {
                resArray.push(promise.json());
            });

            return Promise.all(resArray);
        }).then(jsonArray => {
            // this.setState({ tasks: res.tasks });
            const tasksWithStatus = jsonArray[0].tasks;
            const allTasks = [];
            _.each(jsonArray[1], task => {
                allTasks.push({ id: task.id.task })
            });

            const generalStatus = jsonArray[0].connector.state;
            const generalWorkID = jsonArray[0].connector.worker_id;

            const newTasks = [];
            _.each(allTasks, task => {
                const find = _.find(tasksWithStatus, (taskWithStatus) =>  taskWithStatus.id === task.id);

                if (!find) {
                    newTasks.push({
                        id: task.id,
                        state: generalStatus,
                        worker_id: generalWorkID
                    });
                } else {
                    newTasks.push(find);
                }
            })
            const newOpen = {};
            _.each(allTasks, row => {
                newOpen[row.id] = false;
            });

            this.setState({ open: newOpen });
            this.setState({ tasks: newTasks });
        }).catch(err => {
            console.error(`Problems with fetching connectors: ${this.name}. \nErrors: ${err.message}`);
        });

        // fetch(connectorStatusUrl)
        //     .then(res => {
        //         if (res.ok) {
        //             return res.json();
        //         }

        //         throw new Error('Cannot get connector status');
        //     }).then(res => {
        //         this.setState({ tasks: res.tasks });

        //         const newOpen = {};
        //         _.each(res.tasks, row => {
        //             newOpen[row.id] = false;
        //         });

        //         this.setState({ open: newOpen });
        //     })
    }

    handleMount = component => {
        // make it work when click back button in browser
        if (!component) {
            return;
        }
        const newAnchor = this.state.anchor;
        newAnchor[component.props.value] = component;
        this.setState({
           anchor: newAnchor
        });
    };

    handleOpen = (e, { value }) => {
        const newOpen = this.state.open;
        newOpen[value] = true
        this.setState({
            open: newOpen,
        });
    };

    handleRequestClose = () => {
        const newOpen = this.state.open;
        _.each(newOpen, (value, key) => {
            newOpen[key] = false;
        });
        this.setState({
            open: newOpen,
        });
    };

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
                                    <Table.HeadCell>Worker ID</Table.HeadCell>
                                    <Table.HeadCell>Status</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {this.state.tasks.map(row => (
                                        <Table.Row key={row.id}>
                                            <Table.Cell>{row.worker_id}</Table.Cell>
                                            <Table.Cell>
                                            {row.state === 'FAILED'?
                                                    <div>{row.state}
                                                    <Button key={row.id} value={row.id} onClick={this.handleOpen} ref={this.handleMount} icon={<Question />} size="small" appearance="pill" >
                                                    <Popover
                                                        value={row.id}
                                                        open={this.state.open[row.id]}
                                                        anchor={this.state.anchor[row.id]}
                                                        onRequestClose={this.handleRequestClose}
                                                        appearance="dark"
                                                    >
                                                    <div style={{ padding: '20px', width: '300px', wordWrap: 'break-word'}}>{row.trace}</div>
                                                    </Popover>
                                                    </Button>
                                                </div>
                                                : <div>{row.state}</div>
                                            }
                                            </Table.Cell>
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
