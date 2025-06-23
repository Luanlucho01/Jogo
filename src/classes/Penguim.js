import { PATH_PENGUIM_IMAGE } from "../utils/constants.js";

class Penguim {
    constructor(canvasWidth, canvasHeight, gameAreaX, gameAreaWidth) {
        this.width = 132;
        this.height = 120;
        this.velocity = 10;
        this.position = {
            x: gameAreaX + (gameAreaWidth / 2) - (this.width / 2),
            y: canvasHeight - this.height,
        };

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gameAreaX = gameAreaX;        
        this.gameAreaWidth = gameAreaWidth; 

        this.image = this.getImage(PATH_PENGUIM_IMAGE);
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft() {
        this.position.x -= this.velocity;
        if (this.position.x < this.gameAreaX) {
            this.position.x = this.gameAreaX;
        }
    }

    moveRight() {
        this.position.x += this.velocity;
        if (this.position.x + this.width > this.gameAreaX + this.gameAreaWidth) {
            this.position.x = this.gameAreaX + this.gameAreaWidth - this.width;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}
 
export default Penguim;
