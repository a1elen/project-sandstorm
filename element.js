class Element {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = "default";
        this.color = "#000";
        this.state = "default";

        this.moved = false;
        this.counter = 0;
    }

    update() {

    }
}

/*
ELEMENT STATES
*/

class Solid extends Element {
    constructor() {
        super();
        this.state = "solid";
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
        this.color = 'yellow';
    }
    
    update() {
        if (fallDown(this.x, this.y)) {
            move()
        } 
    }
}

class Plant extends Solid {
    constructor() {
        super();
        this.name = "Plant";
        this.color = 'green';
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
        this.color = 'brown';
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
        this.color = 'blue';
    }

    update() {
        if (!checkOccupied(x + 1, y)) {
            moveDown(x, y);
        } else {
            moveSideways(x, y);
        }
    }
}

/*
GAS ELEMENTS
*/

class Smoke extends Gas {
    constructor() {
        super();
        this.name = "Smoke";
        this.color = 'grey';
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
        this.color = '#e7e7e7';
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
        this.color = 'red';
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
        this.color = '#ccc';
    }

    update() {

    }
}