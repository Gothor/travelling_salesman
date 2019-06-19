const NB_VILLES = 50;
const NB_FOURMIS_PAR_VILLE = 2;

let graph;
let fourmis;
let bestPath = [];
let bestDistance = Infinity;
let bestCurrentPath = [];
let bestCurrentDistance = Infinity;

let showPheromones = false;
let showBestCurrentPath = false;

let glossMap;

function preload() {
    glossMap = loadImage('img/glossmap.png');
}

function setup() {
    createCanvas(windowWidth, windowWidth / 2);

    glossMap.resize(width, glossMap.height * width / glossMap.width);

    graph = new CustomGraph();
    graph.setVertexType(CustomVertex);
    graph.setEdgeType(CustomEdge);
    graph.set(NB_VILLES);

    fourmis = [];
    for (let i = 0; i < NB_VILLES * NB_FOURMIS_PAR_VILLE; i++) {
        let fourmi = new Fourmi(graph);
        fourmis.push(fourmi);
    }

    window.addEventListener('resize', resizeMyCanvas);

    //noLoop();
}

function mousePressed() {
    showPheromones = !showPheromones;
    showBestCurrentPath = !showBestCurrentPath;
}

function resizeMyCanvas() {
    let w = width;
    let h = height;
    resizeCanvas(windowWidth, windowWidth / 2);

    let vertices = graph.vertices();
    for (const vertex of vertices) {
        vertex.x *= windowWidth / w;
        vertex.y *= windowWidth / w;
    }
}

function idle() {
    let bestCurrentDistance = Infinity;

    let i = 0;
    for (const fourmi of fourmis) {
        fourmi.forgetPath();
        fourmi.visit(graph.vertex(Math.floor(i++ / 2)));
    }
    let nb = graph.vertices().length - 1;
    for (let i = 0; i < nb; i++) {
        for (const fourmi of fourmis) {
            let e = fourmi.chooseNextCity();
            graph.addPheromone(e);
            fourmi.moveForward();
        }
    }
    for (const fourmi of fourmis) {
        fourmi.goBackHome();
    }
    graph.updateRoutes();

    let best = null;
    for (const fourmi of fourmis) {
        if (fourmi.getDistance() < bestCurrentDistance) {
            best = fourmi;
            bestCurrentDistance = fourmi.getDistance();
        }
    }

    bestCurrentPath = best.getPath();

    if (bestCurrentDistance < bestDistance) {
        bestPath = bestCurrentPath;
        bestDistance = bestCurrentDistance;
    }
}

function draw() {
    idle();

    clear();

    let c = color(255, 200, 50, 255);

    let vertices = graph.vertices();
    fill(c);
    noStroke();
    for (const vertex of vertices) {
        let x = vertex.x;
        let y = vertex.y;
        rect(x, y, 16, 16);
    }

    if (showPheromones) {
        let edges = graph.edges();
        for (const edge of edges) {
            let c = color(0, 0, 0, edge.pheromones / graph.maxPheromones * 255);
            edge.draw(c, 4);
        }
    }

    if (showBestCurrentPath) {
        c = color(0, 150, 255, 255);
        for (let i = 1; i < bestCurrentPath.length; i++) {
            let edge = graph.edge(bestCurrentPath[i - 1], bestCurrentPath[i]);
            edge.draw(c, 4);
        }
    }

    c = color(150, 0, 0, 255);
    for (let i = 1; i < bestPath.length; i++) {
        let edge = graph.edge(bestPath[i - 1], bestPath[i]);
        edge.draw(c, 3);
    }

    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    text(frameCount, 10, 10);
}