/**
 * Represents the game world.
 * Initializes the character, level, canvas context, keyboard input, 
 * camera position, status bars, throwable objects, and the coin counter.
 */
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
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = [];
    coinCounter = 0;

    /**
     * Initializes the World class.
     * Sets up the canvas context, the canvas element, and the keyboard input.
     * Calls methods to draw the initial game state, set the world, and start the game loop.
     * 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the game on.
     * @param {Object} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard; 
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Allows the character to access all information about the world.
     * Sets the current world instance to the character.
     */
    setWorld() {
        this.character.world = this; // es wird nur "this" übergeben damit man die aktuelle Instanz der Welt hat
    }

    /**
    * Starts the interval for the game.
    * Continuously checks for collisions and manages throwable objects every 200 milliseconds.
    */
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }

    /**
    * Checks if the SHIFT key is pressed to throw a bottle.
    * If the SHIFT key is pressed, the character throws a bottle.
    */
    checkThrowObjects() {
        if (this.keyboard.SHIFT) {
            this.character.throwBottle();
        }
    }

    /**
     * Checks all collisions in the game.
     * Calls methods th check for collisions with enemies, coins and bottles.
     */
    checkCollisions() {
        this.checkCollisionsWithEnemies();
        this.checkCollisionsWithCoins();
        this.checkCollisionsWithBottles();
    }
    
    /**
     * Checks collision between character and enemies.
     * If a collision is detected, the character takes a hit and the status bar is updated.
     */
    checkCollisionsWithEnemies() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Checks collision between character and coins.
     * If a collision is detected, the coin is collected, the coin counter is incremented,
     * and the coin status bar is updated.
     */
    checkCollisionsWithCoins() {
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                this.character.collectCoin(coin);
                this.coinCounter++;
                let percentage = (this.coinCounter / 10) * 100;
                this.statusBarCoin.setPercentage(percentage);
            }
        });
    }

    /**
     * Checks collision between character and bottles.
     * If a collision is detected, the bottle is collected, 
     * the number of collected bottles is updated, 
     * and the bottle status bar is updated based on the collected percentage.
     */
    checkCollisionsWithBottles() {
        this.level.bottles.forEach(bottle => {
            if (this.character.isColliding(bottle)) {
                this.character.collectBottle(bottle);
                let bottlePercentage = (this.character.bottlesCollected / 8) * 100;
                this.statusBarBottle.setPercentage(bottlePercentage);
            }
        });
    }

    /**
     * Removes an object (coin or bottle) from the level.
     * If the object is a coin or bottle, it finds its index in the corresponding array
     * and removes it if the index is valid.
     */
    removeObject(object) {
        if (object instanceof Coin) {
            const index = this.level.coins.indexOf(object);
            if (index > -1) {
                this.level.coins.splice(index, 1);
            }
        } else if (object instanceof Bottle) {
            const index = this.level.bottles.indexOf(object);
            if (index > -1) {
                this.level.bottles.splice(index, 1);
            }
        }
    }

    /**
     * Draws the entire game frame by frame.
     * Clears the canvas, translates the context based on camera position,
     * checks for collisions and other game logic, and then draws all game objects.
     */
    draw() {
        // Clear the entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Translate the context based on the camera position
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        // ---- Überprüfe Kollision und andere Logiken ----
        this.checkCollisions();
        this.checkThrowObjects();

        // Reset the translation for fixed objects
        this.ctx.translate(-this.camera_x, 0);
        // ------ Space for fixed objects ------
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0);

        // Draw the character and game objects
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);

        // Reset the translation back for the next frame
        this.ctx.translate(-this.camera_x, 0);

        // Call draw() again to create an animation loop
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * Adds an array of objects to the map.
     * Iterates through each object and calls the addToMap method to draw it on the canvas.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the map.
     * If the object is facing the other direction, flips the image before drawing.
     * Draws the object and its frame on the canvas.
     * If the image was flipped, flips it back to its original orientation.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image horizontally by saving the context,
     * translating and scaling the canvas context.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the original orientation of the image by
     * flipping it back to its original position.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}

