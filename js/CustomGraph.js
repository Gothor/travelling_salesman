class CustomVertex extends Vertex {

    constructor(id, x, y) {
        super(id);

        this.x = x;
        this.y = y;
    }

}

class CustomEdge extends Edge {

    constructor(id, a, b) {
        super(id, a, b);

        this.width = 0;
        this.pheromones = 0;
    }

    draw(c, weight) {
        let x1 = this.a.x + 8;
        let x2 = this.b.x + 8;
        let y1 = this.a.y + 8;
        let y2 = this.b.y + 8;

        strokeWeight(weight);
        stroke(c);
        noFill();
        line(x1, y1, x2, y2);

        /*
        colorMode(HSB);
        let lighterC = color(
            hue(c),
            saturation(c) * 1.5,
            brightness(c) * 1.5,
            alpha(c)
            );
        stroke(lighterC);
        strokeWeight(weight - 2);
        line(x1, y1, x2, y2);

        colorMode(RGB);
        */
    }

}

class CustomGraph extends Graph {

    constructor() {
        super();

        this.nextPheromones = {};
        this.maxPheromones = 0;
    }

    set(nbVertex) {
        glossMap.loadPixels();
        for (let i = 0; i < nbVertex; i++) {
            let validPosition = false;
            while (!validPosition) {
                let x = Math.floor(Math.random() * width);
                let y = Math.floor((Math.random() * 0.7 + 0.15) * height);

                let index = (y * width + x) * 4;
                if (glossMap.pixels[index] === 0) {
                    let vertex = this.addVertex(x, y);
                    validPosition = true;
                }
            }
        }

        let vertices = super.vertices();
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i; j < vertices.length; j++) {
                let vertex1 = vertices[i];
                let vertex2 = vertices[j];

                if (vertex1 != vertex2) {
                    let edge = this.addEdge(vertex1, vertex2);
                    let dX = vertex1.x - vertex2.x;
                    let dY = vertex1.y - vertex2.y;
                    let d = Math.sqrt(dX * dX + dY * dY);
                    edge.width = d;
                    edge.pheromones = Math.random();
                }
            }
        }
        this.maxPheromones = Math.max(...this.edges_.map(e => e.pheromones));
    }

    resetPheromones() {
        let edges = this.edges();
        for (const edge of edges) {
            edge.pheromones = Math.random();
        }
    }

    addPheromone(edge) {
        if (this.nextPheromones[edge.id] !== undefined) {
            this.nextPheromones[edge.id]++;
        } else {
            this.nextPheromones[edge.id] = 1;
        }
    }

    updatePheromones(edge, nbFourmis) {
        edge.pheromones = edge.pheromones / 2 + 100 * nbFourmis;
    }

    updateRoutes() {
        this.maxPheromones = 0.0;
        let edges = this.edges();
        for (const edge of edges) {
            let nbFourmis = 0;
            if (this.nextPheromones[edge.id] !== undefined) {
                nbFourmis = this.nextPheromones[edge.id];
            }
            this.updatePheromones(edge, nbFourmis);
            this.nextPheromones[edge.id] = 0;
            let pheromones = edge.pheromones;
            if (pheromones > this.maxPheromones) {
                this.maxPheromones = pheromones;
            }
        }
    }

}