import React, { Component } from 'react';

import './Node.css'

export default class Node extends Component {
    render() {
        const {
            isFinish,
            isStart,
            isVisited,
            isWall,
            onMouseDown,
            onMouseUp,
            onMouseEnter,
            row,
            column,
        } = this.props;
        const secondClassName = isFinish
            ? 'node-finish' // Add 'node-finish' class if it is the finish node
            : isStart
            ? 'node-start' // Add 'node-start' class if it is the start node
            : isWall
            ? 'node-wall'
            : ''

        return (
            <div
                id={`node-${row}-${column}`}
                className={`node ${secondClassName}`}
                onMouseDown={() => onMouseDown(row, column)}
                onMouseEnter={() => onMouseEnter(row, column)}
                onMouseUp={() => onMouseUp()}></div>
            );
    }
}

export const DEFAULT_NODE = {
    row: 0,
    column: 0,
};
