var MINX = 0;
var MAXX = 0;
var MINY = 0;
var MAXY = 0;
const CHANGEPOSITION = 5;
const WEEKS = 10;
const CURETIME = 14;
const TIME = 1000;

var population = 5000;
const immunityPercent = 20;
const oneShotPercent = 5;
const twoShotPercent = 10;
const recoveryPercent = 10;
const infectedPercent = 5;

const immunity = Math.floor(population * immunityPercent / 100);
const oneShot = Math.floor(population * oneShotPercent / 100);
const twoShot = Math.floor(population * twoShotPercent / 100);
var recovery = Math.floor(population * recoveryPercent / 100);
var infected = Math.floor(population * infectedPercent / 100);
var dead = 0;

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

    MINX = rect.left - 20;
    MINY = rect.top -230;
    MAXX = rect.right - 40;
    MAXY = rect.bottom -240;

    console.log(MINX + MAXX);
    console.log(MINY + MAXY);

}
function setElementAttribute() {

    document.getElementById("population").innerHTML = population
    document.getElementById("immunityPercent").innerHTML = immunityPercent
    document.getElementById("infectedPercent").innerHTML = infectedPercent
    document.getElementById("oneShotPercent").innerHTML = oneShotPercent
    document.getElementById("twoShotPercent").innerHTML = twoShotPercent
    document.getElementById("recoveryPercent").innerHTML = recoveryPercent
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
    const indexes = [];
    for (let i = 0; i < attribute; i++) {
        indexes.push(Math.floor(Math.random() * population));
    }
    return indexes;
}

function assignAttributes() {
    let indexes;
    const usedIndexes = new Set(); // To track indexes already used for oneShot or twoShot

    // Assign immunity
    indexes = randomIndex(immunity);
    for (const i of indexes) {
        if (dots[i]) dots[i].immunity = true;
    }

    // Assign infected status
    indexes = randomIndex(infected);
    for (const i of indexes) {
        if (dots[i]) dots[i].status = "infected";
    }

    // Assign oneShot
    indexes = randomIndex(oneShot);
    for (const i of indexes) {
        if (dots[i] && !usedIndexes.has(i)) {
            dots[i].oneShot = true;
            usedIndexes.add(i); // Mark this index as used
        }
    }

    // Assign twoShot
    indexes = randomIndex(twoShot);
    for (const i of indexes) {
        if (dots[i] && !usedIndexes.has(i)) {
            dots[i].twoShot = true;
            usedIndexes.add(i); // Mark this index as used
        }
    }

    // Assign recovery status
    indexes = randomIndex(recovery);
    for (const i of indexes) {
        if (dots[i]) dots[i].status = "recovery";
    }
}


function initializeAllDots() {
    for (let i = 0; i < population; i++) {
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
            dotElement.style.scale = "1"
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
    return Math.abs(dot1.x - dot2.x) < 2 && Math.abs(dot1.y - dot2.y) < 2;
}

function updateSimulation() {
    const dotElements = document.getElementsByClassName("dot");
    for (const dot of dots) {
        updatePosition(dot);
    }

    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            if (overlap(dots[i], dots[j])) {
                if (dots[i].status !== "dead" && dots[j].status !== "dead") {
                    if (dots[i].status === "infected" || dots[j].status === "infected") {
                        let targetDot = dots[i].status === "infected" ? dots[j] : dots[i];

                        let chance = 100;
                        if (targetDot.status === "recovery") chance -= 40
                        if (targetDot.immunity) chance -= 15;
                        if (targetDot.oneShot) chance -= 5;
                        if (targetDot.twoShot) chance -= 10;

                        if (Math.random() * 100 < chance) {
                            if (targetDot.status === "recovery") {
                                recovery--;
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

function getDatasetData() {

    return {
        population: population - infected - recovery - dead, infected, recovery, dead
    }

}



function main() {

    setBounds()
    setElementAttribute()

    initializeAllDots();
    createDots();


    document.getElementById("canvas").addEventListener("resize", setBounds())


}