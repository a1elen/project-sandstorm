class Element {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.moved = false;
        this.state;
        this.counter = 0;

        if (this.type == "sand") {
            this.state = "dust";
        } else if (this.type == "water") {
            this.state = "liquid";
        }
    }
}
