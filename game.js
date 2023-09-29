const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gridSize = 8;
const numRows = 64;
const numCols = 64;

canvas.height = numCols * gridSize;
canvas.width = numRows * gridSize;

let selectedElement = 'sand';
let grid = new Grid(numRows, numCols, gridSize);

let isMouseDown = false;

function handleClick(event) {
    grid.setElement(hoveredCell[0], hoveredCell[1], new Element(selectedElement, getColor(selectedElement)));
}

function getColor(element) {
    switch (element) {
        case 'air':
            return '#ccc';
        case 'sand':
            return 'yellow';
        case 'water':
            return 'blue';
        case 'plant':
            return 'green';
        case 'fire':
            return 'red';
        case 'smoke':
            return 'grey';
        case 'wood':
            return 'brown';
        case 'steam':
            return '#e7e7e7';
        default:
            return '#000'; // default color
    }
}

function update() {
    //console.log("update");

    // Clean moved elements
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid.getElement(i, j)) grid.getElement(i, j).moved = false;
        }
    }

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid.getElement(i, j) && grid.getElement(i, j).moved == false) {
                if (grid.getElement(i, j).type == "sand") {
                    dustBehaviour(i, j);
                } else if (grid.getElement(i, j).type == "water") {
                    liquidBehaviour(i, j);
                } else if (grid.getElement(i, j).type == "plant") {
                    plantBehaviour(i, j);
                } else if (grid.getElement(i, j).type == "fire") {
                    if (grid.getElement(i, j).counter > 5) {
                        clear(i, j);
                    }
                    grid.getElement(i, j).counter++;
                    fireBehaviour(i, j)
                } else if (grid.getElement(i, j).type == "smoke") {
                    if (grid.getElement(i, j).counter > 100) {
                        clear(i, j);
                    } 
                    gasBehaviour(i, j);
                } else if (grid.getElement(i, j).type == "wood") {

                } else if (grid.getElement(i, j).type == "steam") {
                    if (grid.getElement(i, j).counter > 200) {
                        clear(i, j);
                        place(i, j, new Element(i - 1, j, "water", getColor("water")))
                    } 
                    gasBehaviour(i, j);
                }
            }
        }
    }
}

function dustBehaviour(x, y) {
    if (inBounds(x + 1, y) && checkState(x + 1, y) == "liquid") {
        swap(x, y, x + 1, y);
    } else {
        moveDown(x, y)
    }
}

function liquidBehaviour(x, y) {
    if (!checkOccupied(x + 1, y)) {
        moveDown(x, y);
    } else {
        moveSideways(x, y);
    }
}

function gasBehaviour(x, y) {
    grid.getElement(x, y).counter++;
    if (Math.random() > 0.25) {
        if (!checkOccupied(x - 1, y)) {
            move(x, y, -1, 0);
        } else {
            moveSideways(x, y);
        }
    } else {
        moveSideways(x, y);
    }
}

function plantBehaviour(x, y) {
    let nearbyWater = checkNeighboursType(getNeighbours(x, y), "water");
    if (nearbyWater) {
        let newPlant = checkNeighboursType(getNeighbours(x, y), "air")
        if (newPlant) {
            clear(nearbyWater.x, nearbyWater.y);
            place(newPlant.x, newPlant.y, new Element(x - 1, y, "plant", getColor("plant")));
        }
    }
}

function fireBehaviour(x, y) {
    let newCell = checkNeighboursType(getNeighbours(x, y), "air")
    if (newCell) {
        let dx = x - newCell.x;
        let dy = y - newCell.y;
        move(x, y, dx, dy);
    }

    if (Math.random() > 0.5) {
        spawnSmoke(x, y);
    }

    let nearbyWood = checkNeighboursType(getNeighbours(x, y), "plant")
    if (nearbyWood) {
        let newCell = checkNeighboursType(getNeighbours(nearbyWood.x, nearbyWood.y), "air")
        if (newCell) {
            place(newCell.x, newCell.y, new Element(x - 1, y, "fire", getColor("fire")));
        }
        if (Math.random() > 0.5) {
            spawnSmoke(nearbyWood.x, nearbyWood.y);
            clear(nearbyWood.x, nearbyWood.y);
        }
    }
}
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
    if (!checkOccupied(x + 1, y)) {
        move(x, y, 1, 0);
    } else {
        moveDownDiag(x, y);
    }
}

function moveDownDiag(i, j) {
    if (Math.random() > 0.5) {
        if (!checkOccupied(i + 1, j + 1) ) {
            move(i, j, 1, 1);
        } else {
            if (!checkOccupied(i + 1, j - 1) ) {
                move(i, j, 1, -1);
            }
        }
    } else {
        if (!checkOccupied(i + 1, j - 1) ) {
            move(i, j, 1, -1);
        } else {
            if (!checkOccupied(i + 1, j + 1) ) {
                move(i, j, 1, 1);
            }
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

function place(x, y, element) {
    grid.setElement(x, y, element);
}

function clear(x, y) {
    grid.setElement(x, y, new Element(x, y, "air", getColor("air")));
}

function inBounds(x, y) {
    if (x < numRows && x >= 0 && y < numCols && y >= 0) {
        return true;
    } else {
        return false;
    }
}

function gameLoop() {
    update();
}

//canvas.addEventListener('click', handleClick);

document.getElementById("element").addEventListener("change", (e) => {
    selectedElement = e.target.value;
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
        grid.setElement(hoveredCell[1], hoveredCell[0], new Element(hoveredCell[0], hoveredCell[1], selectedElement, getColor(selectedElement)));
    }
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    //const x = Math.floor((e.clientX - rect.left) / 8);
    //const y = Math.floor((e.clientY - rect.top) / 8);
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    let row = Math.floor(mouseY / gridSize)
    let col = Math.floor(mouseX / gridSize)
    
    hoveredCell = [col, row];
    
    if (!inBounds(hoveredCell[0], hoveredCell[1])) {
        hoveredCell = null;
        isMouseDown = false;
    }

})

function draw() {
    //console.log("draw");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redraw
    grid.draw(ctx);
    if (hoveredCell) {
        ctx.strokeStyle = "white";
        ctx.strokeRect(hoveredCell[0] * 8, hoveredCell[1] * 8, 8, 8, 8);
    }

    onMouseDown();
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
    let temp, r;
    for (let i = 1; i < arr.length; i++) {
        r = randomRange(0, i);
        temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
}