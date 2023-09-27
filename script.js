// Global Variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gridSize = 10;
const numRows = 64;
const numCols = 64;
let selectedElement = 'sand';
let grid = [];

// Initialize grid with empty elements
for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
        grid[i][j] = null;
    }
}

// Function to draw the grid
function drawGrid() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid[i][j]) {
                ctx.fillStyle = grid[i][j].color;
                ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
            }
        }
    }
}

// Function to handle mouse click event
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const row = Math.floor(mouseY / gridSize);
    const col = Math.floor(mouseX / gridSize);
    
    if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
        grid[row][col] = { type: selectedElement, color: getColor(selectedElement) };
    }
}

// Function to get color based on element type
function getColor(element) {
    switch (element) {
        case 'sand':
            return '#ffd700'; // yellow
        // Add more elements here if needed
        default:
            return '#000'; // default color
    }
}

// Function to update element positions
function update() {
    for (let i = numRows - 2; i >= 0; i--) {
        for (let j = 0; j < numCols; j++) {
            if (grid.getElement(i, j) && !grid.getElement(i + 1, j) && grid.getElement(i, j).type === 'sand') {
                grid.setElement(i + 1, j, grid.getElement(i, j));
                grid.setElement(i, j, null);
            }
        }
    }
}


// Function to start the game loop
function gameLoop() {
    update();
    drawGrid();
    requestAnimationFrame(gameLoop);
}

// Add event listener for mouse click
canvas.addEventListener('click', handleClick);

// Start the game loop
gameLoop();
