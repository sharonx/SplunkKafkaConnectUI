import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom'
import SplunkKafkaConnect from '../src/SplunkKafkaConnect';
import ConnectorInfo from '../src/ConnectorInfo';

const containerEl = document.getElementById('main-component-container');
class Home extends Component {
    render() {
        return (<SplunkKafkaConnect />);
    }
};

class ConnectorPage extends Component {
    render() {
        return (<h1>Connector</h1>)
    }
}

render(
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/connector" component={ConnectorPage}/>
        </Switch>
    </HashRouter>,
    document.getElementById('main-component-container')
);