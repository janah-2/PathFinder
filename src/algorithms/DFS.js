export function depthFirstSearch(grid, startNode, endNode) {
    const visitedNodes = [];
    const stack = [startNode];

    while (stack.length) {
        const currentNode = stack.pop();

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
            stack.push(neighbor);
        }
    }

    // If there is no path to the end node (i.e., end node is trapped), return visitedNodes
    return visitedNodes;
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