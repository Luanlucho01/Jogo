import { PATH_PENGUIM_IMAGE, PATH_PENGUIM_JUMP_IMAGE } from "../utils/constants.js";

class Penguim {
    constructor(canvasWidth, canvasHeight, gameAreaX, gameAreaWidth) {
        this.originalWidth = 132;
        this.originalHeight = 120;

        this.currentWidth = this.originalWidth;
        this.currentHeight = this.originalHeight;

        this.velocity = 10; 

        this.position = {
            x: gameAreaX + (gameAreaWidth / 2) - (this.originalWidth / 2),
            y: canvasHeight - this.originalHeight,
        };

        // hitbox do pinguim
        this.hitbox = {
            width: 60,  
            height: 60, 
        };

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gameAreaX = gameAreaX;
        this.gameAreaWidth = gameAreaWidth;

        this.image = this.getImage(PATH_PENGUIM_IMAGE); 
        this.jumpImage = this.getImage(PATH_PENGUIM_JUMP_IMAGE); 

        this.isJumping = false; 
        this.jumpVelocityY = 0;
        this.gravity = 0.8; 
        this.initialJumpForce = -15; 
        this.groundY = canvasHeight - this.originalHeight;
        this.jumpScaleFactor = 1.2; 
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
        if (this.position.x + this.currentWidth > this.gameAreaX + this.gameAreaWidth) {
            this.position.x = this.gameAreaX + this.gameAreaWidth - this.currentWidth;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocityY = this.initialJumpForce; 
        }
    }

    update() {
        if (this.isJumping) {
            this.jumpVelocityY += this.gravity; 
            this.position.y += this.jumpVelocityY; 

            const normalizedJumpVelocity = Math.abs(this.jumpVelocityY / this.initialJumpForce);
            const scale = 1 + (this.jumpScaleFactor - 1) * (1 - normalizedJumpVelocity);

            this.currentWidth = this.originalWidth * scale;
            this.currentHeight = this.originalHeight * scale;

            if (this.position.y >= this.groundY) {
                this.position.y = this.groundY; 
                this.isJumping = false; 
                this.jumpVelocityY = 0; 
                this.currentWidth = this.originalWidth; 
                this.currentHeight = this.originalHeight; 
            }
        }
    }

    getHitbox() {
        const hitboxX = this.position.x + (this.currentWidth - this.hitbox.width) / 2;
        const hitboxY = this.position.y + (this.currentHeight - this.hitbox.height) / 2;

        return {
            position: {
                x: hitboxX,
                y: hitboxY,
            },
            width: this.hitbox.width,
            height: this.hitbox.height
        };
    }

    draw(ctx) {
        
        const imageToDraw = this.isJumping ? this.jumpImage : this.image;

        const drawX = this.position.x - (this.currentWidth - this.originalWidth) / 2;
        const drawY = this.position.y - (this.currentHeight - this.originalHeight);
        ctx.drawImage(imageToDraw, drawX, drawY, this.currentWidth, this.currentHeight);

        // Comando abaixo desenha a hitbox do pinguim (descomentar para ver)
        const hb = this.getHitbox();
        ctx.strokeStyle = "red";
        ctx.strokeRect(hb.position.x, hb.position.y, hb.width, hb.height);
    }
}

export default Penguim;
