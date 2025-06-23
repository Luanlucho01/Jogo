import { PATH_TRONCO_IMAGE } from "../utils/constants.js";

class Tronco {
    constructor(position, velocity) {
        this.position = position;
        this.width = 113;
        this.height = 80;
        this.velocity = velocity;
        this.image = this.getImage(PATH_TRONCO_IMAGE);
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveRight() {
        this.position.x += this.velocity;
    }

    draw(ctx) { 
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    fall(canvasHeight, canvasWidth, gameAreaX, gameAreaWidth) {
        this.position.y += this.velocity;

        if (this.position.y > canvasHeight) {
            const minResetY = -this.height * 3; 
            const maxResetY = -this.height;     
            
            this.position.y = minResetY + Math.random() * (maxResetY - minResetY);

            const minX = gameAreaX;
            const maxX = gameAreaX + gameAreaWidth - this.width;
            this.position.x = minX + Math.random() * (maxX - minX);
        }
    }
}

export default Tronco;