/*Muss geprüft werden 03.02.2025***/
    // checkCollisions(){
    //     this.level.enemies.forEach( (enemy) => {
    //         if( this.character.isColliding(enemy)){
    //             this.character.hit();
    //             this.statusBar.setPercentage(this.character.energy);
    //         }
    //     });

    //     this.level.endboss.forEach( (enemy) => {
    //         if( this.character.isColliding(enemy)){
    //             this.character.hit();
    //             this.statusBar.setPercentage(this.character.energy);
    //         }
    //     });

    //     this.level.coins.forEach( (coin) => {
    //         if( this.character.isColliding(coin)){
    //             this.character.collectCoin(coin);
    //             this.coinCounter++;
    //             let percentage = (this.coinCounter / 10) * 100; // 10 Münzen 100%
    //             this.statusBarCoin.setPercentage(percentage); // Aktualisiere die Statusleiste basierend auf dem Prozentsatz
    //         }
    //     });

    //     this.level.bottles.forEach((bottle) => {
    //         if (this.character.isColliding(bottle)) {
    //             this.character.collectBottle(bottle);
    //             let bottlePercentage = (this.character.bottlesCollected / 8) * 100; // 8 Flaschen entsprechen 100%
    //             this.statusBarBottle.setPercentage(bottlePercentage); // Aktualisiere die Statusleiste basierend auf dem Prozentsatz
    //         }
    //     });
    // }

    // removeObject(object) {
    //     if(object instanceof Coin) {
    //         this.level.coins.splice(this.level.coins.indexOf(object), 1);
    //     } else if (object instanceof Bottle) {
    //         this.level.bottles.splice(this.level.bottles.indexOf(object), 1);
    //     }
    // }

        // checkCollisions(){
    //     this.checkCollisionsWithEnemies();
    //     this.checkCollisionsWithCoins();
    //     this.checkCollisionsWithBottles();
    //     this.checkCollisionsWithThrowableBottles();
    // }

    // checkCollisionsWithEnemies() {
    //     // Kollisionsprüfung für den Charakter mit Gegnern
    //     this.level.enemies.forEach( (enemy) => {
    //         if( this.character.isColliding(enemy)) {
    //             this.character.hit();
    //             this.statusBar.setPercentage(this.character.energy);
    //         }
    //     });
    // }

    // checkCollisionsWithCoins() {
    //     // Kollisionsprüfung für den Charakter mit Münzen
    //     this.level.coins.forEach((coin) => {
    //         if( this.character.isColliding(coin)) {
    //             this.character.collectCoin(coin);
    //             this.coinCounter++;
    //             let percentage = (this.coinCounter / 10) * 100; // 10 Münzen 100%
    //             this.statusBarCoin.setPercentage(percentage); // Aktualisiere die Statusleiste basierend auf dem Prozentsatz
    //         }
    //     });
    // }

    // checkCollisionsWithBottles() {
    //     // Kollisionsprüfung für den Charakter mit Flaschen
    //     this.level.bottles.forEach((bottle) => {
    //         if (this.character.isColliding(bottle)) {
    //             this.character.collectBottle(bottle);
    //             let bottlePercentage = (this.character.bottlesCollected / 8) * 100; // 8 Flaschen entsprechen 100%
    //             this.statusBarBottle.setPercentage(bottlePercentage); // Aktualisiere die Statusleiste basierend auf dem Prozentsatz
    //         }
    //     });
    // }

    // checkCollisionsWithThrowableBottles() {
    //     // Kollisionsprüfung für geworfene Flaschen mit dem Boden
    //     this.throwableObjects.forEach((bottle) => {
    //         this.checkCollisionBottleGround(bottle);
    //     });
    // }


    // checkCollisionBottleGround(bottle) {
    //     if (!bottle.isAboveGround()) {
    //         bottle.isColliding = true;
    //         setTimeout(() => {
    //             this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
    //         }, 50);
    //     };
    // }