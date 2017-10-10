import React from 'react';
import { render } from 'react-dom';
import SplunkKafkaConnect from '../src/SplunkKafkaConnect';

const containerEl = document.getElementById('main-component-container');
render(<SplunkKafkaConnect name="World" />, containerEl);
