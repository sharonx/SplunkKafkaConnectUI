import React, { Component } from 'react';
import * as _ from 'lodash'
import urls from './urls';
import KafkaConnectors from './components/KafkaConnectors';
import css from './SplunkKafkaConnect.css';
import NewConnectorModal from './components/NewConnectorModal'

class SplunkKafkaConnect extends Component {
    constructor(props) {
        super(props);
        this.state = { connectors: [], open: false, plugins: [] };
        
        this.getConnectors();
    }

    getConnectors = () => {
        const connectors = [];
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
                promises.push(fetch(`${connectorsUrl}/${connector}`));
            })

            return Promise.all(promises);
        }).then(promises => {
            const resArray = [];
            _.each(promises, promise=> {
                resArray.push(promise.json());
            });

            return Promise.all(resArray);
        }).then(jsonArray => {
            const statusPromises = [];
            _.each(jsonArray, (connector) => {
                statusPromises.push(fetch(`${connectorsUrl}/${connector.name}/status`));
            })

            _.each(jsonArray, data => {
                const connector = {};
                connector.name = data.name;
                connector.numTasks = data.tasks.length;
                connectors.push(connector);
            });

            return Promise.all(statusPromises);

            // this.setState({connectors});
        }).then(promises => {
            const resArray = [];
            _.each(promises, promise=> {
                resArray.push(promise.json());
            });

            return Promise.all(resArray);
        }).then(jsonStatusArray => {

            _.each(connectors, connector => {
                const find = _.find(jsonStatusArray, connectorStatus => connector.name === connectorStatus.name);
                if (find) {
                    connector.status = find.connector.state;
                }
            });

            this.setState({connectors});
        }).catch(err => {
            console.error(`Problems with fetching connectors ${err.message}`);
        })
    }

    render() {
        return (
            <div className={css.container}>
                <h2>Kafka Connectors</h2>
                <NewConnectorModal refresh={this.getConnectors}/>
                <KafkaConnectors connectors={this.state.connectors} refresh={this.getConnectors}/>
            </div>
        );
    }
}

export default SplunkKafkaConnect;
