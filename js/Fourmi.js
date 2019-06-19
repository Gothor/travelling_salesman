class Fourmi {

    constructor(g) {
        this.g = g;
        this.distance = 0.0;
        this.path = [];
        this.next = null;
    }

    getDistance() {
        return this.distance;
    }

    getCurrentCity() {
        return this.path[this.path.length - 1];
    }

    getNext() {
        return this.next;
    }

    getPath() {
        return this.path;
    }

    hasBeenTo(v) {
        return this.path.includes(v);
    }

    chooseNextCity() {
        let edges = [];
        let probas = [];
        let total = 0;
        let outEdges = this.g.outEdges(this.path[this.path.length - 1]);
        for (const edge of outEdges) {
            if (!this.hasBeenTo(edge.target())) {
                let proba = edge.pheromones / edge.width;
                total += proba;
                edges.push(edge);
                probas.push(total);
            }
        }

        let r = Math.random() * total;
        let edge;
        for (let i = 0; i < edges.length; i++) {
            if (r <= probas[i]) {
                edge = edges[i];
                break;
            }
        }
        this.next = edge.target();

        return edge;
    }

    moveForward() {
        this.visit(this.next);
    }

    visit(v) {
        if (this.path.length > 0) {
            this.distance += this.g.edge(this.path[this.path.length - 1], v).width;
        }
        this.path.push(v);
    }

    forgetPath() {
        this.path = [];
        this.distance = 0;
    }

    goBackHome() {
        this.visit(this.path[0]);
    }

}