export function aStar(grid, startNode, endNode) {
    const openSet = [startNode];
    const visitedNodes = [];

    startNode.gScore = 0;
    startNode.fScore = heuristic(startNode, endNode);

    while (openSet.length > 0) {
        let currentNode = openSet[0];
        let currentIndex = 0;

        // Find the node with the lowest fScore in the openSet
        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].fScore < currentNode.fScore) {
            currentNode = openSet[i];
            currentIndex = i;
            }
        }

        // Remove the currentNode from the openSet
        openSet.splice(currentIndex, 1);

        // Add currentNode to the visitedNodes
        visitedNodes.push(currentNode);

        // Check if currentNode is the endNode
        if (currentNode === endNode) {
            return visitedNodes;
        }

        // Get the neighbors of currentNode
        const neighbors = getNeighbors(currentNode, grid);

        for (const neighbor of neighbors) {
            // Skip if the neighbor is a wall or already visited
            if (neighbor.isWall || visitedNodes.includes(neighbor)) {
                continue;
            }

            const tentativeGScore = currentNode.gScore + 1;

            // Check if neighbor is already in the openSet
            const neighborIndex = openSet.indexOf(neighbor);
            if (neighborIndex !== -1) {
            // If the new path is worse, skip this neighbor
            if (tentativeGScore >= neighbor.gScore) {
                continue;
            }
            } else {
            // Add the neighbor to the openSet
            openSet.push(neighbor);
            }

            // Update neighbor's scores
            neighbor.previousNode = currentNode;
            neighbor.gScore = tentativeGScore;
            neighbor.fScore = neighbor.gScore + heuristic(neighbor, endNode);
        }
    }

    // If there is no path to the end node (i.e., end node is trapped), return visitedNodes
    return visitedNodes;
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { column, row } = node;

    if (row > 0) {
    neighbors.push(grid[row - 1][column]);
    }
    if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][column]);
    }
    if (column > 0) {
    neighbors.push(grid[row][column - 1]);
    }
    if (column < grid[0].length - 1) {
    neighbors.push(grid[row][column + 1]);
    }

    return neighbors;
}

function heuristic(nodeA, nodeB) {
    const dx = Math.abs(nodeA.column - nodeB.column);
    const dy = Math.abs(nodeA.row - nodeB.row);
    return dx + dy;
}
