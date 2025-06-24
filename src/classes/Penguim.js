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


        // hitbox do pinguim
        this.hitbox = {
            offsetX: 50,
            offsetY: 20,
            width: 30,
            height: 80,
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

    getHitbox() {
        return {
            position: {
                x: this.position.x + this.hitbox.offsetX,
                y: this.position.y + this.hitbox.offsetY,
            },
            width: this.hitbox.width,
            height: this.hitbox.height
        };
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        // comando abaixo desenha a hitbox do pinguim, descomentar para ver
        // const hb = this.getHitbox();
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(hb.position.x, hb.position.y, hb.width, hb.height);
    }
}
 
export default Penguim;
