class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarBottle = new StatusBarBottle();
    statusBarCoin = new StatusBarCoin();
    statusBarEndBoss = new StatusBarEndBoss();
    throwableObjects = [];
    coinCounter = 0;
    gameOver = false;

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard; 
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld(){
        this.character.world = this; // es wird nur "this" übergeben damit man die aktuelle Instanz der Welt hat
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        },200);
    }

    checkThrowObjects(){ // Flaschen werfen
        if (this.keyboard.SHIFT) {
            this.character.throwBottle();
        }
    }

    checkCollisions() {

        // Kollisionsprüfung für den Charakter mit Gegnern
        this.level.enemies.forEach( (enemy) => {
            if( this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });

        // Kollisionsprüfung für den Charakter mit Münzen
        this.level.coins.forEach( (coin) => {
            if( this.character.isColliding(coin)){
                this.character.collectCoin(coin);
                this.coinCounter++;
                let percentage = (this.coinCounter / 10) * 100; // 10 Münzen 100%
                this.statusBarCoin.setPercentage(percentage); // Aktualisiere die Statusleiste basierend auf dem Prozentsatz
            }
        });

        // Kollisionsprüfung für den Charakter mit Flaschen
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.collectBottle(bottle);
                let bottlePercentage = (this.character.bottlesCollected / 8) * 100; // 8 Flaschen entsprechen 100%
                this.statusBarBottle.setPercentage(bottlePercentage); // Aktualisiere die Statusleiste basierend auf dem Prozentsatz
            }
        });

        // Kollisionsprüfung für geworfene Flaschen mit dem Boden
        this.throwableObjects.forEach((bottle) => {
            this.checkCollisionBottleGround(bottle);
        });
    }

    removeObject(object) {
        if(object instanceof Coin) {
            this.level.coins.splice(this.level.coins.indexOf(object), 1);
        } else if (object instanceof Bottle) {
            this.level.bottles.splice(this.level.bottles.indexOf(object), 1);
        }
    }

    checkCollisionBottleGround(bottle) {
        if (!bottle.isAboveGround()) {
            bottle.isColliding = true;
            setTimeout(() => {
                this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1)
            }, 50);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        // ------ Space for fixed objects ------
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarEndBoss);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        // this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        //Draw() wird immer wieder eingefügt 
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection){
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}