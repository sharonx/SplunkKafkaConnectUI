import React, { Component } from 'react';
import { Sankey } from 'react-vis';
import Heading from '@splunk/react-ui/Heading';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import css from './TopologyGraph.css';
import "../../node_modules/react-vis/dist/style.css";


class TopologyGraph extends Component {
    static propTypes = {
        plugins: PropTypes.array,
        connectors: PropTypes.array,
    };
    constructor(props) {
        super(props);
        this.changed = false;
        this.state = {
            graph: {
                nodes: [],
                links: []
            }
        };
    }

    getValue() {
        let ret = {};
        const nodes = [];
        const links = [];
        if ((this.props.connectors || []).length && (this.props.plugins || []).length) {
            _.each(this.props.connectors, connector => {
                const node = {};
                node.name = connector.name;
                if (connector.status === 'RUNNING') {
                    node.color = 'green';
                } else {
                    node.color = 'yellow';
                }

                const find = _.find(this.props.plugins, plugin => plugin.class === connector.class);

                if (find) {
                    node.type = find.type;
                }
                nodes.push(node);
            });

            nodes.push({
                name: 'Kafka',
                color: 'grey'
            });

            // nodes.push({
            //     name: 'Splunk Sink',
            //     color: 'darkblue'
            // });

            nodes.push({
                name: 'Splunk',
                color: 'black'
            });


            const kafkaIndex = nodes.length - 2;
            let splunkSinkIndex;
            const splunkIndex = nodes.length - 1;

            nodes.forEach((node, idx) => {
                if (node.type === 'source') {
                    links.push({
                        source: idx,
                        target: kafkaIndex,
                        value: 10,
                        color: 'lightgreen'
                    });
                }
                else if (node.type === 'sink') {
                    splunkSinkIndex = idx;
                    links.push({
                        source: idx,
                        target: splunkIndex,
                        color: 'lightblue',
                        value: 10
                    });
                }
            });

            links.push({
                source: kafkaIndex,
                target: splunkSinkIndex,
                color: '#eee',
                value:  10
            })
            ret = {
                nodes,
                links,
            };
        }
        return ret;


    }

    render() {
        const { nodes, links } = this.getValue();
        return nodes && links ? (
            <div className={css.container}>
                <Heading level={3}>Data Flow Diagram</Heading>
                <Sankey
                    nodes={nodes}
                    links={links}
                    width={window.innerWidth - 60}
                    height={200}
                />
            </div>) : null;

    }
}

export default TopologyGraph;

