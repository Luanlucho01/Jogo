import { HIT_SOUND_PATH, PATH_PENGUIM_IMAGE, PATH_PENGUIM_JUMP_IMAGE } from "../utils/constants.js";

class Penguim {
    constructor(canvasWidth, canvasHeight, gameAreaX, gameAreaWidth) {
        this.originalWidth = 132;
        this.originalHeight = 120;

        this.currentWidth = this.originalWidth;
        this.currentHeight = this.originalHeight;

        this.velocity = 20; 

        this.position = {
            x: gameAreaX + (gameAreaWidth / 2) - (this.originalWidth / 2),
            y: canvasHeight - this.originalHeight,
        };

        // hitbox do pinguim
        this.hitbox = {
            width: 100,  
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
        this.initialJumpForce = -22; 
        this.groundY = canvasHeight - this.originalHeight;
        this.jumpScaleFactor = 1.4; 

        this.isInvincible = false;
        this.invincibilityDuration = 1500; 
        this.blinkInterval = 100; 
        this.lastBlinkTime = 0;
        this.invincibilityStartTime = 0;
        this.isVisible = true; 

        this.hitSound = new Audio(HIT_SOUND_PATH);
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

        if (this.isInvincible) {
            const now = performance.now();
            if (now - this.invincibilityStartTime > this.invincibilityDuration) {
                this.isInvincible = false;
                this.isVisible = true;
            } else if (now - this.lastBlinkTime > this.blinkInterval) {
                this.isVisible = !this.isVisible;
                this.lastBlinkTime = now;
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

    hit() {
        if (!this.isInvincible) {
            this.isInvincible = true;
            this.invincibilityStartTime = performance.now();
            this.lastBlinkTime = performance.now();
            this.isVisible = false;

            if (this.hitSound) {
                this.hitSound.currentTime = 0;
                this.hitSound.play();
            }
        }
    }



    draw(ctx) {
    const imageToDraw = this.isJumping ? this.jumpImage : this.image;
    const drawX = this.position.x - (this.currentWidth - this.originalWidth) / 2;
    const drawY = this.position.y - (this.currentHeight - this.originalHeight);

    if (this.isInvincible) {
        ctx.save();
        ctx.globalAlpha = this.isVisible ? 1 : 0; 
        ctx.drawImage(imageToDraw, drawX, drawY, this.currentWidth, this.currentHeight);

        if (this.isVisible) {
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(drawX, drawY, this.currentWidth, this.currentHeight);
        }

        ctx.restore();
    } else {
        ctx.drawImage(imageToDraw, drawX, drawY, this.currentWidth, this.currentHeight);
    }

    const hb = this.getHitbox();
    ctx.strokeStyle = "red";
    ctx.strokeRect(hb.position.x, hb.position.y, hb.width, hb.height);
}

}

export default Penguim;
