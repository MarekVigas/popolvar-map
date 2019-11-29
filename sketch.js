let mapInput, zoomInput, pathInput, rebuildInput;
let drawMap, drawPath;
let grid = [];
let path = [];
let rawGrid = [];
let hasGrid = false;
let hasPath = false;
let pathCost;
let w = 20;

const colors = ["#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059", "#FFDBE5", "#7A4900", "#0000A6"]

class Node {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    show(){
        noFill();
        noStroke();
        if (this.type == "C"){
            image(pathImg, this.x*w, this.y*w, w, w);
        } else if (this.type == "H"){
            image(pathImg, this.x*w, this.y*w, w, w);
            image(bushImg, this.x*w, this.y*w, w, w);
        } else if (this.type == "D"){
            image(pathImg, this.x*w, this.y*w, w, w);
            image(dragonImg, this.x*w, this.y*w, w, w);
        } else if (this.type == "P"){
            image(pathImg, this.x*w, this.y*w, w, w);
            image(princessImg, this.x*w, this.y*w, w, w);
        } else if (this.type == "G"){
            image(pathImg, this.x*w, this.y*w, w, w);
            image(generatorImg, this.x*w, this.y*w, w, w);
        } else if (this.type == "N"){
            image(pathImg, this.x*w, this.y*w, w, w);
            image(rocksImg, this.x*w, this.y*w, w, w);
        } else {
            image(pathImg, this.x*w, this.y*w, w, w);
            image(teleportImg, this.x*w, this.y*w, w, w);
            fill(colors[this.type]);
            circle(this.x*w + w/2, this.y*w + w/2, w/1.5);
            fill(0);
            rectMode(CENTER);
            textAlign(CENTER, CENTER);
            textSize(w/2.5);
            text(this.type, this.x*w + w/2, this.y*w + w/2);
            rectMode(CORNER);
            noFill();
        }
    }
}

function setup() {
    mapInput = select("#mapInput");
    mapInput.input(createPath);

    zoomInput = select("#zoom");
    zoomInput.input(createPath);
    
    pathInput = select("#pathInput");
    pathInput.input(createPath);

    pathCostOutput = select("#pathCost");

    rebuildInput = select("#rebuild");
    rebuildInput.mousePressed(() => {
        createPath();
    })

    pathImg = loadImage('images/path.jpeg');
    bushImg = loadImage('images/bush.png');
    dragonImg = loadImage('images/dragon.png');
    princessImg = loadImage('images/princess.png');
    generatorImg = loadImage('images/generator.png');
    rocksImg = loadImage('images/rocks.png');
    teleportImg = loadImage('images/teleport.png');
    noLoop();
}

function draw() {
    background(0);
    if (hasGrid) {
        grid.map(node => node.show());
    }
    if(hasPath) {
        noStroke();
        fill(255, 0, 0, 100);
        path.map(point => circle(point.x*w + w/2, point.y*w + w/2, w/2));
        noFill();
        stroke(255, 0, 0, 100);
        strokeWeight(w/4);
        beginShape();
        path.map(point => vertex(point.x*w + w/2, point.y*w + w/2));
        endShape();
    }
}

function getNodeCost(y,x){
    let value;
    if (x && y) {
        const row = rawGrid[y];
        if(row){
            value = row[x];
        }
    } else {
        return null;
    }
    switch (value) {
        case "C":
            return 1;
        case "H":
            return 2;
        case "D":
            return 1;
        case "P":
            return 1;
        case "G":
            return 1;
        case "N":
            return null;
        default:
            // Only left option is teleport
            return 0;
    }
}

function createPath(){
    createMap();
    const pathData = pathInput.value().split('\n');
    pathCost = 0;
    path = pathData.map(val => {
        let split = val.split(" ");
        let nodeCost = getNodeCost(split[1], split[0]);
        if (nodeCost != null) {
            pathCost += nodeCost;
        }
        return {
            x: split[0],
            y: split[1]
        }
    })
    pathCostOutput.html(`Path cost: ${pathCost}`);
    hasPath = true;
    redraw();
}

function createMap(){
    w = zoomInput.value();
    grid = [];
    const dataArray = mapInput.value().split('\n');
    const settings = dataArray[0].split(" ");
    const mapData = dataArray.slice(1);
    
    const n = settings[0];
    const m = settings[1];

    createCanvas(m*w, n*w);

    for (const [y, row] of mapData.entries()) {
        rawGrid[y] = [];
        for (const [x, value] of row.split("").entries()) {
            grid.push(new Node(x, y, value));
            rawGrid[y][x] = value;
        }
    }
    hasGrid = true;
}