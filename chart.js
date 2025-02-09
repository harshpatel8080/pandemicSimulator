var MINX = 0;
var MAXX = 0;
var MINY = 0;
var MAXY = 0;
const CHANGEPOSITION = 5;
const WEEKS = 5;
const CURETIME = 14;
const TIME = 1000;
var day = 0;

var totalPopulation;
var immunityPercent = 20;
var oneShotPercent = 10;
var twoShotPercent = 5;
var recoveryPercent = 10;
var infectedPercent;

var healthy;
var immunity;
var oneShot;
var twoShot;
var recovery;
var infected;
var deadPercent = 0;
var populationPercent = 100;
var dead = 0;
let initPopulation;

const dots = [];

// Class representing each individual in the simulation
class DotBean {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.immunity = false;
        this.oneShot = false;
        this.twoShot = false;
        this.status = "healthy";
        this.infectedDuration = 0;
    }

    toString() {
        return `DotBean [x=${this.x}, y=${this.y}, immunity=${this.immunity}, oneShot=${this.oneShot}, twoShot=${this.twoShot}, status=${this.status}]`;
    }
}

// Set the bounds of the simulation area based on the canvas size
function setBounds() {
    const myDiv = document.getElementById("canvas");
    const rect = myDiv.getBoundingClientRect();

    MINX = rect.left;
    MINY = rect.top;
    MAXX = rect.right;
    MAXY = rect.bottom;
}

// Update input attributes displayed on the page
function setInputAttribute() {
    document.getElementById("populationInput").innerHTML = totalPopulation;
    document.getElementById("immunityInput").innerHTML = immunityPercent + "%";
    document.getElementById("infectedInput").innerHTML = infectedPercent + "%";
    document.getElementById("oneShotInput").innerHTML = oneShotPercent + "%";
    document.getElementById("twoShotInput").innerHTML = twoShotPercent + "%";
    document.getElementById("recoveryInput").innerHTML = recoveryPercent + "%";
}

// Update the displayed attributes of the simulation
function setAttribute() {
    document.getElementById("population").innerHTML = Math.trunc(healthy);
    document.getElementById("immunity").innerHTML = immunity;
    document.getElementById("infected").innerHTML = infected;
    document.getElementById("oneShot").innerHTML = oneShot;
    document.getElementById("twoShot").innerHTML = twoShot;
    document.getElementById("recovery").innerHTML = recovery;
    document.getElementById("dead").innerHTML = dead;
}

// Calculate and update percentage attributes
function setPercentAttribute() {
    populationPercent = (healthy / initPopulation * 100).toFixed(2);
    infectedPercent = (infected / initPopulation * 100).toFixed(2);
    recoveryPercent = (recovery / initPopulation * 100).toFixed(2);
    deadPercent = (dead / initPopulation * 100).toFixed(2);
    immunityPercent = (immunity / initPopulation * 100).toFixed(2);
    oneShotPercent = (oneShot / initPopulation * 100).toFixed(2);
    twoShotPercent = (twoShot / initPopulation * 100).toFixed(2);

    document.getElementById("populationPercent").innerHTML = populationPercent + "%";
    document.getElementById("infectedPercent").innerHTML = infectedPercent + "%";
    document.getElementById("recoveryPercent").innerHTML = recoveryPercent + "%";
    document.getElementById("deadPercent").innerHTML = deadPercent + "%";
    document.getElementById("immunityPercent").innerHTML = immunityPercent + "%";
    document.getElementById("oneShotPercent").innerHTML = oneShotPercent + "%";
    document.getElementById("twoShotPercent").innerHTML = twoShotPercent + "%";
}

// Initialize population and attributes from session storage
function setValues() {
    let values = JSON.parse(sessionStorage.getItem("attributes"));

    totalPopulation = values.population;
    initPopulation = totalPopulation;
    infectedPercent = values.infectedPercent;
    immunityPercent = values.immunityPercent;
    oneShotPercent = values.oneShotPercent;
    twoShotPercent = values.twoShotPercent;
    recoveryPercent = values.recoveryPercent;

    immunity = Math.floor(totalPopulation * immunityPercent / 100);
    oneShot = Math.floor(totalPopulation * oneShotPercent / 100);
    twoShot = Math.floor(totalPopulation * twoShotPercent / 100);
    recovery = Math.floor(totalPopulation * recoveryPercent / 100);
    infected = Math.floor(totalPopulation * infectedPercent / 100);
    healthy = totalPopulation - infected - recovery;
}

// Initialize the position of a dot randomly within the bounds
function initializeXY(dot) {
    dot.x = Math.floor(Math.random() * (MAXX - MINX) + MINX);
    dot.y = Math.floor(Math.random() * (MAXY - MINY) + MINY);
}

// Update the position of a dot randomly
function updatePosition(dot) {
    dot.x += Math.floor(Math.random() * CHANGEPOSITION * 2 - CHANGEPOSITION);
    dot.y += Math.floor(Math.random() * CHANGEPOSITION * 2 - CHANGEPOSITION);

    dot.x = Math.max(MINX + CHANGEPOSITION, Math.min(dot.x, MAXX - CHANGEPOSITION));
    dot.y = Math.max(MINY + CHANGEPOSITION, Math.min(dot.y, MAXY - CHANGEPOSITION));
}

// Generate a set of unique random indexes for assigning attributes
function randomIndex(attribute) {
    const indexes = new Set();
    while (indexes.size < attribute) {
        indexes.add(Math.floor(Math.random() * initPopulation));
    }
    return indexes;
}

// Assign attributes (immunity, infection status, etc.) to dots
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

