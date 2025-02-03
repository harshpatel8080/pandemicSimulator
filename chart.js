var MINX = 0;
var MAXX = 0;
var MINY = 0;
var MAXY = 0;
const CHANGEPOSITION = 5;
const WEEKS = 52;
const CURETIME = 14;
const TIME = 100;

var totalPopulation = 5000;
var immunityPercent = 20;
var oneShotPercent = 10;
var twoShotPercent = 5;
var recoveryPercent = 10;
var infectedPercent = 5;

var healthy = totalPopulation - Math.floor(totalPopulation * infectedPercent / 100);
var immunity = Math.floor(totalPopulation * immunityPercent / 100);
var oneShot = Math.floor(totalPopulation * oneShotPercent / 100);
var twoShot = Math.floor(totalPopulation * twoShotPercent / 100);
var recovery = Math.floor(totalPopulation * recoveryPercent / 100);
var infected = Math.floor(totalPopulation * infectedPercent / 100);
var deadPercent = 0
var populationPercent = 100
var dead = 0;
let initPopulation = totalPopulation


var temp = []

const dots = [];

class DotBean {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.immunity = false;
        this.oneShot = false;
        this.twoShot = false;
        this.status = "healthy"; // "healthy", "infected", "recovery", "dead"
        this.infectedDuration = 0;
    }

    toString() {
        return `DotBean [x=${this.x}, y=${this.y}, immunity=${this.immunity}, oneShot=${this.oneShot}, twoShot=${this.twoShot}, status=${this.status}]`;
    }
}

function setBounds() {

    console.log("in set bound");
    const myDiv = document.getElementById("canvas");
    const rect = myDiv.getBoundingClientRect();

    MINX = rect.left;
    MINY = rect.top;
    MAXX = rect.right;
    MAXY = rect.bottom;

    console.log(MINX + MAXX);
    console.log(MINY + MAXY);

}
function setInputAttribute() {
    document.getElementById("populationInput").innerHTML = healthy;
    document.getElementById("immunityInput").innerHTML = immunityPercent;
    document.getElementById("infectedInput").innerHTML = infectedPercent;
    document.getElementById("oneShotInput").innerHTML = oneShotPercent;
    document.getElementById("twoShotInput").innerHTML = twoShotPercent;
    document.getElementById("recoveryInput").innerHTML = recoveryPercent;
}

function setAttribute() {
    document.getElementById("population").innerHTML = Math.trunc(healthy);
    document.getElementById("immunity").innerHTML = immunity;
    document.getElementById("infected").innerHTML = infected;
    document.getElementById("oneShot").innerHTML = oneShot;
    document.getElementById("twoShot").innerHTML = twoShot;
    document.getElementById("recovery").innerHTML = recovery;
    document.getElementById("dead").innerHTML = dead;
}

function setPercentAttribute() {
    document.getElementById("populationPercent").innerHTML = populationPercent;
    document.getElementById("infectedPercent").innerHTML = infectedPercent;
    document.getElementById("recoveryPercent").innerHTML = recoveryPercent;
    document.getElementById("deadPercent").innerHTML = deadPercent;
    document.getElementById("immunityPercent").innerHTML = immunityPercent;
    document.getElementById("oneShotPercent").innerHTML = oneShotPercent;
    document.getElementById("twoShotPercent").innerHTML = twoShotPercent;

    populationPercent = (healthy / initPopulation * 100).toFixed(2);
    infectedPercent = (infected / initPopulation * 100).toFixed(2);
    recoveryPercent = (recovery / initPopulation * 100).toFixed(2);
    deadPercent = (dead / initPopulation * 100).toFixed(2);
    immunityPercent = (immunity / initPopulation * 100).toFixed(2);
    oneShotPercent = (oneShot / initPopulation * 100).toFixed(2);
    twoShotPercent = (twoShot / initPopulation * 100).toFixed(2);
}

function setValues() {

    let values = localStorage.getItem("attributes")

    population = values.population
    infectedPercent = values.infectedPercent
    immunityPercent = values.immunityPercent
    oneShotPercent = values.oneShotPercent
    twoShotPercent = values.twoShotPercent
    recoveryPercent = values.recoveryPercent
}

function initializeXY(dot) {
    dot.x = Math.floor(Math.random() * (MAXX - MINX) + MINX);
    dot.y = Math.floor(Math.random() * (MAXY - MINY) + MINY);
}

function updatePosition(dot) {
    dot.x += Math.floor(Math.random() * CHANGEPOSITION * 2 - CHANGEPOSITION);
    dot.y += Math.floor(Math.random() * CHANGEPOSITION * 2 - CHANGEPOSITION);

    // Ensure x stays within bounds
    dot.x = Math.max(MINX + CHANGEPOSITION, Math.min(dot.x, MAXX - CHANGEPOSITION));
    dot.y = Math.max(MINY + CHANGEPOSITION, Math.min(dot.y, MAXY - CHANGEPOSITION));
}

