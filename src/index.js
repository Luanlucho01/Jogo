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

gameOverScreen.remove();

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
};

const keys = {
    left: false,
    right: false,
};

const troncos = [];


for (let i = 0; i < 5; i++) {
    const x = gameAreaX + Math.random() * (gameAreaWidth - 120);
    const y = Math.random() * - canvas.height;
    troncos.push(new Tronco({ x, y }, 6));
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
};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGameAreaBorders(ctx, canvas.height, gameAreaX, gameAreaWidth);

    if (currentState === GameState.PLAYING) {
        const currentTime = performance.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

        incrementScore(elapsedSeconds * 10 - gameData.score);
        const troncoSpeed = Math.min(6 + elapsedSeconds * 0.1, 15);

        showGameData();

        for (const tronco of troncos) {
            tronco.velocity = troncoSpeed;
            tronco.fall(canvas.height, canvas.width, gameAreaX, gameAreaWidth);
            tronco.draw(ctx);

            if (isColliding(penguim, tronco)) {
                currentState = GameState.GAME_OVER;
                console.log("Game Over");
                document.body.append(gameOverScreen);
            }
        }

        ctx.save();

        ctx.translate(
            penguim.position.x + penguim.width / 2, 
            penguim.position.y + penguim.height / 2
        );

        if (keys.left) {
            penguim.moveLeft();
            ctx.rotate(-0.3);
        }
        if (keys.right) {
            penguim.moveRight();
            ctx.rotate(0.3);
        }

        ctx.translate(
            - penguim.position.x - penguim.width / 2, 
            - penguim.position.y - penguim.height / 2
        );

        penguim.draw(ctx);

        ctx.restore();
    }

    if (currentState === GameState.GAME_OVER) {
        for (const tronco of troncos) {
            tronco.fall(canvas.height, canvas.width, gameAreaX, gameAreaWidth);
            tronco.draw(ctx);
        }
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
    startTime = performance.now();
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    gameData.score = 0;
    gameOverScreen.remove();
    startTime = performance.now();

    for (const tronco of troncos) {
        tronco.position.x = gameAreaX + Math.random() * (gameAreaWidth - tronco.width);
        tronco.position.y = Math.random() * -canvas.height;
    }
});

gameLoop();
