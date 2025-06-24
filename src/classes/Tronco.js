import { PATH_TRONCO_IMAGE } from "../utils/constants.js";

class Tronco {
    constructor(canvasWidth, canvasHeight, velocity) {
        // ponto de origem do tronco (centro)
        this.origin = {
            x: canvasWidth / 2,      // spawn horizontal do tronco (ja ta no meio da tela)
            y: canvasHeight * 0.5    // spawn vertical do tronco
        };

        const offsetX = (Math.random() - 0.5) * canvasWidth * 0.6;

        this.position = {
            x: this.origin.x,
            y: this.origin.y
        };

        // tamanho da hitbox dos troncos/obstaculos
        this.fixedHitboxWidth = 100; 
        this.fixedHitboxHeight = 80;

        this.targetX = this.origin.x + offsetX;
        this.distanceY = canvasHeight;
        this.velocity = velocity;
        this.travelProgress = 0;

        // tamanho do spawn do tronco (base e máximo)
        this.baseWidth = 45;
        this.baseHeight = 30;

        this.maxWidth = 200;
        this.maxHeight = 160;

        this.width = this.baseWidth;
        this.height = this.baseHeight;

        const randomIndex = Math.floor(Math.random() * PATH_TRONCO_IMAGE.length);
        this.image = this.getImage(PATH_TRONCO_IMAGE[randomIndex]);
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x - this.width / 2,   
            this.position.y - this.height / 2,  
            this.width,
            this.height
        );

        // Desenha a hitbox do tronco
        //const hb = this.getHitbox();
        //ctx.strokeStyle = "red";
        //ctx.strokeRect(hb.position.x, hb.position.y, hb.width, hb.height);
    }

    getHitbox() {
        // Calcula o canto superior esquerdo da ÁREA ONDE A IMAGEM ATUAL DO TRONCO ESTÁ SENDO DESENHADA
        const imageDrawX = this.position.x - this.width / 2;
        const imageDrawY = this.position.y - this.height / 2;

        return {
            position: {
                x: imageDrawX + (this.width - this.fixedHitboxWidth) / 2,
                y: imageDrawY + (this.height - this.fixedHitboxHeight) / 2,
            },
            width: this.fixedHitboxWidth,
            height: this.fixedHitboxHeight
        };
    }

    fall(canvasHeight, canvasWidth, gameAreaX, gameAreaWidth) {
        this.travelProgress += this.velocity / canvasHeight;

        if (this.travelProgress >= 1) {
            this.travelProgress = 0;
            this.position = { ...this.origin };

            // desvio aleatório do tronco
            const offsetX = (Math.random() - 0.5) * canvasWidth * 0.6;
            this.targetX = this.origin.x + offsetX;
        }

        this.position.x = this.origin.x + (this.targetX - this.origin.x) * this.travelProgress;
        this.position.y = this.origin.y + this.distanceY * this.travelProgress;

        this.width = this.baseWidth + (this.maxWidth - this.baseWidth) * this.travelProgress;
        this.height = this.baseHeight + (this.maxHeight - this.baseHeight) * this.travelProgress;
    }
}

export default Tronco;
