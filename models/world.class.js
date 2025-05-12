class World {
    character = new Character();
    level = level1; // Stellen Sie sicher, dass level1.js geladen ist und Level-Daten enthält
    ctx;
    canvas;
    audioManager; // Stelle sicher, dass ein AudioManager im game.js erstellt und hier übergeben wird
    keyboard; // Stelle sicher, dass ein Keyboard im game.js erstellt und hier übergeben wird
    camera_x = 0;
    statusBar = new StatusBar(); // Stelle sicher, dass StatusBar.class.js existiert
    statusBarBottle = new StatusBarBottle(); // Stelle sicher, dass StatusBarBottle.class.js existiert
    statusBarCoin = new StatusBarCoin(); // Stelle sicher, dass StatusBarCoin.class.js existiert
    statusBarEndboss = new StatusBarEndboss(); // Stelle sicher, dass StatusBarEndboss.class.js existiert
    throwableObjects = []; // Liste der aktuell geworfenen Flaschen
    coinCounter = 0; // Zähler für gesammelte Münzen
    lastThrowTime = 0; // Timestamp des letzten Wurfs für Cooldown
    gameOver = false; // Flag für Spielzustand Game Over
    collisionIntervalId = null; // Speichert die ID für das Kollisionsintervall
    throwIntervalId = null; // Speichert die ID für das Intervall der Wurffunktionen

    constructor(canvas, keyboard, audioManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.audioManager = audioManager;
        this.collisionManager = new CollisionManager(this);
        this.loadSounds();
        this.setWorld();
        this.draw();
        this.run();
    }

    /**
     * Loads all game sounds and music using the audio manager.
     */
    loadSounds() {
        if (!this.audioManager) {
            console.warn("LOG: AudioManager not available, skipping sound loading.");
            return;
        }
        this.audioManager.setBackgroundMusic("audio/background_music.mp3", 0.1);
        this.audioManager.addSound("bottleCollect", "audio/bottleCollect_sound.mp3");
        this.audioManager.addSound("bottle_hit", "audio/bottleBroke_sound.mp3");
        this.audioManager.addSound("chickenDead", "audio/chicken_sound.mp3");
        this.audioManager.addSound("coinCollected", "audio/coinCollect_sound.mp3");
        this.audioManager.addSound("endbossMusic", "audio/endboss_music.mp3");
        this.audioManager.addSound("gameOver", "audio/game_over_sound.mp3");
        this.audioManager.addSound("hurt", "audio/hurt_sound.mp3");
        this.audioManager.addSound("jump", "audio/jumping_sound.mp3");
        this.audioManager.addSound("lose", "audio/lose_sound.mp3");
        this.audioManager.addSound("throw", "audio/throw_sound.mp3");
        this.audioManager.addSound("walk", "audio/walking_sound.mp3");
        this.audioManager.addSound("win", "audio/win_sound.mp3");
    }

    /**
     * Sets the world reference on all movable objects that need it (e.g., enemies, character).
     * This allows them to access world-level properties and methods.
     * Also starts the animation/logic intervals for specific objects like the Endboss,
     * which need the world reference to function.
     * @method
     */
    setWorld() {
        if (this.character) {
             this.character.world = this;
        } else {
             console.warn('LOG: Character object not found when setting world reference.');
        }


        // Set the world reference on all enemies in the level.
        // Iterate through the enemies array (ensure it's an array).
        if (Array.isArray(this.level.enemies)) {
             this.level.enemies.forEach(enemy => {
                 if (enemy) {
                     enemy.world = this;
                     if (enemy instanceof Endboss) {
                        console.log('LOG: World setting world reference on Endboss and starting animation.'); // Log
                        enemy.animate();
                     }
                 } else {
                     console.warn('LOG: Found null/undefined enemy in level.enemies list.');
                 }
             });
        } else {
            console.warn('LOG: level.enemies is not an array or missing when setting world references.');
        }
    }

/**
 * Starts the main game intervals for collision checks and throwable objects.
 * - Collision checks run frequently (e.g., every 25ms), handled by CollisionManager.
 * - Throwable object management runs less frequently (e.g., every 50ms).
 */
run() {
    this.collisionIntervalId = setInterval(() => {
        if (this.collisionManager) {
            this.collisionManager.checkAllCollisions();
        } else {
            console.error('LOG: World: CollisionManager is not initialized!');
        }
    }, 25);

    this.throwIntervalId = setInterval(() => {
        this.checkThrowObjects();
    }, 50);
}

    /**
     * Checks if the SHIFT key is pressed to throw a bottle.
     * If the SHIFT key is pressed and cooldown is over, the character throws a bottle.
     * Updates last throw time and plays throw sound.
     */
    checkThrowObjects() {
        const THROW_COOLDOWN = 850;
        let now = Date.now();
        if (this.keyboard.SHIFT && now - this.lastThrowTime > THROW_COOLDOWN && this.character.bottlesCollected > 0 && !this.character.isDead()) {
            this.character.throwBottle(this.character.otherDirection);
            this.lastThrowTime = now;
            if (this.audioManager) {
                this.audioManager.playSound('throw');
            }
        }
    }

/**
     * Draws the entire game frame by frame using requestAnimationFrame.
     * Clears the canvas, applies camera translation, draws all game objects and UI elements,
     * and then requests the next frame to continue the animation loop.
     * @method
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Save the current state of the canvas context before applying transformations.
        this.ctx.save();
        // Translate (shift) the canvas context horizontally based on the camera position.
        // This makes the world move relative to the fixed canvas viewport, simulating camera movement.
        this.ctx.translate(this.camera_x, 0);

        // Draw background objects (like static images, floor, etc. - affected by camera movement).
        this.addObjectsToMap(this.level.backgroundObjects);
        // Draw clouds (often scroll differently, but still affected by camera base movement).
        this.addObjectsToMap(this.level.clouds);

        // Draw main game characters, enemies, and dynamic objects (affected by camera movement).
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.restore();

        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarEndboss);

        requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * Adds an array of movable objects to the map for drawing.
     * Iterates through each object in the array and calls addToMap for drawing.
     * Includes safety checks to ensure the input is an array and objects are valid.
     * @method
     * @param {MovableObject[]} objects
     */
    addObjectsToMap(objects) {
        if (Array.isArray(objects)) {
            objects.forEach(o => {
                if (o) {
                    this.addToMap(o);
                }
            });
        }
    }

/**
     * Adds a single movable object or UI element to the canvas for drawing.
     * Handles horizontal image flipping for objects facing the opposite direction,
     * with a special case for the dead Endboss not to be flipped.
     * Draws the object's image and optionally its collision frame for debugging.
     * @method
     * @param {MovableObject | DrawableObject} mo
     */
    addToMap(mo) {
        if (!mo || typeof mo.draw !== 'function') {
             return;
        }

        const isDeadEndboss = mo instanceof Endboss && typeof mo.isDeadEndboss === 'function' && mo.isDeadEndboss();
        const shouldFlip = (mo && typeof mo.otherDirection === 'boolean' && mo.otherDirection) && !isDeadEndboss;

        if (shouldFlip) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);


        // --- Draw Collision Frame (DEBUG ONLY) ---
        // Optional: Draw the collision bounding box around the object for debugging.
        // This requires the object to have a drawFrame method (from MovableObject/DrawableObject)
        // AND the 'offset' property defined, as drawFrame uses the offset to calculate the box.
        if (typeof mo.drawFrame === 'function' && mo.offset) {
            // Uncomment the line below to make the collision frames visible during gameplay.
            // mo.drawFrame(this.ctx); // <-- UNCOMMENT THIS LINE TO SEE COLLISION FRAMES
        } else {
             // Optional logs to help debug why frames aren't drawn (e.g., missing offset)
             // if (mo && typeof mo.drawFrame !== 'function') console.warn('LOG: drawFrame method missing for:', mo.constructor.name);
             // if (mo && !mo.offset) console.warn('LOG: offset property missing for:', mo.constructor.name, ' Cannot draw frame.');
        }
        // ******************************************


        // --- Reset Flipping ---
        // If flipping was applied, restore the canvas context to its state before the flip.
        if (shouldFlip) {
            this.flipImageBack(mo); // Delegates to flipImageBack to restore context and reset object's x.
        }
    }

    /**
     * Flips the canvas context horizontally for drawing an object in the opposite direction.
     * Saves the current context state before transforming.
     * Updates the object's x-coordinate temporarily for drawing within the flipped context.
     * @method
     * @param {MovableObject | DrawableObject} mo - The object instance whose image needs to be flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

/**
     * Restores the canvas context to its state before horizontal flipping.
     * Corrects the object's x-coordinate back to its original value, undoing the temporary change made for drawing.
     * <-- WIRD VON addToMap() AUFGERUFEN, wenn flipImage aufgerufen wurde -->
     * @method
     * @param {MovableObject | DrawableObject} mo
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }


/**
     * Stops all relevant game intervals and processes for the character, enemies, throwable objects, and world logic.
     * This function should be called when the game ends (either win or lose) to freeze the game state.
     * It delegates the stopping of specific object intervals to the objects themselves.
     * @method
     */
    stopAllIntervals() {
        console.log("LOG: --- Starting stopAllIntervals (World) ---"); // Log to confirm method execution

        // 1. Stop Character-specific intervals.
        // Ensure the character object exists and has the necessary stop method.
        if (this.character && typeof this.character.stopCharacterIntervals === 'function') {
            this.character.stopCharacterIntervals(); // Call the character's method to stop its intervals (e.g., animation, movement)
             // console.log("LOG: Character intervals stopped."); // Optional log
        } else {
             // Optional warning if method is missing
             // console.warn("LOG: Character object or stopCharacterIntervals method missing.");
        }

        // 2. Stop intervals for ALL enemies (Chicken, MiniChicken, Endboss) currently in the enemies list.
        // Iterate through the level's enemies array. Assume all relevant enemies are in this list.
        // Ensure the enemies list is a valid array before iterating.
        if (Array.isArray(this.level.enemies)) {
              // console.log("LOG: Iterating through enemies list to stop intervals."); // Optional log
             this.level.enemies.forEach((enemy) => {
                 // Ensure the current enemy object is valid before processing.
                 if (enemy) {
                     // console.log("LOG: Attempting to stop intervals for enemy type:", enemy.constructor.name); // Log enemy type being processed

                     // Use instanceof to call the specific stop method for each enemy type.
                     if (enemy instanceof Chicken && typeof enemy.stopChickenIntervals === 'function') {
                         enemy.stopChickenIntervals(); // Stop Chicken's intervals (movement, animation)
                     } else if (enemy instanceof ChickenMini && typeof enemy.stopChickenMiniIntervals === 'function') {
                         enemy.stopChickenMiniIntervals(); // Stop MiniChicken's intervals
                     } else if (enemy instanceof Endboss && typeof enemy.stopEndbossIntervals === 'function') {
                         enemy.stopEndbossIntervals(); // Stop Endboss's intervals (movement, attack, animation, etc.)
                     } else {
                         // Optional warning if a stop method for an enemy type is not found.
                          // console.warn("LOG: Stop method not found for enemy type:", enemy.constructor.name);
                     }
                 } else {
                     // Optional warning if a null/undefined enemy is found in the list.
                     // console.warn('LOG: Skipping stopping intervals for null/undefined enemy in enemies list.');
                 }
             });
         } else {
             // Optional warning if the enemies list is invalid.
              console.warn("LOG: this.level.enemies is not an array or missing, cannot stop enemy intervals.");
         }

         // Optional: The commented-out section for iterating over level.endboss separately is not needed if Endbosses are guaranteed to be in level.enemies.


        // 3. Stop intervals for all active Throwable Objects (bottles).
        // Iterate through the list of currently thrown bottles.
        // Ensure the list is a valid array.
        if (Array.isArray(this.throwableObjects)) {
            // console.log("LOG: Iterating through throwableObjects list to stop intervals."); // Optional log
            this.throwableObjects.forEach((bottle) => {
                // Ensure the bottle object is valid and has a stop method.
                if (bottle && typeof bottle.stopThrowableObjectIntervals === 'function') {
                    bottle.stopThrowableObjectIntervals(); // Stop the bottle's intervals (movement, animation, gravity loop)
                    // console.log("LOG: ThrowableObject intervals stopped."); // Optional log
                } else {
                    // Optional warning if method is missing
                    // console.warn("LOG: ThrowableObject or stopThrowableObjectIntervals method missing.");
                }
            });
        } else {
             // Optional warning if the list is invalid.
             console.warn("LOG: this.throwableObjects is not an array or missing, cannot stop bottle intervals.");
        }
        this.stopWorldIntervals();
        
        if (this.audioManager && typeof this.audioManager.pauseBackgroundMusic === 'function' && typeof this.audioManager.pauseEndbossMusic === 'function') {
            // console.log("LOG: Pausing background and endboss music."); // Optional log
            this.audioManager.pauseBackgroundMusic();
            this.audioManager.pauseEndbossMusic();
        }
        console.log("LOG: --- End stopAllIntervals (World) ---"); // Log end
    }

/**
     * Stops the intervals specific to the World class (e.g., main collision check and throwable object logic intervals).
     * Clears the interval IDs and sets them to null.
     * @method
     */
    stopWorldIntervals() {
        // console.log("LOG: stopWorldIntervals() called."); // Optional Log

        // Check if the collision interval ID is set and clear it.
        if (this.collisionIntervalId) {
            clearInterval(this.collisionIntervalId);
            this.collisionIntervalId = null; // Set ID to null after clearing
        } else {
             // Optional warning if trying to stop an interval that is already null
             // console.warn("LOG: collisionIntervalId was null when trying to stop.");
        }

        // Check if the throwable object interval ID is set and clear it.
        if (this.throwIntervalId) {
            clearInterval(this.throwIntervalId);
            this.throwIntervalId = null; // Set ID to null after clearing
        } else {
            // Optional warning
            // console.warn("LOG: throwIntervalId was null when trying to stop.");
        }

        // console.log("LOG: World-specific intervals stopped."); // Optional log
    }
}