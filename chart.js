var MINX = 0;
var MAXX = 0;
var MINY = 0;
var MAXY = 0;
const CHANGEPOSITION = 5;
const WEEKS = 52;
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
var deadPercent = 0
var populationPercent = 100
var dead = 0;
let initPopulation

const dots = [];

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
    console.log("input");

    document.getElementById("populationInput").innerHTML = totalPopulation;
    document.getElementById("immunityInput").innerHTML = immunityPercent + "%";
    document.getElementById("infectedInput").innerHTML = infectedPercent + "%";
    document.getElementById("oneShotInput").innerHTML = oneShotPercent + "%";
    document.getElementById("twoShotInput").innerHTML = twoShotPercent + "%";
    document.getElementById("recoveryInput").innerHTML = recoveryPercent + "%";
}

function setAttribute() {
    console.log("attributes");
    console.log(healthy);

    document.getElementById("population").innerHTML = Math.trunc(healthy);
    document.getElementById("immunity").innerHTML = immunity;
    document.getElementById("infected").innerHTML = infected;
    document.getElementById("oneShot").innerHTML = oneShot;
    document.getElementById("twoShot").innerHTML = twoShot;
    document.getElementById("recovery").innerHTML = recovery;
    document.getElementById("dead").innerHTML = dead;
}

function setPercentAttribute() {
    console.log("percent");


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

function setValues() {

    let values = JSON.parse(sessionStorage.getItem("attributes"))

    totalPopulation = values.population
    initPopulation = totalPopulation
    infectedPercent = values.infectedPercent
    immunityPercent = values.immunityPercent
    oneShotPercent = values.oneShotPercent
    twoShotPercent = values.twoShotPercent
    recoveryPercent = values.recoveryPercent

    immunity = Math.floor(totalPopulation * immunityPercent / 100);
    oneShot = Math.floor(totalPopulation * oneShotPercent / 100);
    twoShot = Math.floor(totalPopulation * twoShotPercent / 100);
    recovery = Math.floor(totalPopulation * recoveryPercent / 100);
    infected = Math.floor(totalPopulation * infectedPercent / 100);
    healthy = totalPopulation - infected - recovery;
}

function initializeXY(dot) {
    dot.x = Math.floor(Math.random() * (MAXX - MINX) + MINX);
    dot.y = Math.floor(Math.random() * (MAXY - MINY) + MINY);
}

function updatePosition(dot) {
    dot.x += Math.floor(Math.random() * CHANGEPOSITION * 2 - CHANGEPOSITION);
    dot.y += Math.floor(Math.random() * CHANGEPOSITION * 2 - CHANGEPOSITION);

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
            dotElement.style.backgroundColor = "rgb(78, 0, 141)";
            dotElement.className = "dot dead"
            break;
        case "recovery":
            dotElement.style.backgroundColor = "rgb(0, 255, 0)";
            dotElement.className = "dot recovery"
            break;
        case "infected":
            dotElement.style.backgroundColor = "red";
            dotElement.className = "dot infected"
            break;
        default:
            dotElement.style.backgroundColor = "rgb(109, 209, 255)"; // Healthy
            dotElement.className = "dot healthy"
    }
}
function updateAttributes() {
    infected = document.getElementsByClassName("dot infected").length
    dead = document.getElementsByClassName("dot dead").length
    console.log("in update");
    healthy = document.getElementsByClassName("dot healthy").length
    console.log(healthy);

    recovery = document.getElementsByClassName("dot recovery").length
}

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

function overlap(dot1, dot2) {
    return Math.abs(dot1.x - dot2.x) < 3 && Math.abs(dot1.y - dot2.y) < 3;
}


var infecedNumber = {}
var dailyInfection = []
var avgInfectionRate = 0;
var avgMortalityRate = 0;

function updatePage() {
    let initialInfected = infected

    updateSimulation()

    dailyInfection.push(infected - initialInfected > 0 ? infected - initialInfected : 0)
    avgInfectionRate += dailyInfection[day]
    avgMortalityRate += dead / (initPopulation - dead)
    day++;
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
                        let tempIndex = dots[i].status === "infected" ? j : i;

                        let chance = 100;
                        if (targetDot.status === "recovery") chance -= 40
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
                    if (dot.oneShot) {
                        oneShot--;
                    }
                    if (dot.twoShot) {
                        twoShot--;
                    }
                    if (dot.immunity) {
                        immunity--;
                    }
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
        updateAttributes()

        if (dot.status !== "dead") {
            placeDot(dotElements[i], dot);
        }
    }
}

var maxInfected = { infected: 0, day: 0, population: healthy, dead: dead }
var minInfected = { infected: 100000, day: 0, population: healthy, dead: dead }
function maxMinCases(day) {

    if (maxInfected.infected < infected) {
        maxInfected.infected = infected
        maxInfected.day = day
        maxInfected.dead = dead
        maxInfected.population = healthy
    }
    if (minInfected.infected > infected) {
        minInfected.infected = infected
        minInfected.day = day
        minInfected.dead = dead
        minInfected.population = healthy
    }
}
function sendToSession() {

    let avgInfectedNumber = 0;
    for (const i in infecedNumber) {
        avgInfectedNumber += infecedNumber[i]
    }
    avgInfectedNumber /= Object.keys(infecedNumber).length
    avgInfectionRate = avgInfectionRate / initPopulation * 100

    avgMortalityRate /= day



    console.log(maxInfected); // { infected: 0, day: 0, population: healthy, dead: dead }
    console.log(minInfected); // { infected: 100000, day: 0, population: healthy, dead: dead }
    console.log(avgInfectedNumber); // number of people on avg a person infected
    console.log(dailyInfection); // graph [123,34,87,0,0,548]
    console.log(avgInfectionRate); // 43%
    console.log(day); // pandemic duration
    console.log(avgMortalityRate * 100); // dead rate

    console.log({ oneShot: oneShot / (document.getElementById("oneShotInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100 }); // percent of one shot people that survived
    console.log({ twoShot: twoShot / (document.getElementById("twoShotInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100 }); // percent of two shot people that survived
    console.log({ immunity: immunity / (document.getElementById("immunityInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100 }); // percent of immunity people that survived

    const simulationData = {
        maxInfected,
        minInfected,
        avgInfectedNumber,
        dailyInfection,
        avgInfectionRate,
        pandemicDuration: day,
        avgMortalityRate: avgMortalityRate * 100,
        oneShot: oneShot / (document.getElementById("oneShotInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100,
        twoShot: twoShot / (document.getElementById("twoShotInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100,
        immunity: immunity / (document.getElementById("immunityInput").innerHTML.replace('%', '') / 100 * initPopulation) * 100
    };

    sessionStorage.setItem("simulationData", JSON.stringify(simulationData));
}



function getDatasetData() {

    if (healthy == 0 || infected == 0) {
        return null
    }
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
    window.scrollTo(0, 0);
    setValues()




    setInputAttribute()

    setTimeout(() => {
        setBounds()
        setAttribute()
        setPercentAttribute()

        initializeAllDots();
        createDots();

    }, TIME);
}