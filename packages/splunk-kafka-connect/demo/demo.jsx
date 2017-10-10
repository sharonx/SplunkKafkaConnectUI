import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import SplunkKafkaConnect from '../src/SplunkKafkaConnect';

const containerEl = document.getElementById('main-component-container');
class Home extends Component {
    render() {
        return (<SplunkKafkaConnect />);
    }
};


render(
    <BrowserRouter>
        <Route path="/" component={Home}/>
    </BrowserRouter>,
    document.getElementById('main-component-container')
);