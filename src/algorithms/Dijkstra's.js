// Algorithm for Dijkstra's path finding algorithm

// I get a node, mark it as visited, then update its neighboring nodes
export function dijkstras(grid, startNode, endNode) {
    const visitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid); // this is the priority queue of unvisited nodes

    while (unvisitedNodes.length) {
        sortNodes(unvisitedNodes); // sorted each iteration to emulate a priority queue
        const closestNode = unvisitedNodes.shift(); // closest node is the node with least distance (head of priority queue)
        
        // if the node is a wall, skip it and do not count as path
        if (closestNode.isWall) continue;

        // if there is no closest node (because trapped in walls), return visitedNodes, so it ends simulation if trapped
        if (closestNode.distance === Infinity) return visitedNodes;

        closestNode.isVisited = true;

        visitedNodes.push(closestNode);
        if (closestNode === endNode) {
            return visitedNodes;
        }
        updateUnvisitedNeighbors(closestNode, grid);
    }
}

function getAllNodes(grid) {
    const nodes = []
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function sortNodes(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {column, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][column]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][column]);
    if (column > 0) neighbors.push(grid[row][column - 1]);
    if (column < grid[0].length - 1) neighbors.push(grid[row][column + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// gets node in order of shortest path
export function getShortestPathNodes(endNode) {
    const nodesInShortestPath = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        nodesInShortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPath;
}