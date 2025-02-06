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
    lastThrowTime = 0; // Neue Variable in der Klasse
    gameOver = false;
    background_music = new Audio('audio/game_music.mp3');
    chickenDead_sound = new Audio('audio/chickenDead_sound.mp3');
    
    
    /**
     * Initializes the World class.
     * Sets up the canvas context, the canvas element, and the keyboard input.
     * Calls methods to draw the initial game state, set the world, and start the game loop.
     * 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the game on.
     * @param {Object} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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
    * Continuously checks for collisions every 25 milliseconds.
    * Continuously checks for manages throwable objects every 200 milliseconds.
    */
    run() {
        setInterval(() => {
            this.checkCollisions();
        },25);
        setInterval(() => {
            this.checkThrowObjects();
            this.checkCollisionThrowableObject();
        }, 200);
    }

    /**
    * Checks if the SHIFT key is pressed to throw a bottle.
    * If the SHIFT key is pressed, the character throws a bottle.
    */
    checkThrowObjects() {
        let now = Date.now();
        if (this.keyboard.SHIFT && now - this.lastThrowTime > 500) { // 500ms Cooldown
            this.character.throwBottle();
            this.lastThrowTime = now;
        }
    }    

    /**
     * Checks all collisions in the game.
     * Calls methods th check for collisions with enemies, coins and bottles.
     */
    checkCollisions() {
        this.checkCollisionsCharacterJumpOnEnemy();
        this.checkCollisionsCharacterWithEnemies();
        this.checkCollisionsCharacterWithEndboss();
        this.checkCollisionsCharacterWithCoins();
        this.checkCollisionsCharacterWithBottles();
    }
    

    /**
     * checks if the character jumps on an enemy
     * 
     */
    checkCollisionsCharacterJumpOnEnemy() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && !enemy.chickenIsDead) {
                this.character.jump();
                enemy.chickenIsDead = true;
            }
        });
    }

    /**
     * Checks collision between character and enemies.
     * If a collision is detected, the character takes a hit and the status bar is updated.
     */
    checkCollisionsCharacterWithEnemies() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !enemy.chickenIsDead) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Checks collision between character and endboss.
     * If a collision is detected, the character takes a hit and the status bar is updated.
     */
    checkCollisionsCharacterWithEndboss() {
        this.level.endboss.forEach(endboss => {
            if (this.character.isColliding(endboss)) {
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
    checkCollisionsCharacterWithCoins() {
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
    checkCollisionsCharacterWithBottles() {
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
     * checks collisions of the bottles
     * 
     */
        checkCollisionThrowableObject() {
            this.checkCollisionBottleEndboss();
            this.checkCollisionBottleGround();
        }

    /**
     * checks collision between bottle and end boss
     * 
     * @param {object} bottle 
     * @param {number} index 
     */
    checkCollisionBottleEndboss() {
        this.throwableObjects.forEach((bottle, index) => {
            if (this.level.endboss[0].isColliding(bottle)) {
                this.level.endboss[0].hitEndboss();
                this.statusBarEndboss.setPercentage(this.level.endboss.health);
                bottle.isColliding = true;
                setTimeout(() => {
                    this.throwableObjects.splice(index, 1);  // Sicherstellen, dass der Index aus der richtigen Liste stammt
                }, 200);
            }
        });
    }

    /**
     * checks collision between bottle and ground
     * 
     * @param {object} bottle 
     * @param {number} index 
     */
    checkCollisionBottleGround() {
        this.throwableObjects.forEach((bottle, index) => {
            if (!bottle.isAboveGround()) {
                console.log('Flasche hat den Boden erreicht'); // Log in der Konsole
                bottle.isColliding = true;
                setTimeout(() => {
                    this.throwableObjects.splice(index, 1);
                }, 50);
            }
        });
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
        };
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        };
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