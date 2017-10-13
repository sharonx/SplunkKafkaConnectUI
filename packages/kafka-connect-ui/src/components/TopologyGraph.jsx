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
        let hasSink = false;
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

                if (node.type !== 'sink') {
                    nodes.push(node);
                } else {
                    hasSink = true;
                }
            });

            nodes.push({
                name: 'Kafka',
                color: 'grey'
            });

            const kafkaIndex = nodes.length - 1;

            const numSource = _.reduce(nodes, (sum, node)=> {
                if (node.type === 'source'){
                    sum += 1;
                }
                return sum;
            }, 0);

            nodes.forEach((node, idx) => {
                if (node.type === 'source') {
                    links.push({
                        source: idx,
                        target: kafkaIndex,
                        value: 10,
                        color: 'lightblue'
                    });
                }
            });

            if (hasSink) {
                nodes.push({
                    name: 'Splunk',
                    color: 'black'
                });

                const splunkIndex = nodes.length - 1;

                links.push({
                    source: kafkaIndex,
                    target: splunkIndex,
                    color: 'lightgreen',
                    value:  10 * numSource
                })
            }

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

