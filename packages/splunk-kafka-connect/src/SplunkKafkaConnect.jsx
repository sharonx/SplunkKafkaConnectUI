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
                <NewConnectorModal refresh={this.getConnectors}/>
                <KafkaConnectors connectors={this.state.connectors} refresh={this.getConnectors}/>
            </div>
        );
    }
}

export default SplunkKafkaConnect;
