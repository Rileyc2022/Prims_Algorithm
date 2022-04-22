const fs = require("fs");

class Graph {
    constructor() {
        this.edges = [];
        this.nodes = [];
        this.visited = [];
        this.visitedEdges = [];
    }

    static gEdge = class {
        constructor(to, from, weight) {
            this.to = to;
            this.from = from;
            this.weight = weight;
        }
    };

    static gNode = class {
        constructor(data) {
            this.data = data;
        }
    };

    addEdge(edge) {
        this.edges.push(edge);
        if (!this.nodes.includes(edge.to)) {
            this.nodes.push(edge.to);
        }
        if (!this.nodes.includes(edge.from)) {
            this.nodes.push(edge.from);
        }
    }

    prims(node) {

        // push node to visited
        this.visited.push(node.data);

        // choice of edge(must connect to the node you are on)
        let choices = this.edges.filter(
            (edge) =>
                this.visited.includes(edge.from.data) &&
                !this.visited.includes(edge.to.data) &&
                edge.weight !== 0
        );
        
        // if there are no more valid edges, return, stop recursion
        if (!choices.length) return;

        // sort for lowest weighting
        let sortedEdges = choices.sort(
            (edge1, edge2) => edge1.weight - edge2.weight
        );

        this.visitedEdges.push(sortedEdges[0]);

        // recursion
        this.prims(sortedEdges[0].to);

    }
    printEdges() {
        console.log(this.edges);
    }
    printNodes() {
        console.log(this.nodes);
    }
}

let graph = new Graph();

let data = fs.readFileSync("matrix.txt", "utf-8", (err) => {
    if (err) throw err;
});

let adjList = data.split("\n").map((arr) => arr.split(" "));

let letters = "ABCDEFG".split("");

for (let row in adjList) {
    for (let column in adjList[row]) {
        graph.addEdge(
            new Graph.gEdge(
                new Graph.gNode(letters[row]),
                new Graph.gNode(letters[column]),
                parseInt(adjList[row][column])
            )
        );
    }
}

// Start at any node, here it's A
graph.prims(new Graph.gNode("A"));

let minSpanTree = [];
let sum = 0;
for (let i = 0; i < 7; i++) {
    let row = [];
    for (let j = 0; j < 7; j++) {
        let spot = false;
        for (let edge of graph.visitedEdges) {
            if (
                i == letters.indexOf(edge.from.data) &&
                j == letters.indexOf(edge.to.data)
            ) {
                row.push(edge.weight);
                sum += edge.weight;
                spot = true;
            }
        }
        if (!spot) row.push(0);
    }
    minSpanTree.push(row);
}
console.log("Minimum Spanning Tree");
console.log("---------------------");

for (let row of minSpanTree) {
    console.log(row.join(" "));
}
console.log("Cost: " + sum);