function randomIndex(attribute) {
    const indexes = new Set();

    while (indexes.size < attribute) {
        indexes.add(Math.floor(Math.random() * initPopulation));
    }
    return indexes;
}
function assignAttributes() {
    let indexes;
    const usedIndexes = new Set();

    indexes = randomIndex(immunity);
    for (const i of indexes) {
        if (dots[i]) dots[i].immunity = true;
    }

    indexes = randomIndex(infected);
    for (const i of indexes) {
        if (dots[i]) dots[i].status = "infected";
    }

    indexes = randomIndex(oneShot);
    for (const i of indexes) {
        if (dots[i] && !usedIndexes.has(i)) {
            dots[i].oneShot = true;
            usedIndexes.add(i);
        }
    }

    indexes = randomIndex(twoShot);
    for (const i of indexes) {
        if (dots[i] && !usedIndexes.has(i)) {
            dots[i].twoShot = true;
            usedIndexes.add(i);
        }
    }

    indexes = randomIndex(recovery);
    for (const i of indexes) {
        if (dots[i]) dots[i].status = "recovery";
    }
}


function initializeAllDots() {
    for (let i = 0; i < initPopulation; i++) {
        const dot = new DotBean(i, 0, 0);
        initializeXY(dot);
        dots.push(dot);
    }
    assignAttributes();
}

function placeDot(dotElement, dot) {
    dotElement.style.left = `${dot.x}px`;
    dotElement.style.top = `${dot.y}px`;
}

function updateColor(dotElement, dot) {
    switch (dot.status) {
        case "dead":
            dotElement.style.backgroundColor = "black";
            dotElement.style.scale = "1.1"
            break;
        case "recovery":
            dotElement.style.backgroundColor = "rgb(0, 255, 0)";
            dotElement.style.scale = "1.2"
            break;
        case "infected":
            dotElement.style.backgroundColor = "red";
            dotElement.style.scale = "1.5"
            break;
        default:
            dotElement.style.backgroundColor = "rgb(109, 209, 255)"; // Healthy
            dotElement.style.scale = "2"
    }
}

function createDots() {
    const canvas = document.getElementById("canvas");
    for (const dot of dots) {
        const dotElement = document.createElement("div");
        dotElement.className = "dot";
        placeDot(dotElement, dot);
        updateColor(dotElement, dot);
        canvas.appendChild(dotElement);
    }
}

function overlap(dot1, dot2) {
    return Math.abs(dot1.x - dot2.x) < 3 && Math.abs(dot1.y - dot2.y) < 3;
}

function updateSimulation() {
    const dotElements = document.getElementsByClassName("dot");
    for (const dot of dots) {
        updatePosition(dot);
    }



    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            if (overlap(dots[i], dots[j])) {
                if (dots[i].status != "dead" && dots[j].status != "dead") {
                    if ((dots[i].status == "infected" && dots[j].status == "healthy") || (dots[i].status == "healthy" && dots[j].status == "infected")) {
                        let targetDot = dots[i].status === "infected" ? dots[j] : dots[i];

                        let chance = 100;
                        if (targetDot.status === "recovery") chance -= 40
                        if (targetDot.immunity) chance -= 15;
                        if (targetDot.oneShot) chance -= 5;
                        if (targetDot.twoShot) chance -= 10;


                        if (Math.random() * 100 < chance) {
                            if (targetDot.status === "recovery") {
                                recovery--;
                            } else if (targetDot.status == "healthy") {
                                healthy--
                            }
                            targetDot.status = "infected";
                            infected++;

                        }
                    }
                }
            }
        }

        const dot = dots[i];
        if (dot.status === "infected") {
            if (dot.infectedDuration >= CURETIME) {
                if (Math.random() * 100 < 15) {
                    dot.status = "dead";
                    if (dot.oneShot) {
                        oneShot--;
                    }
                    if (dot.twoShot) {
                        twoShot--;
                    }
                    if (dot.immunity) {
                        immunity--;
                    }
                    dead++;
                } else {
                    dot.status = "recovery";
                    recovery++;
                }
                infected--;
                dot.infectedDuration = 0;
            } else {
                dot.infectedDuration++;
            }
        }
        updateColor(dotElements[i], dot);
        if (dot.status !== "dead") {
            placeDot(dotElements[i], dot);
        }
    }
}

let i = 1
function getDatasetData() {

    temp.push({
        day: i++,
        population: healthy,
        infected,
        recovery,
        dead,
        immunity,
        oneShot,
        twoShot,
        populationPercent,
        infectedPercent,
        recoveryPercent,
        deadPercent,
        immunityPercent,
        oneShotPercent,
        twoShotPercent
    });

    return {
        population: healthy, infected, recovery, dead, immunity, oneShot, twoShot
    }
}
function getPercentDataSet() {
    return {
        populationPercent, infectedPercent, recoveryPercent, deadPercent, immunityPercent, oneShotPercent, twoShotPercent
    }
}






function main() {


    setBounds()
    setInputAttribute()
    setAttribute()
    setPercentAttribute()

    initializeAllDots();
    setTimeout(() => {
        createDots();
    }, 2000);


    document.getElementById("canvas").addEventListener("resize", setBounds())


}