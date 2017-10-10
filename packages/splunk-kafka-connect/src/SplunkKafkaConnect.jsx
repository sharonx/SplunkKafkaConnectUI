import React, { Component } from 'react';
import * as _ from 'lodash'
import Button from '@splunk/react-ui/Button';
import urls from './urls';
import KafkaConnectors from './components/KafkaConnectors';
import css from './SplunkKafkaConnect.css';

class SplunkKafkaConnect extends Component {
    constructor(props) {
        super(props);
        const connectors = [];
        this.state = { connectors };
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

    render() {
        return (
            <div className={css.container}>
                <Button
                    label="Create New"
                    appearance="primary"
                    onClick={() => {
                        //to do
                    }}
                />
                <KafkaConnectors connectors={this.state.connectors} />
            </div>
        );
    }
}

export default SplunkKafkaConnect;
