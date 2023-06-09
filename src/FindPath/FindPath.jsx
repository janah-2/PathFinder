import React, { Component } from 'react';
import Node from './Node/Node';
import './FindPath.css';
import { dijkstras, getShortestPathNodes } from '../algorithms/Dijkstra\'s';
import { breadthFirstSearch, getPathNodes } from '../algorithms/BFS';
import { depthFirstSearch } from '../algorithms/DFS';
import { aStar } from '../algorithms/A*';

var START_ROW = 2;
var START_COLUMN = 12;
var FINISH_ROW = 20;
var FINISH_COLUMN = 55;
var tutorialNum = 0;
var dijkstrasRan = 0;
var bfsRan = 0;
var dfsRan = 0;
var aStarRan = 0;

var visitedNodesBfs;
var visitedNodesDfs;
var visitedNodesDijkstra;
var visitedNodesAStar;

var shortestPathBfs;
var shortestPathDfs;
var shortestPathDijkstra;
var shortestPathAStar;

var wallsRows = [];
var wallsColumns = [];

class FindPath extends Component {
    constructor(props) {
        super(props);
        this.animationTimeouts = []; // Initialize animationTimeouts as an empty array
        this.state = {
            grid: [], // State property to store the nodes
            mouseIsPressed : false,
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, column) {
        const index = wallsRows.findIndex((r, i) => r === row && wallsColumns[i] === column);

        if (index > -1) {
            // Both row and column exist at the same index, remove them
            wallsRows.splice(index, 1);
            wallsColumns.splice(index, 1);
        } else {
            // Either row or column (or both) don't exist, add them
            wallsRows.push(row);
            wallsColumns.push(column);
        }

        const newGrid = getNewGrid(this.state.grid, row, column);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, column) {
        if (!this.state.mouseIsPressed) return; // we only want the walls to be drawn when we are currently pressed on the mouse and drag
        const index = wallsRows.findIndex((r, i) => r === row && wallsColumns[i] === column);

        if (index > -1) {
            // Both row and column exist at the same index, remove them
            wallsRows.splice(index, 1);
            wallsColumns.splice(index, 1);
        } else {
            // Either row or column (or both) don't exist, add them
            wallsRows.push(row);
            wallsColumns.push(column);
        }
        const newGrid = getNewGrid(this.state.grid, row, column);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed : false}); // no longer pressed on mouse up, so set to false
    }

    animateAlgorithm(visitedNodes, nodesInShortestPath) {
        // Clear any existing timeouts
        this.clearAnimationTimeouts();
    
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
                const shortestPathTimeout = setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPath);
                }, 10 * i);
                this.animationTimeouts.push(shortestPathTimeout);
                return;
            }
            const visitedNodeTimeout = setTimeout(() => {
                const node = visitedNodes[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-visited';
                document.getElementById(`node-${START_ROW}-${START_COLUMN}`).classList.add("node-start");
                document.getElementById(`node-${FINISH_ROW}-${FINISH_COLUMN}`).classList.add("node-finish");
            }, 10 * i);
            this.animationTimeouts.push(visitedNodeTimeout);
        }
    }
    
    // Add a clearAnimationTimeouts function to clear the timeouts
    clearAnimationTimeouts() {
        for (const timeout of this.animationTimeouts) {
            clearTimeout(timeout);
        }
        this.animationTimeouts = [];
    }

    animateShortestPath(nodesInShortestPath) {
        for (let i = 0; i < nodesInShortestPath.length; i++) {
            const timeout = setTimeout(() => {
                const node = nodesInShortestPath[i];
                document.getElementById(`node-${node.row}-${node.column}`).className = 'node node-shortest-path';
                document.getElementById(`node-${START_ROW}-${START_COLUMN}`).classList.add("node-start");
                document.getElementById(`node-${FINISH_ROW}-${FINISH_COLUMN}`).classList.add("node-finish");
            }, 60 * i);
            this.animationTimeouts.push(timeout);
        }
    }

    visualizeDijkstra() {
        this.clearPath();
        dijkstrasRan = 1;
        const {grid} = this.state;
        const startNode = grid[START_ROW][START_COLUMN];
        const endNode = grid[FINISH_ROW][FINISH_COLUMN];
        const visitedNodes = dijkstras(grid, startNode, endNode);
        visitedNodesDijkstra = visitedNodes;
        const nodesInShortestPath = getShortestPathNodes(endNode);
        shortestPathDijkstra = nodesInShortestPath;
        this.animateAlgorithm(visitedNodes, nodesInShortestPath);
    }

    visualizeBFS() {
        this.clearPath();
        bfsRan = 1;
        const { grid } = this.state;
        const startNode = grid[START_ROW][START_COLUMN];
        const endNode = grid[FINISH_ROW][FINISH_COLUMN];
        const visitedNodes = breadthFirstSearch(grid, startNode, endNode);
        visitedNodesBfs = visitedNodes;
        const nodesInPath = getPathNodes(endNode);
        shortestPathBfs = nodesInPath;
        this.animateAlgorithm(visitedNodes, nodesInPath);
    }

    visualizeDFS() {
        this.clearPath();
        dfsRan = 1;
        const { grid } = this.state;
        const startNode = grid[START_ROW][START_COLUMN];
        const endNode = grid[FINISH_ROW][FINISH_COLUMN];
        const visitedNodes = depthFirstSearch(grid, startNode, endNode);
        visitedNodesDfs = visitedNodes;
        const nodesInPath = getPathNodes(endNode);
        shortestPathDfs = nodesInPath;
        this.animateAlgorithm(visitedNodes, nodesInPath);
    }

    visualizeAStar() {
        this.clearPath();
        aStarRan = 1;
        const { grid } = this.state;
        const startNode = grid[START_ROW][START_COLUMN];
        const endNode = grid[FINISH_ROW][FINISH_COLUMN];
        const visitedNodes = aStar(grid, startNode, endNode);
        visitedNodesAStar = visitedNodes;
        const nodesInPath = getPathNodes(endNode);
        shortestPathAStar = nodesInPath;
        this.animateAlgorithm(visitedNodes, nodesInPath);
    }

    clearPath() {
        this.clearAnimationTimeouts();
        document.getElementById(`node-${START_ROW}-${START_COLUMN}`).classList.add("node-start");
        document.getElementById(`node-${FINISH_ROW}-${FINISH_COLUMN}`).classList.add("node-finish");
        if (aStarRan == 1) {
            console.log("clearing a*!");
            console.log(shortestPathAStar);
            for (let j = 0; j < shortestPathAStar.length; j++) {
                const node = shortestPathAStar[j];
                if (document.getElementById(`node-${node.row}-${node.column}`).classList.contains('node-shortest-path')) {
                    document.getElementById(`node-${node.row}-${node.column}`).classList.remove('node-shortest-path');
                    document.getElementById((`node-${node.row}-${node.column}`)).isVisited = false;
                }
            }
            console.log(visitedNodesAStar);
            for (let i = 0; i < visitedNodesAStar.length; i++) {
                const visitedNode = visitedNodesAStar[i];
                if (document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.contains("node-visited")) {
                    document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.remove("node-visited")
                    document.getElementById((`node-${visitedNode.row}-${visitedNode.column}`)).isVisited = false;
                }
            }
            aStarRan = 0;
        }

        if (dfsRan == 1) {
            console.log("clearing dfs!");
            console.log(shortestPathDfs);
            for (let j = 0; j < shortestPathDfs.length; j++) {
                const node = shortestPathDfs[j];
                if (document.getElementById(`node-${node.row}-${node.column}`).classList.contains('node-shortest-path')) {
                    document.getElementById(`node-${node.row}-${node.column}`).classList.remove('node-shortest-path');
                    document.getElementById((`node-${node.row}-${node.column}`)).isVisited = false;
                }
            }
            console.log(visitedNodesDfs);
            for (let i = 0; i < visitedNodesDfs.length; i++) {
                const visitedNode = visitedNodesDfs[i];
                if (document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.contains("node-visited")) {
                    document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.remove("node-visited")
                    document.getElementById((`node-${visitedNode.row}-${visitedNode.column}`)).isVisited = false;
                }
            }
            dfsRan = 0;
        }

        if (bfsRan == 1) {
            console.log("clearing bfs!");
            console.log(shortestPathBfs);
            for (let j = 0; j < shortestPathBfs.length; j++) {
                const node = shortestPathBfs[j];
                if (document.getElementById(`node-${node.row}-${node.column}`).classList.contains('node-shortest-path')) {
                    document.getElementById(`node-${node.row}-${node.column}`).classList.remove('node-shortest-path');
                    document.getElementById((`node-${node.row}-${node.column}`)).isVisited = false;
                }
            }
            console.log(visitedNodesBfs);
            for (let i = 0; i < visitedNodesBfs.length; i++) {
                const visitedNode = visitedNodesBfs[i];
                if (document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.contains("node-visited")) {
                    document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.remove("node-visited");
                    document.getElementById((`node-${visitedNode.row}-${visitedNode.column}`)).isVisited = false;
                }
            }
            bfsRan = 0;
        }

        if (dijkstrasRan == 1) {
            console.log("clearing dijkstras!");
            console.log(shortestPathDijkstra);
            for (let j = 0; j < shortestPathDijkstra.length; j++) {
                const node = shortestPathDijkstra[j];
                if (document.getElementById(`node-${node.row}-${node.column}`).classList.contains('node-shortest-path')) {
                    document.getElementById(`node-${node.row}-${node.column}`).classList.remove('node-shortest-path');
                    document.getElementById((`node-${node.row}-${node.column}`)).isVisited = false;
                }
            }
            console.log(visitedNodesDijkstra);
            for (let i = 0; i < visitedNodesDijkstra.length; i++) {
                const visitedNode = visitedNodesDijkstra[i];
                if (document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.contains("node-visited")) {
                    document.getElementById(`node-${visitedNode.row}-${visitedNode.column}`).classList.remove("node-visited");
                    document.getElementById((`node-${visitedNode.row}-${visitedNode.column}`)).isVisited = false;
                }
            }
            dijkstrasRan = 0;
        }
        const grid = getGridAfterReset();
        this.setState({grid});
    }

    resetBoard() {
        this.clearPath();
        const grid = getInitialGrid();
        this.setState({grid});
    }

    changeStarting() {
        var starting_x = document.getElementById("starting-x").value;
        var starting_y = document.getElementById("starting-y").value;

        if (starting_x == "") {
            starting_x = START_COLUMN;
        }

        if (starting_y == "") {
            starting_y = START_ROW;
        }

        if (starting_x == FINISH_COLUMN && starting_y == FINISH_ROW) {
            alert("Please input a different starting and ending points");
            return;
        }

        if ((isNaN(starting_x)) || (isNaN(starting_y)) || (starting_x < 0 || starting_x > 60) || (starting_y < 0 || starting_y > 23)) {
            alert("Please enter a number between 0 and 60 for x and a number between 0 to 23 for y");
            let input_x = document.getElementById('starting-x');
            let input_y = document.getElementById('starting-y');
            input_x.value = "";
            input_y.value = "";
            return;
        }

        START_COLUMN = starting_x;
        START_ROW = starting_y;
        var elems = document.querySelectorAll(".node-start");

        [].forEach.call(elems, function(el) {
            el.classList.remove("node-start");
        });

        document.getElementById(`node-${START_ROW}-${START_COLUMN}`).classList.add("node-start");
        document.getElementById(`node-${START_ROW}-${START_COLUMN}`).isStart = true;

        let input_x = document.getElementById('starting-x');
        let input_y = document.getElementById('starting-y');
        input_x.value = "";
        input_y.value = "";
    }

    changeEnding() {
        var ending_x = document.getElementById("ending-x").value;
        var ending_y = document.getElementById("ending-y").value;

        if (ending_x == "") {
            ending_x = FINISH_COLUMN;
        }

        if (ending_y == "") {
            ending_y = FINISH_ROW;
        }

        if (ending_x == START_COLUMN && ending_y == START_ROW) {
            alert("Please input a different starting and ending points");
            return;
        }

        if ((isNaN(ending_x)) || (isNaN(ending_y)) || (ending_x < 0 || ending_x > 60) || (ending_y < 0 || ending_y > 23)) {
            alert("Please enter a number between 0 and 60 for x and a number between 0 to 23 for y");
            let input_x = document.getElementById('ending-x');
            let input_y = document.getElementById('ending-y');
            input_x.value = "";
            input_y.value = "";
            return;
        }

        FINISH_ROW = ending_y;
        FINISH_COLUMN = ending_x;

        var elems = document.querySelectorAll(".node-finish");

        [].forEach.call(elems, function(el) {
            el.classList.remove("node-finish");
        });

        document.getElementById(`node-${FINISH_ROW}-${FINISH_COLUMN}`).classList.add("node-finish");

        let input_x = document.getElementById('ending-x');
        let input_y = document.getElementById('ending-y');
        input_x.value = "";
        input_y.value = "";
    }

    openModal() {
        var modal = document.getElementById("modal");
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    closeModal() {
        document.getElementById("modal-content1").classList.remove("hide");
        document.getElementById("modal-content2").classList.add("hide");
        document.getElementById("modal-content3").classList.add("hide");
        document.getElementById("modal-content4").classList.add("hide");
        document.getElementById("modal-content5").classList.add("hide");
        tutorialNum = 0;
        var modal = document.getElementById("modal");
        modal.style.display = "none";
    }

    nextTutorial() {
        tutorialNum++;
        console.log(tutorialNum);
        if (tutorialNum == 1) {
            document.getElementById("modal-content1").classList.add("hide");
            document.getElementById("modal-content2").classList.remove("hide");
        } else if (tutorialNum == 2) {
            document.getElementById("modal-content2").classList.add("hide");
            document.getElementById("modal-content3").classList.remove("hide");
        } else if (tutorialNum == 3) {
            document.getElementById("modal-content3").classList.add("hide");
            document.getElementById("modal-content4").classList.remove("hide");
        } else {
            document.getElementById("modal-content4").classList.add("hide");
            document.getElementById("modal-content5").classList.remove("hide");
        }
    }

    previousTutorial() {
        tutorialNum--;
        console.log(tutorialNum);
        if (tutorialNum == 0) {
            document.getElementById("modal-content1").classList.remove("hide");
            document.getElementById("modal-content2").classList.add("hide");
        } else if (tutorialNum == 1) {
            document.getElementById("modal-content2").classList.remove("hide");
            document.getElementById("modal-content3").classList.add("hide");
        } else if (tutorialNum == 2) {
            document.getElementById("modal-content3").classList.remove("hide");
            document.getElementById("modal-content4").classList.add("hide");
        } else {
            document.getElementById("modal-content4").classList.remove("hide");
            document.getElementById("modal-content5").classList.add("hide");
        }
    }

    render() {
        const { grid, mouseIsPressed } = this.state; // Extract nodes from the state
        return (
            <div>
                {/* the navbar */}
                <div id='nav'>
                    <ul>
                        <li><a className="center" href="#" onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's</a></li>
                        <li><a className="active" href="#" onClick={() => this.visualizeAStar()}>Visualize A*</a></li>
                        <li><a className="active" href="#" onClick={() => this.visualizeBFS()}>Visualize Breadth-first</a></li>
                        <li><a className="active" href="#" onClick={() => this.visualizeDFS()}>Visualize Depth-first</a></li>
                        <li><a className="active" href="#" onClick={() => this.resetBoard()}>Reset Board</a></li>
                        <li><a className="active" href="#" onClick={() => this.clearPath()}>Clear Path</a></li>
                        <li><a className="active" href="#" onClick={() => this.openModal()}>Tutorial</a></li>
                    </ul>
                </div>

                {/* key */}
                <ul id='keys'>
                    <li><div className="start"></div>Start</li>
                    <li><div className="target"></div>Target</li>
                    <li><div className="visited"></div>Visited</li>
                    <li><div className="shortest-path"></div>Shortest Path</li>
                    <li><div className="wall"></div>Wall</li>
                </ul>

                <div id='start-and-end'>
                    {/* Enter starting and ending points */}
                    <b>You can change the starting and ending points here:</b>
                    <label for="starting">Starting Point (x): </label>
                    <input className="changeStartingInputBox" type="text" id="starting-x" name="starting"></input>
                    <label for="starting">Starting Point (y): </label>
                    <input className="changeStartingInputBox" type="text" id="starting-y" name="starting"></input>
                    <input className="changeStartingButton" type="submit" value="Change starting point" onClick={this.changeStarting}></input>


                    <label for="ending">Ending Point (x): </label>
                    <input className="changeEndingInputBox" type="text" id="ending-x" name="ending"></input>
                    <label for="ending">Ending Point (y): </label>
                    <input className="changeEndingInputBox" type="text" id="ending-y" name="ending"></input>
                    <input className="changeEndingButton" type="submit" value="Change ending point" onClick={this.changeEnding}></input>
                </div>

                {/* The Modal */}
                <div id="modal" className="modal">

                {/* Modal content */}
                <div id='modal-content1' className="modal-content1">
                    <span className="close" onClick={this.closeModal}>&times;</span>
                    <h1>Welcome to my Pathfinding Visualizer!</h1>
                    <p><b>By Janah Abu Hassan.</b></p>
                    <p>This short tutorial will walk you through the features of this visualizer.</p>
                    <p>You can also click the "Skip Tutorial" button to start using it at any time.</p>
                    <p>Click next to continue the tutorial.</p>
                    <button className="closeModalButton" onClick={this.closeModal}>Skip Tutorial</button>
                    <button className="nextModalButton" onClick={this.nextTutorial}>Next</button>
                </div>

                <div id='modal-content2' className="modal-content2 hide">
                    <span className="close" onClick={this.closeModal}>&times;</span>
                    <h1>The Algorithms</h1>
                    <p><b>Dijkstra's:</b> Finds the shortest path from a source node to all other nodes in a weighted graph, considering the weight of each edge.</p>
                    <p><b>A*:</b> A heuristic search algorithm that finds the shortest path from a source node to a destination node in a graph, using both the cost to reach the current node and an estimated cost to reach the destination.</p>
                    <p><b>Breadth-first:</b> Explores all the vertices of a graph in breadth-first order, visiting neighbors before deeper nodes.</p>
                    <p><b>Depth-first:</b> Explores as far as possible along each branch before backtracking, visiting deeper nodes before neighbors.</p>
                    <button className="closeModalButton" onClick={this.closeModal}>Skip Tutorial</button>
                    <button className="previousModalButton" onClick={this.previousTutorial}>Previous</button>
                    <button className="nextModalButton" onClick={this.nextTutorial}>Next</button>
                </div>

                <div id='modal-content3' className="modal-content3 hide">
                <span className="close" onClick={this.closeModal}>&times;</span>
                    <h1>Adding walls</h1>
                    <p>You can add walls by simply clicking and dragging on the grid.</p>
                    <p>Walls cannot be penetrated, and the path would have to find a way to the destination without passing through the wall.</p>
                    <div className="walls"></div>
                    <button className="closeModalButton" onClick={this.closeModal}>Skip Tutorial</button>
                    <button className="previousModalButton" onClick={this.previousTutorial}>Previous</button>
                    <button className="nextModalButton" onClick={this.nextTutorial}>Next</button>
                </div>

                <div id='modal-content4' className="modal-content4 hide">
                <span className="close" onClick={this.closeModal}>&times;</span>
                    <h1>Changing Starting and Ending Positions</h1>
                    <p>You can change the positions by entering the starting and ending points (x from 0 to 60, and y from 0 to 23).</p>
                    <p>Enter them in the following boxes once the visualizer starts.</p>
                    <p>If you leave a box blank, or if you don't change the location, it will default to 12,2 for the starting and 55,20 for the ending point.</p>
                    <div className="change_start_and_end_image"></div>
                    <button className="closeModalButton" onClick={this.closeModal}>Skip Tutorial</button>
                    <button className="previousModalButton" onClick={this.previousTutorial}>Previous</button>
                    <button className="nextModalButton" onClick={this.nextTutorial}>Next</button>
                </div>

                <div id='modal-content5' className="modal-content5 hide">
                <span className="close" onClick={this.closeModal}>&times;</span>
                    <h1>Visualize</h1>
                    <p>You can visualize different algorithms by clicking the Visualize button for the algorithm. You can also reset the board, clear the path (which keeps the walls on the grid), and open this tutorial again.</p>
                    <div className="menu"></div>
                    <p>Now that you know how to use this visualizer, click the start button below to start!</p>
                    <button className="previousModalButton" onClick={this.previousTutorial}>Previous</button>
                    <button className="closeModalButton" onClick={this.closeModal}>Start!</button>
                </div>

                </div>

                {/* Welcome message */}
                <p className="welcome">Use the buttons on top of the page to visualize different algorithms. Click the <b><i>"Tutorial"</i></b> button at the top right of the page
                to learn how to use the visualizer.</p>

                <div className='grid'>
                    {grid.map((row, rowIdx) => { // Map over the rows
                        return (
                            <div className='grid-row' key={rowIdx}> {/* Set key prop with rowIdx for each row */}
                                {row.map((node, nodeIdx) => { // Map over the nodes in each row
                                    const { isStart, isFinish, isVisited, isWall, row, column } = node; // Extract variables from the node
                                    return (
                                        <Node
                                            key={nodeIdx} // Set key prop with nodeIdx for each node
                                            isStart={isStart} // Pass the isStart prop to the Node component
                                            isFinish={isFinish} // Pass the isFinish prop to the Node component
                                            isVisited = {isVisited}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => this.handleMouseUp()}
                                            column={column}
                                            row={row}>
                                        </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const getGridAfterReset = () => {
    const grid = [];
    for (let row = 0; row < 24; row++) {
        const currentRow = [];
        for (let column = 0; column < 61; column++) {
            const node = createNode(column, row);
            currentRow.push(node);
        }
        grid.push(currentRow);
    }

    // Add walls based on wallsRows and wallsColumns arrays
    for (let i = 0; i < wallsRows.length; i++) {
        const row = wallsRows[i];
        const column = wallsColumns[i];
        grid[row][column].isWall = true;
    }

    return grid;
}


const getInitialGrid = () => {
    const grid = [];
    wallsRows = [];
    wallsColumns = [];
    for (let row = 0; row < 24; row++) {
        const currentRow = [];
        for (let column = 0; column < 61; column++) {
            const node = createNode(column, row);
            currentRow.push(node);
        }
        grid.push(currentRow);
    }
    return grid;
}

const createNode = (column, row) => {
    return {
        column,
        row,
        isStart: row === START_ROW && column === START_COLUMN,
        isFinish: row === FINISH_ROW && column === FINISH_COLUMN,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    }
}

// updates new grid with walls toggled
const getNewGrid = (grid, row, column) => {
    const newGrid = grid.slice();
    const node = newGrid[row][column];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][column] = newNode; // replaces new grid at that location with that new node (walls toggled on or off)
    return newGrid;
}

export default FindPath;