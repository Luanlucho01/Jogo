import Penguim from "./classes/Penguim.js";
import Tronco from "./classes/Tronco.js";
import { GameState } from "./utils/constants.js";

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const highElement = scoreUi.querySelector(".high > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.classList.remove("show");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const gameAreaMargin = 360;
const gameAreaX = gameAreaMargin;
const gameAreaWidth = canvas.width - (gameAreaMargin * 2);

function drawGameAreaBorders(ctx, canvasHeight, gameAreaX, gameAreaWidth) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    const barWidth = 5;
    ctx.fillRect(gameAreaX - barWidth, 0, barWidth, canvasHeight);
    ctx.fillRect(gameAreaX + gameAreaWidth, 0, barWidth, canvasHeight);
    ctx.restore();
}

const penguim = new Penguim(canvas.width, canvas.height, gameAreaX, gameAreaWidth);

let currentState = GameState.START;
let startTime = null;

const gameData = {
    score: 0,
    high: 0,
    lives: 3,
};

const keys = {
    left: false,
    right: false,
};

const troncos = [];
let troncoSpawnInterval = null;

function spawnTronco() {
    if (troncos.length < 3) {
        const tronco = new Tronco(canvas.width, canvas.height, 6);
        troncos.push(tronco);
    }
}

function isColliding(rect1, rect2) {
    return (
        rect1.position.x < rect2.position.x + rect2.width &&
        rect1.position.x + rect1.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height > rect2.position.y
    );
}

const incrementScore = (value) => {
    gameData.score += value;

    if (gameData.score > gameData.high) {
        gameData.high = gameData.score;
    }
};

const showGameData = () => {
    scoreElement.textContent = gameData.score;
    highElement.textContent = gameData.high;

    if (!document.querySelector(".lives-ui")) {
        const livesUi = document.createElement("div");
        livesUi.classList.add("lives-ui");
        livesUi.style.marginTop = "10px";
        livesUi.style.textTransform = "uppercase";
        livesUi.style.fontSize = "1rem";
        livesUi.innerHTML = `Lives: <span>${gameData.lives}</span>`;
        scoreUi.appendChild(livesUi);
    } else {
        document.querySelector(".lives-ui span").textContent = gameData.lives;
    }
};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGameAreaBorders(ctx, canvas.height, gameAreaX, gameAreaWidth);

    if (currentState === GameState.PLAYING) {
        const currentTime = performance.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

        incrementScore(elapsedSeconds * 10 - gameData.score);
        const troncoSpeed = Math.min(3 + elapsedSeconds * 0.1, 15);

        showGameData();

        for (const tronco of troncos) {
            tronco.velocity = troncoSpeed;
            tronco.fall(canvas.height, canvas.width, gameAreaX, gameAreaWidth);
            tronco.draw(ctx);

            if (isColliding(penguim.getHitbox(), tronco)) {
                gameData.lives--;

                if (gameData.lives <= 0) {
                    currentState = GameState.GAME_OVER;
                    gameOverScreen.classList.add("show");
                    clearInterval(troncoSpawnInterval);
                } else {
                    tronco.travelProgress = 1; // força o respawn
                }
            }
        }

        ctx.save();
        ctx.translate(penguim.position.x + penguim.width / 2, penguim.position.y + penguim.height / 2);

        if (keys.left) {
            penguim.moveLeft();
            ctx.rotate(-0.3);
        }
        if (keys.right) {
            penguim.moveRight();
            ctx.rotate(0.3);
        }

        ctx.translate(-penguim.position.x - penguim.width / 2, -penguim.position.y - penguim.height / 2);
        penguim.draw(ctx);
        ctx.restore();
    }

    requestAnimationFrame(gameLoop);
};

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
});

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
});

buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;
    gameData.score = 0;
    gameData.lives = 3;
    startTime = performance.now();

    clearInterval(troncoSpawnInterval);
    troncos.length = 0;

    spawnTronco();
    troncoSpawnInterval = setInterval(spawnTronco, 2000); // a cada 2 segundos
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    gameData.score = 0;
    gameData.lives = 3;
    gameOverScreen.classList.remove("show");
    startTime = performance.now();

    clearInterval(troncoSpawnInterval);
    troncos.length = 0;

    spawnTronco();
    troncoSpawnInterval = setInterval(spawnTronco, 2000);
});

gameLoop();
