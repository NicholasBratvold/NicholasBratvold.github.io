const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const n = 2000;
const dt = 0.02;
const frictionHL = 0.040;
const rMax = 0.1;
const m = 6;
const attractions = makeRandomAttractionMatrix();
const forceFactor = 6;
const frictionFactor = Math.pow(0.5, dt/frictionHL);

//Particle Initialization
const screenR = 1;
const colours = new Int32Array(n);
const posX = new Float32Array(n);
const posY = new Float32Array(n);
const velX = new Float32Array(n);
const velY = new Float32Array(n);

// Define grid parameters
const gridSize = rMax*2000;
const gridWidth = Math.ceil(canvas.width / gridSize);
const gridHeight = Math.ceil(canvas.height / gridSize);

// Initialize the grid
const grid = new Array(gridWidth * gridHeight);

function clearGrid() {
    for (let i = 0; i < grid.length; i++) {
        grid[i] = [];
    }
}

function updateGrid() {
    clearGrid();

    // Update particle positions in the grid
    for (let i = 0; i < n; i++) {
        const gridX = Math.floor(posX[i] * canvas.width / gridSize);
        const gridY = Math.floor(posY[i] * canvas.height / gridSize);

        if (!grid[gridY * gridWidth + gridX]) {
            grid[gridY * gridWidth + gridX] = [];
        }

        grid[gridY * gridWidth + gridX].push(i);
    }
}

function findNeighbors(particleIndex) {
    const neighbors = [];

    const gridX = Math.floor(posX[particleIndex] * canvas.width / gridSize);
    const gridY = Math.floor(posY[particleIndex] * canvas.height / gridSize);

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const neighborX = (gridX + dx + gridWidth) % gridWidth;
            const neighborY = (gridY + dy + gridHeight) % gridHeight;

            if (grid[neighborY * gridWidth + neighborX]) {
                neighbors.push(...grid[neighborY * gridWidth + neighborX]);
            }
        }
    }

    return neighbors;
}



for(let i=0; i< n; i++){
    colours[i] = Math.floor(Math.random()*m);
    posX[i] = Math.random();
    posY[i] = Math.random();
    velX[i] = 0;
    velY[i] = 0;
}

function loop(){
    //Update
    updateParticles();
    //Draw
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    for(let i=0; i<n; i++){
        ctx.beginPath();
        const screenX = posX[i]*canvas.width;
        const screenY = posY[i]*canvas.height;
        ctx.arc(screenX, screenY, screenR, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${360 * (colours[i] / m)}, 100%, 50%)`;
        ctx.fill();
    }

    requestAnimationFrame(loop);
}

function updateParticles(){

    updateGrid();

    for(let i=0; i< n; i++){
        let accX = 0;
        let accY = 0;

        const neighbors = findNeighbors(i);

        for(const j of neighbors){
            if (j==i) continue;
            const dx = posX[j] - posX[i];
            const dy = posY[j] - posY[i];
            const r = Math.hypot(dx,dy);
            if( r > 0 && r<rMax){
                const a = acceleration(r / rMax, attractions[colours[i]][colours[j]]);
                accX += dx / r * a;
                accY += dy / r * a;
            }
        }
        accX *= rMax * forceFactor;
        accY *= rMax * forceFactor;

        velX[i] *= frictionFactor;
        velY[i] *= frictionFactor;
        velX[i] += accX * dt;
        velY[i] += accY * dt;    
    }

    for (let i = 0; i< n; i++){
        const offset = 0.05
        posX[i] += velX[i]* dt;
        posY[i] += velY[i]* dt;

        if (posX[i] < 0 - offset) {
            posX[i] += 1 + 2*offset;
        } else if (posX[i] > 1 + offset) {
            posX[i] -= (1 + 2*offset);
        }

        if (posY[i] < 0 - offset) {
            posY[i] += 1 + 2*offset;
        } else if (posY[i] > 1 + offset) {
            posY[i] -= (1 + 2*offset);
        }
    }
}

function acceleration(r, a){
    const beta = 0.3;
    if(r< beta){
        return r / beta -1;
    } else if( beta < r && r < 1){
        return a * (1 - Math.abs(2 * r - 1 - beta)/(1 - beta));
    } else {
        return 0;
    }
}

// Produces Random Attraction Matrix for m particle types
function makeRandomAttractionMatrix(){
    const matrix = [];
    for (let i=0; i< m; i++){
        const row = [];
        for (let j = 0; j< m; j++){
            row.push(Math.random() *2 - 1);
        }
        matrix.push(row);
    }
    return matrix;   
}
loop();
