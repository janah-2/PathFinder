// Algorithm for Breadth-First Search path finding algorithm

export function breadthFirstSearch(grid, startNode, endNode) {
    const visitedNodes = [];
    const queue = [startNode];

    while (queue.length) {
        const currentNode = queue.shift();

        // if the node is a wall, skip it and do not count as a path
        if (currentNode.isWall) continue;

        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        if (currentNode === endNode) {
            return visitedNodes;
        }

        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            queue.push(neighbor);
        }

        // Sort the queue to explore nodes in a breadth-first manner
        sortNodes(queue);
    }
    // If there is no path to the end node (i.e., end node is trapped), return visitedNodes
    return visitedNodes;
}

// Helper function to sort the nodes based on their order of insertion
function sortNodes(nodes) {
    nodes.sort((nodeA, nodeB) => nodeA.order - nodeB.order);
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

export function getPathNodes(endNode) {
    const nodesInPath = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        nodesInPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInPath;
}