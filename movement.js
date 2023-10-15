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

function checkForSwap(first, second) {
    if (first.state == "solid" && second.state == "liquid") {
        if (first.density > second.density) {
            return true;
        } else {
            return false;
        }
    }
}

function isFree(x, y) {
    if (grid.getElement(x, y).name == "Air") {
        return true;
    } else {
        return false;
    }
}

function clear(x, y) {
    setCell(x, y, null);
    setCell(x, y, "Air");
}

function getCell(x, y) {
    let cell = {
        x: grid.getElement(x, y).x,
        y: grid.getElement(x, y).x,
        name: grid.getElement(x, y).name,
        color: grid.getElement(x, y).color,
        density: grid.getElement(x, y).density
    }
    return cell;
}

function setCell(x, y, className, color) {
    let newElement = (Function('return new ' + className)) ();
    newElement.x = x;
    newElement.y = y;
    if (color) newElement.color = color;
    grid.setElement(x, y, newElement);
}

function inBounds(x, y) {
    if (x < numRows && x >= 0 && y < numCols && y >= 0) {
        return true;
    } else {
        return false;
    }
}