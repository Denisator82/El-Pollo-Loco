class MovableObject extends DrawableObject {
    speed = 0.55;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    standingTime = 0;
    sleepDelay = 5000;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }else {
                this.speedY = 0; // reset the vertical speed when the character is on the ground
            }
        }, 1000 / 25);
    }

    isAboveGround(){
        if (this instanceof ThrowableObject) { // Throwable object should always fall
            return true;
        } else {
            return this.y < 175  ;
        }
    }

    // character.isColliding
    isColliding(mo) {
        return this.x + this.width - this.offset.right> mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom> mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    // Wurden aus der Sicherung hinzugefügt **

    // collectCoin(coin) {
    //     if (this.isColliding(coin)) {
    //         this.world.removeObject(coin); //Entferne die Münze aus der Welt
    //     }
    // }

    // collectBottle(bottle) {
    //     if (this.isColliding(bottle)) {
    //         this.world.removeObject(bottle); //Entferne die Flasche aus der Welt
    //     }
    // }
    

    // checkCollisions(){
    //     this.world.coins.array.forEach(coin => {
    //         this.collectCoin(coin);
    //     });

    //     this.world.bottles.array.forEach(bottle => {
    //         this.collectBottle(bottle);
    //     });
    // }

    // **

    hit() {
        this.energy -= 5;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images){
        let i = this.currentImage % images.length; // let i = 7 % 6; => 1, Rest 1
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
        }

    moveLeft(){
        this.x -= this.speed;   
    }

    jump(){
        if (!this.isAboveGround()){
            this.speedY = 25;
            }
    }
}