// Initialize all dots and assign their attributes
function initializeAllDots() {
    for (let i = 0; i < initPopulation; i++) {
        const dot = new DotBean(i, 0, 0);
        initializeXY(dot);
        dots.push(dot);
    }
    assignAttributes();
}

// Place a dot element on the canvas
function placeDot(dotElement, dot) {
    dotElement.style.left = `${dot.x}px`;
    dotElement.style.top = `${dot.y}px`;
}

// Update the color of a dot based on its status
function updateColor(dotElement, dot) {
    switch (dot.status) {
        case "dead":
            dotElement.style.backgroundColor = "white";
            dotElement.className = "dot dead";
            break;
        case "recovery":
            dotElement.style.backgroundColor = "rgb(0, 255, 0)";
            dotElement.className = "dot recovery";
            break;
        case "infected":
            dotElement.style.backgroundColor = "red";
            dotElement.className = "dot infected";
            break;
        default:
            dotElement.style.backgroundColor = "rgb(109, 209, 255)"; // Healthy
            dotElement.className = "dot healthy";
    }
}

// Update the counts of each status category
function updateAttributes() {
    infected = document.getElementsByClassName("dot infected").length;
    dead = document.getElementsByClassName("dot dead").length;
    healthy = document.getElementsByClassName("dot healthy").length;
    recovery = document.getElementsByClassName("dot recovery").length;
}

// Create dot elements in the DOM
function createDots() {
    const canvas = document.getElementById("canvas");
    for (const dot of dots) {
        const dotElement = document.createElement("div");
        dotElement.className = "dot";
        dotElement.style.scale = 1.5 - initPopulation / 5000;
        placeDot(dotElement, dot);
        updateColor(dotElement, dot);
        canvas.appendChild(dotElement);
    }
}

// Check if two dots overlap
function overlap(dot1, dot2) {
    return Math.abs(dot1.x - dot2.x) < 3 && Math.abs(dot1.y - dot2.y) < 3;
}

var infecedNumber = {};
var dailyInfection = [];
var avgInfectionRate = 0;
var avgMortalityRate = 0;

// Update the simulation and track daily infections
function updatePage() {
    let initialInfected = infected;

    updateSimulation();

    dailyInfection.push(infected - initialInfected > 0 ? infected - initialInfected : 0);
    avgInfectionRate += dailyInfection[day];
    avgMortalityRate += dead / (initPopulation - dead);
    day++;
}

// Update the simulation logic for each dot
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
                        let tempIndex = dots[i].status === "infected" ? j : i;

                        let chance = 100;
                        if (targetDot.status === "recovery") chance -= 40;
                        if (targetDot.immunity) chance -= 15;
                        if (targetDot.oneShot) chance -= 5;
                        if (targetDot.twoShot) chance -= 10;

                        if (Math.random() * 100 < chance) {
                            infecedNumber[tempIndex] = (infecedNumber.hasOwnProperty(tempIndex) ? infecedNumber[tempIndex] : 0) + 1;
                            targetDot.status = "infected";
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
                    if (dot.oneShot) oneShot--;
                    if (dot.twoShot) twoShot--;
                    if (dot.immunity) immunity--;
                } else {
                    dot.status = "recovery";
                }
                infected--;
                dot.infectedDuration = 0;
            } else {
                dot.infectedDuration++;
            }
        }
        updateColor(dotElements[i], dot);
        updateAttributes();

        if (dot.status !== "dead") {
            placeDot(dotElements[i], dot);
        }
    }
}

// Track maximum and minimum infected cases
var maxInfected;
var minInfected;
function maxMinCases(day) {
    if (day == 1) {
        maxInfected = { infected, day, population: healthy, dead }
        minInfected = { infected, day, population: healthy, dead }
    } else {
        if (maxInfected.infected < infected) {
            maxInfected.infected = infected;
            maxInfected.day = day;
            maxInfected.dead = dead;
            maxInfected.population = healthy;
        }
        if (minInfected.infected > infected) {
            minInfected.infected = infected;
            minInfected.day = day;
            minInfected.dead = dead;
            minInfected.population = healthy;
        }
    }
}

// Send simulation data to session storage
function sendToSession() {
    let avgInfectedNumber = 0;
    for (const i in infecedNumber) {
        avgInfectedNumber += infecedNumber[i];
    }
    avgInfectedNumber /= Object.keys(infecedNumber).length;
    avgInfectionRate = avgInfectionRate / initPopulation * 100;
    avgMortalityRate /= day;

    const simulationData = {
        maxInfected,
        minInfected,
        avgInfectedNumber,
        dailyInfection,
        avgInfectionRate: avgInfectionRate.toFixed(2),
        pandemicDuration: day,
        avgMortalityRate: avgMortalityRate * 100,
        oneShot: oneShot / (document.getElementById("oneShotInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100,
        twoShot: twoShot / (document.getElementById("twoShotInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100,
        immunity: immunity / (document.getElementById("immunityInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100
    };

    sessionStorage.setItem("simulationData", JSON.stringify(simulationData));
}

// Get dataset data for the current state of the simulation
function getDatasetData() {
    if (healthy == 0 || infected == 0) {
        return null;
    }
    return {
        population: healthy,
        infected,
        recovery,
        dead,
        immunity,
        oneShot,
        twoShot
    };
}

// Get percentage data for the current state of the simulation
function getPercentDataSet() {
    return {
        populationPercent,
        infectedPercent,
        recoveryPercent,
        deadPercent,
        immunityPercent,
        oneShotPercent,
        twoShotPercent
    };
}

// Main function to initialize the simulation
function main() {
    window.scrollTo(0, 0);
    setValues();
    setInputAttribute();

    setTimeout(() => {
        setBounds();
        setAttribute();
        setPercentAttribute();

        initializeAllDots();
        createDots();
    }, TIME);
}