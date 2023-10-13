/*
MOVEMENT TYPES
*/

function fallDownAndSlide() {

}

function fallDown(x, y) {
    move(x, y, x + 1, y)
}

/*
UTILITY FUNCTIONS
*/

function move(x, y, dx, dy) {
    let newX = x + dx;
    let newY = y + dy;
    let className = getCell(x, y).name;

    if (!inBounds(newX, newY)) return;

    grid[x][y].x = newX;
    grid[x][y].y = newY;
}

function clear(x, y) {
    setCell(x, y, null);
    setCell(x, y, "Air");
}

function getCell(x, y) {
    if (grid[x][y]) {
        return grid[x][y];
    }
}

function setCell(x, y, className) {
    let newElement = (Function('return new ' + className)) ();
    newElement.x = x;
    newElement.y = y;
    grid.setElement(x, y, newElement);
}

function inBounds(x, y) {
    if (x < numRows && x >= 0 && y < numCols && y >= 0) {
        return true;
    } else {
        return false;
    }
}