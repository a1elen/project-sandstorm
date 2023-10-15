class Element {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = "default";
        this.colors = ["#000"];
        this.state = "default";
        this.density = 1;

        this.moved = true;
        this.counter = 0;

        this.init();
    }

    init() {
        if (this.colors.length > 1) {
            this.color = this.colors[randomRange(0, this.colors.length)];
        }
    }

    update() {

    }

    move(dx, dy) {
        let newX = this.x + dx;
        let newY = this.y + dy;
    
        if (!inBounds(newX, newY)) return;

        if (isFree(newX, newY)) {
            setCell(newX, newY, this.name, this.color);
            setCell(this.x, this.y, "Air");
            return true;
        } else if (checkForSwap(this, grid.getElement(newX, newY))) {
            this.swap(this.x, this.y, newX, newY);
            return true;
        } else {
            return false;
        }
    }

    swap(x1, y1, x2, y2) {
        
        let first = grid.getElement(x1, y2);
        let second = grid.getElement(x2, y2);

        setCell(x1, y1, "Air");
        setCell(x2, y2, "Air");

        setCell(x2, y2, this.name, this.color);
        setCell(x1, y1, second.name, second.color);

        return true;
    }

    colorMove() {
        let dir = randomRange(-1, 1);

        if (inBounds(this.x, this.y + dir) && !isFree(this.x, this.y + dir)) {
            if (getCell(this.x, this.y + dir).name == this.name) {
                let second = grid.getElement(this.x, this.y + dir);

                let tempColor = second.color;
                second.color = this.color;
                this.color = tempColor;
            }
        }
    }
}

/*
ELEMENT STATES
*/

class Solid extends Element {
    constructor() {
        super();
        this.state = "solid";
        this.movable;
    }
}

class Liquid extends Element {
    constructor() {
        super();
        this.state = "liquid";
    }
}

class Gas extends Element {
    constructor() {
        super();
        this.state = "gas";
    }
}

class Plasma extends Element {
    constructor() {
        super();
        this.state = "plasma";
    }
}

/*
SOLID ELEMENTS
*/

class Sand extends Solid {
    constructor() {
        super();
        this.name = "Sand";
        this.colors = ["yellow", "#ffea2b", "#dedb26"];
        this.movable = true;
        this.density = 1602;

        this.init();
    }
    
    update() {


        if (!this.movable) return;

        if (!super.move(1, 0)) {
            if (randomRange(0, 1) == 1) {
                if (!super.move(1, 1)) {
                    super.move(1, -1);
                }
            } else {
                if (!super.move(1, -1)) {
                    super.move(1, 1);
                }
            }
        }
    }
}

class Plant extends Solid {
    constructor() {
        super();
        this.name = "Plant";
        this.color = ['green'];
        this.movable = false;
    }
    
    update() {
        let nearbyWater = checkNeighboursType(getNeighbours(x, y), "water");
        if (nearbyWater) {
            let newPlant = checkNeighboursType(getNeighbours(x, y), "air")
            if (newPlant) {
                clear(nearbyWater.x, nearbyWater.y);
                place(newPlant.x, newPlant.y, new Element(x - 1, y, "plant", getColor("plant")));
            }
        }
    }
}

class Wood extends Solid {
    constructor() {
        super();
        this.name = "Wood";
        this.color = ['brown'];
    }

    update() {
        
    }
}

/*
LIQUID ELEMENTS
*/

class Water extends Liquid {
    constructor() {
        super();
        this.name = "Water";
        this.colors = ["blue", "#2f35eb", "#1d23cf"];
        this.density = 1000;

        this.init();
    }

    update() {
        if (!super.move(1, 0)) {
            if (randomRange(0, 1) == 1) {
                if (!super.move(0, 1)) {
                }
            } else {
                if (!super.move(0, -1)) {
                }
            }
        }

        super.colorMove();

    }
}

/*
GAS ELEMENTS
*/

class Smoke extends Gas {
    constructor() {
        super();
        this.name = "Smoke";
        this.color = ['grey'];
    }

    update() {
        if (this.counter > 50) {
            clear(x, y);
        }

        if (checkNeighboursType(getNeighbours(x, y), "air")) {
            grid.getElement(x, y).counter++;
        }
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
}

class Steam extends Gas {
    constructor() {
        super();
        this.name = "Steam";
        this.color = ['#e7e7e7'];
    }

    update() {
        if (this.counter > 100) {
            clear(x, y);
            place(x, y, new Element(i - 1, j, "water", getColor("water")))
        }
        
        if (checkNeighboursType(getNeighbours(x, y), "air")) {
            grid.getElement(x, y).counter++;
        }
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
}

/*
PLASMA ELEMENTS
*/

class Fire extends Plasma {
    constructor() {
        super();
        this.name = "Fire";
        this.color = ['red'];
    }

    update() {
        if (this.counter > 5) {
            clear(x, y);
        }
        this.counter++;

        let newCell = checkNeighboursType(getNeighbours(x, y), "air")
        if (newCell) {
            let dx = x - newCell.x;
            let dy = y - newCell.y;
            move(x, y, dx, dy);
        }
    
        if (Math.random() > 0.75) {
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
}

class Air extends Element {
    constructor() {
        super();
        this.name = "Air";
        this.color = ['#ccc'];
    }

    update() {

    }
}