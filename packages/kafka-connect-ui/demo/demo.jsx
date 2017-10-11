import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom'
import SplunkKafkaConnect from '../src/SplunkKafkaConnect';
import ConnectorInfo from '../src/ConnectorInfo';

const containerEl = document.getElementById('main-component-container');

render(
    <HashRouter>
        <Switch>
            <Route exact path="/" component={SplunkKafkaConnect}/>
            <Route path="/connector/:name" component={ConnectorInfo}/>
        </Switch>
    </HashRouter>,
    containerEl
);