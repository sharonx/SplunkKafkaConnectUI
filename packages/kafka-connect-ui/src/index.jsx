import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom'
import SplunkKafkaConnect from './SplunkKafkaConnect';
import ConnectorInfo from './ConnectorInfo';
import SplunkBanner from './components/SplunkBanner';

const containerEl = document.getElementById('main-component-container');

render(
    <div>
        <SplunkBanner />
        <HashRouter>
        <Switch>
            <Route exact path="/" component={SplunkKafkaConnect}/>
            <Route path="/connector/:name" component={ConnectorInfo}/>
        </Switch>
    </HashRouter>
    </div>,
    containerEl
);