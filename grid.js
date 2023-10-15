class Grid {
    constructor(numRows, numCols, gridSize) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.gridSize = gridSize;
        this.grid = this.initializeGrid();
    }

    initializeGrid() {
        const grid = [];
        for (let i = 0; i < this.numRows; i++) {
            grid[i] = [];
            for (let j = 0; j < this.numCols; j++) {
                grid[i][j] = new Air(i, j);
            }
        }
        return grid;
    }

    draw(ctx) {
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                if (this.grid[i][j]) {
                    ctx.fillStyle = this.grid[i][j].color;
                    ctx.fillRect(j * this.gridSize, i * this.gridSize, this.gridSize, this.gridSize);
                }
            }
        }

        if (!hoveredCell) return;

        if (this.getElement(hoveredCell[1], hoveredCell[0])) {
            let name = this.getElement(hoveredCell[1], hoveredCell[0]).name;

            ctx.font = "30px Comic Sans MS";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(name, canvas.width/2, canvas.height/10);
        }
        

    }

    setElement(row, col, element) {
        this.grid[row][col] = element;
        if (this.grid[row][col]) {
            this.grid[row][col].x = row;
            this.grid[row][col].y = col;
        }
    }

    getElement(row, col) {
        return this.grid[row][col];
    }
}
