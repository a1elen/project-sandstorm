const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gridSize = 8;
const numRows = 64;
const numCols = 64;

canvas.height = numCols * gridSize;
canvas.width = numRows * gridSize;

let selectedElement = 'Sand';
let cursorSize = 1;

let grid = new Grid(numRows, numCols, gridSize);

let isMouseDown = false;

/*
MAIN GAME LOOP
*/

function gameLoop() {
    update();
}

function update() {
    // Clean moved elements
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid.getElement(i, j)) grid.getElement(i, j).moved = false;
        }
    }

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid.getElement(i, j) && grid.getElement(i, j).moved == false) {
                grid.getElement(i, j).update();
            }
        }
    }

    onMouseDown();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redraw
    grid.draw(ctx);
    if (hoveredCell) {
        ctx.strokeStyle = "white";
        ctx.strokeRect(hoveredCell[0] * 8, hoveredCell[1] * 8, 8*cursorSize, 8*cursorSize, 8);
    }

    
}

/*
CONTROLS
*/

document.getElementById("element").addEventListener("change", (e) => {
    selectedElement = e.target.value;
})

document.getElementById("range").addEventListener("change", (e) => {
    cursorSize = e.target.value;
})

let hoveredCell = null;

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
})

canvas.addEventListener('mouseup', (e) => {
    isMouseDown = false;
})

function onMouseDown() {
    if (isMouseDown) {
        for (let i = 0; i < cursorSize; i++) {
            for (let j = 0; j < cursorSize; j++) {
                if (isFree(hoveredCell[1] + i, hoveredCell[0] + j)) {
                    console.log(i + " + " + j)
                    setCell(hoveredCell[1] + i, hoveredCell[0] + j, selectedElement);
                }
            }
        }  
    }
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    let row = Math.floor(mouseY / gridSize)
    let col = Math.floor(mouseX / gridSize)
    
    hoveredCell = [col, row];
    
    if (!inBounds(hoveredCell[0], hoveredCell[1])) {
        hoveredCell = null;
        isMouseDown = false;
    }

});

/*
SHIT CODE
*/

/*
function spawnSmoke(x, y) {
    let newCell = checkNeighboursType(getNeighbours(x, y), "air")
    if (newCell) {
        place(newCell.x, newCell.y, new Element(x - 1, y, "smoke", getColor("smoke")));
    }
}
function checkState(x, y) {
    if (grid.getElement(x, y)) {
        return grid.getElement(x, y).state;
    }
}

function swap(x1, y1, x2, y2,) {
    let element1 = grid.getElement(x1, y1);
    let element2 = grid.getElement(x2, y2);

    clear(x1, y1);
    clear(x2, y2);

    grid.setElement(x1, y1, element2);
    grid.setElement(x2, y2, element1);
    
    grid.getElement(x1, y1).moved = true;
    grid.getElement(x2, y2).moved = true;
}

function checkDown(i, j) {
    if (!checkOccupied(i + 1, j)) {
        return true;
    } else {
        return false;
    }
}

function moveSideways(i, j) {
    if (Math.random() > 0.5) {
        if (!checkOccupied(i, j + 1) ) {
            move(i, j, 0, 1);
        }
    } else {
        if (!checkOccupied(i, j - 1) ) {
            move(i, j, 0, -1);
        }
    }
}

function moveDown(x, y) {
    if (!move(x, y, 1, 0)) {
        moveDownDiag(x, y);
    }
}

function moveDownDiag(i, j) {
    if (Math.random() > 0.5) {
        if (!move(i, j, 1, 1)) {
            move(i, j, 1, -1);
        }
    } else {
        if (!move(i, j, 1, -1)) {
            move(i, j, 1, 1);
        }
    }   
}

function checkNeighboursType(neighbours, type) {
    shuffle(neighbours);
    for (let i = 0; i < neighbours.length; i++) {
        if (neighbours[i] && neighbours[i].type == type) {
            return neighbours[i];
        }
    }
}

function checkCell(x, y) {
    if (!inBounds(x, y)) return;
    let element = grid.getElement(x, y);
    return element;
}

function getNeighbours(x, y) {
    let neighbours = []
    neighbours.push(checkCell(x+1, y));
    neighbours.push(checkCell(x-1, y));
    neighbours.push(checkCell(x, y+1));
    neighbours.push(checkCell(x, y-1));
    
    neighbours.push(checkCell(x+1, y+1));
    neighbours.push(checkCell(x-1, y-1));
    neighbours.push(checkCell(x+1, y-1));
    neighbours.push(checkCell(x-1, y+1));
    return neighbours;
}

function checkNeighbours(x, y) {
    let neighbours = []
    neighbours.push(checkOccupied(x+1, y));
    neighbours.push(checkOccupied(x-1, y));
    neighbours.push(checkOccupied(x, y+1));
    neighbours.push(checkOccupied(x, y-1));
    
    neighbours.push(checkOccupied(x+1, y+1));
    neighbours.push(checkOccupied(x-1, y-1));
    neighbours.push(checkOccupied(x+1, y-1));
    neighbours.push(checkOccupied(x-1, y+1));
    return neighbours;
}

function checkOccupied(x, y) {
    if (!inBounds(x, y)) return;
    let element = grid.getElement(x, y);
    if (element.type == "air") {
        return false;
    } else if (element) {
        return element;
    }
}

function move(x, y, dx, dy) {
    if (!inBounds(x + dx, y + dy)) return;
    if (checkOccupied(x + dx, y + dy)) {
        checkSwap(x, y, dx, dy);
        return;
    }

    let element = grid.getElement(x, y)

    place(x + dx, y + dy, element);
    clear(x, y);
    grid.getElement(x + dx, y + dy).moved = true;
    return true;
}

function checkSwap(x, y, dx, dy) {
    let firstState = grid.getElement(x, y).state;
    let secondState = grid.getElement(x + dx, y + dy).state;
    if (firstState && secondState) {
        if (firstState == "plasma" && secondState == "gas") {
            swap(x, y, x + dx, y + dy);
        } else if (firstState == "liquid" && secondState == "gas") {
            swap(x, y, x + dx, y + dy);
        }
    }
}

*/
