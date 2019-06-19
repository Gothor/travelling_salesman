class Vertex {

    constructor(id) {
        this.id = id;
    }

}

class Edge {

    constructor(id, a, b) {
        this.id = id;

        this.a = a;
        this.b = b;
    }

    swap() {
        let tmp = this.a;
        this.a = this.b;
        this.b = tmp;
    }

    target() {
        return this.b;
    }

}

class Graph {

    constructor() {
        this.vertexType = Vertex;
        this.edgeType = Edge;

        this.vertices_ = [];
        this.edges_ = [];
    }

    setVertexType(type) {
        this.vertexType = type;
    }

    setEdgeType(type) {
        this.edgeType = type;
    }

    addVertex() {
        let args = [this.vertices_.length, ...arguments];
        let vertex = new this.vertexType(...args);
        this.vertices_.push(vertex);
    }

    vertex(n) {
        return this.vertices_[n];
    }

    vertices() {
        return this.vertices_;
    }

    addEdge(a, b) {
        let edge = new this.edgeType(this.edges_.length, a, b);
        this.edges_.push(edge);
        return this.edges_[this.edges_.length - 1];
    }

    edge(a, b) {
        for (const edge of this.edges_) {
            if (edge.a === a && edge.b === b) {
                return edge;
            } else if (edge.a === b && edge.b === a) {
                edge.swap();
                return edge;
            }
        }
    }

    edges() {
        return this.edges_;
    }

    outEdges(v) {
        let result = [];
        for (const edge of this.edges_) {
            if (edge.b === v) {
                edge.swap();
            }
            if (edge.a === v) {
                result.push(edge);
            }
        }
        return result;
    }

}