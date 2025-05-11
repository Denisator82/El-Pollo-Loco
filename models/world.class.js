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
     * <-- WIRD VOM World Constructor aufgerufen -->
     * @method
     */
    setWorld() {
        // Set the world reference on the character. (Might be redundant if already in Character constructor, but harmless).
        if (this.character) { // Safety check
             this.character.world = this;
        } else {
             console.warn('LOG: Character object not found when setting world reference.');
        }


        // Set the world reference on all enemies in the level.
        // Iterate through the enemies array (ensure it's an array).
        if (Array.isArray(this.level.enemies)) {
             this.level.enemies.forEach(enemy => {
                 if (enemy) { // Safety check for valid enemy object
                     enemy.world = this; // Set the world reference on the current enemy.

                     // *** NEU: Starte die Endboss-Intervalle HIER, NACHDEM die world-Referenz gesetzt wurde! ***
                     // Prüfe, ob der aktuelle Gegner ein Endboss ist.
                     if (enemy instanceof Endboss) {
                         console.log('LOG: World setting world reference on Endboss and starting animation.'); // Log
                         // Rufe die animate() Methode des Endbosses auf, um seine Intervalle zu starten.
                         // Dies sollte nur einmal für den Endboss passieren.
                         enemy.animate();
                     }
                     // Optional: Wenn andere Gegnertypen auch separate animate() Methoden haben,
                     // die die World brauchen, müsstest du sie hier auch ähnlich starten.
                     // Meistens starten normale Gegner ihre Intervalle im eigenen Constructor und brauchen die World nicht sofort dafür.
                 } else {
                     console.warn('LOG: Found null/undefined enemy in level.enemies list.');
                 }
             });
        } else {
            console.warn('LOG: level.enemies is not an array or missing when setting world references.');
        }

        // Optional: Set world reference on throwable objects if they are created before throwing (unlikely).
        // Throwable objects usually get the world reference when created in Character.throwBottle().
    }

    /**
     * Starts the main game intervals for collision checks and throwable objects.
     * - Collision checks run frequently (e.g., every 25ms).
     * - Throwable object management runs less frequently (e.g., every 200ms).
     */
    run() {
        // Interval für ALLE Kollisionen (Char vs Gegner, Char vs Items, etc.)
        this.collisionIntervalId = setInterval(() => {
            this.checkCollisions();
            // checkCollisionThrowableObject() wird separat aufgerufen
        }, 25); // Schnelles Intervall für präzise Kollisionen

        // Interval für Wurfojekt-Management (Werfen, Kollisionen der Wurfojekte)
        this.throwIntervalId = setInterval(() => {
            this.checkThrowObjects(); // Prüft, ob Flasche geworfen wird (SHIFT-Taste)
            this.checkCollisionThrowableObject(); // Prüft Kollisionen der geworfenen Flaschen
        }, 50); // Langsameres Intervall, da Wurfojekte seltener erscheinen/kollidieren
    }

    /**
     * Checks if the SHIFT key is pressed to throw a bottle.
     * If the SHIFT key is pressed and cooldown is over, the character throws a bottle.
     * Updates last throw time and plays throw sound.
     */
    checkThrowObjects() {
        const THROW_COOLDOWN = 850; // Zeit in ms zwischen Würfen
        // THROW_OFFSET wird nicht direkt hier verwendet, sondern von character.throwBottle
        let now = Date.now();
        // Prüfe, ob SHIFT gedrückt, Cooldown vorbei UND Char hat Flaschen UND Char nicht tot
        if (this.keyboard.SHIFT && now - this.lastThrowTime > THROW_COOLDOWN && this.character.bottlesCollected > 0 && !this.character.isDead()) {
            // Übergabe des Offsets und der Richtung an throwBottle() im Charakter
            // Die throwBottle() Methode im Charakter sollte eine neue ThrowableObject Instanz erstellen
            this.character.throwBottle(this.character.otherDirection); // Annahme: Char kennt Offset
            this.lastThrowTime = now;
            // Spiele Wurf-Sound
            if (this.audioManager) {
                this.audioManager.playSound('throw');
            }
        }
    }

/**
     * Checks all character-related collisions in the game (with enemies, items).
     * Calls specific methods for different collision types.
     * Excludes throwable object collisions which are checked separately in checkCollisionThrowableObject.
     * <-- WIRD VOM Haupt-Kollisions-Interval (collisionIntervalId) AUFGERUFEN -->
     * @method
     */
    checkCollisions() {
        // Checks collisions between the character and various objects/enemies
        // Each specific collision type is handled in a dedicated method for clarity and organization.

        // Check collision where the character jumps on an enemy (typically kills small enemies)
        this.checkCollisionsCharacterJumpOnEnemy();

        // Check collision where the character is touched by an enemy (character takes damage)
        this.checkCollisionsCharacterWithEnemies();

        // Check collision specifically with the Endboss (often triggers special logic or Game Over)
        this.checkCollisionsCharacterWithEndboss();

        // Check collisions with collectible items like coins
        this.checkCollisionsCharacterWithCoins();

        // Check collisions with collectible bottles (to increase throw count)
        this.checkCollisionsCharacterWithBottles();

        // Note: Collisions involving THROWN bottles (with enemies, ground) are handled
        // by a separate interval calling checkCollisionThrowableObject().
    }

    /**
     * Checks if the character jumps on an enemy.
     * If collision occurs while character is falling (speedY < 0) and above ground,
     * enemy is killed.
     * <-- WIRD VON checkCollisions() AUFGERUFEN -->
     */
    checkCollisionsCharacterJumpOnEnemy() {
        // Nutze umgekehrte Schleife, da wir Elemente entfernen
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            // Prüfe nur, wenn es kein Endboss ist (Endboss kann nicht angesprungen werden)
            // Und wenn Gegner nicht schon tot ist
            if (!(enemy instanceof Endboss) && !enemy.chickenIsDead && this.character.isColliding(enemy) && this.character.isAboveGround() && this.character.speedY < 0) {
                // console.log('LOG: Character jumped on enemy!', enemy.constructor.name); // Log

                this.character.jump(); // Char springt vom Gegner ab
                enemy.chickenIsDead = true; // Setzt Zustand im Gegner auf tot

                // Optional: Play chicken dead sound
                if (this.audioManager) {
                     // Stelle sicher, dass der richtige Sound für Chicken/MiniChicken gespielt wird
                     if (enemy instanceof Chicken) this.audioManager.playSound("chickenDead"); // Annahme: chickenDead Sound für Chicken
                     if (enemy instanceof ChickenMini) this.audioManager.playSound("chickenDead"); // Annahme: chickenDead Sound auch für MiniChicken
                }

                // Entfernung des toten Gegners aus der Liste nach kurzer Verzögerung (Todes-Animation Dauer)
                const deathAnimationDuration = 500; // Anpassen!
                setTimeout(() => {
                     // Sicherstellen, dass das Objekt noch existiert, bevor splice aufgerufen wird
                     const currentEnemyIndex = this.level.enemies.indexOf(enemy);
                     if (currentEnemyIndex > -1) {
                          this.level.enemies.splice(currentEnemyIndex, 1);
                          // console.log('LOG: Enemy removed after death timeout.');
                     }
                }, deathAnimationDuration);
            }
        }
    }

/**
     * Checks collision between the character and enemies.
     * If a collision occurs with a living enemy while the character is not in a hurt state,
     * the character takes damage.
     * Excludes the Endboss from this specific check as its collision might trigger different logic (e.g. handled by checkCollisionsCharacterWithEndboss).
     * <-- WIRD VOM Haupt-Kollisions-Interval (collisionIntervalId) AUFGERUFEN -->
     * @method
     */
    checkCollisionsCharacterWithEnemies() {
        // Iterate through all enemies in the level
        // Using forEach is safe here as elements are not removed from this method itself
        this.level.enemies.forEach(enemy => {
            // --- Determine if the enemy is dead ---
            // Check the dead state property/method appropriate for the enemy type
            // Assuming 'chickenIsDead' exists for Chicken and MiniChicken, and 'isDeadEndboss()' for Endboss
            // Optional: Exclude Endboss here entirely if checkCollisionsCharacterWithEndboss handles ALL Endboss collision reactions
            // const isEnemyDead = enemy.chickenIsDead || (enemy instanceof Endboss && typeof enemy.isDeadEndboss === 'function' && enemy.isDeadEndboss());
            // Let's assume for THIS method we only care about Chicken/MiniChicken damage collisions
            const isEnemyDead = (enemy instanceof Chicken || enemy instanceof ChickenMini) && typeof enemy.chickenIsDead === 'boolean' && enemy.chickenIsDead;


            // --- Collision Check Conditions ---
            // Check if:
            // 1. The character IS currently colliding with this enemy.
            // 2. The enemy is NOT dead (using the determined dead state).
            // 3. The character is NOT currently in a hurt state (prevents taking damage from the same collision multiple times rapidly).
            // 4. Ensure it's NOT the Endboss if handled separately (add: && !(enemy instanceof Endboss))
             if (!(enemy instanceof Endboss) && typeof this.character.isColliding === 'function' && this.character.isColliding(enemy) && !isEnemyDead && typeof this.character.isHurt === 'function' && !this.character.isHurt()) {

                // console.log('LOG: Character collided with living enemy!', enemy.constructor.name); // Optional Log

                // --- Actions on Collision with Living Enemy ---
                if (typeof this.character.hit === 'function') { // Safety check
                    this.character.hit(); // Character takes damage (This method should handle energy reduction, lastHit timestamp, and potentially triggering Game Over)
                } else {
                    // Optional warning if hit method is missing
                    // console.warn('LOG: Character hit method not found.');
                }

                // Update Character Health Status Bar
                // Ensure the status bar exists and has a setPercentage method
                if (this.statusBar && typeof this.statusBar.setPercentage === 'function') {
                    this.statusBar.setPercentage(this.character.energy); // Assuming Character has energy Property
                } else {
                     // Optional warning if status bar is missing
                    // console.warn('LOG: Character status bar or setPercentage method missing.');
                }


                // Note: Game Over logic when energy reaches 0 is ideally handled within Character.hit()
                // or checked in the main character update/animation loop, not repeated here.
            }
        });
    }

/**
     * Checks collision between the character and the endboss.
     * If a collision occurs with a living endboss while the game is not over and the character is not in a hurt state,
     * the game over (lose) sequence is triggered ONCE.
     * <-- WIRD VON checkCollisions() AUFGERUFEN -->
     * @method
     */
    checkCollisionsCharacterWithEndboss() {
        // Ensure the endboss list exists and contains at least one endboss before checking
        if (this.level.endboss && this.level.endboss[0]) {
            const endboss = this.level.endboss[0]; // Assuming only one Endboss instance in the list

            // --- Collision Check Conditions ---
            // Check if:
            // 1. The Endboss is NOT dead (assuming isDeadEndboss() method exists).
            // 2. The game is NOT already over.
            // 3. The character is NOT currently in a hurt state (prevents triggering game over rapidly).
            // 4. The character IS currently colliding with the Endboss.
            if (typeof endboss.isDeadEndboss === 'function' && !endboss.isDeadEndboss() && !this.gameOver && typeof this.character.isHurt === 'function' && !this.character.isHurt() && typeof this.character.isColliding === 'function' && this.character.isColliding(endboss)) {

                console.log('LOG: Character collided with living Endboss! Triggering Game Over (Lose).'); // Log the trigger event

                // --- Actions on Collision with Living Endboss ---
                this.gameOver = true; // Set the game over flag in the world state

                // Call the central function that handles the game over sequence (should stop intervals, play sounds, show screen, etc.)
                // Assumes a global function gameLose() exists and is accessible to initiate the loss state
                if (typeof gameLose === 'function') { // Safety check
                    gameLose(); // Calls gameLose() only once due to the !this.gameOver check
                } else {
                    console.error('LOG: Global gameLose() function not found. Cannot trigger Game Over.');
                }


                // Optional: Character should also take damage or die upon collision with a living boss
                // This logic can be added here if needed, e.g.:
                // if (typeof this.character.hit === 'function' && typeof this.character.isDead === 'function' && !this.character.isDead()) {
                //     this.character.hit(...); // Example: Character takes massive damage or is instantly killed
                //     if (this.statusBar && typeof this.statusBar.setPercentage === 'function') {
                //          this.statusBar.setPercentage(this.character.energy); // Update character health status bar
                //     }
                // }
            }
        } else {
             // Optional warning if Endboss object is missing
             // console.warn('LOG: checkCollisionsCharacterWithEndboss called but Endboss object not found in level.endboss[0].');
        }
    }

/**
     * Checks collision between character and collectible coins.
     * If a collision is detected, the coin is collected, the coin counter is incremented,
     * the coin status bar is updated, and the coin is removed from the level.
     * <-- KORRIGIERTE METHODE (includes removal) -->
     * <-- WIRD VON checkCollisions() AUFGERUFEN -->
     * @method
     */
    checkCollisionsCharacterWithCoins() {
        // Use a reverse loop when potentially removing elements from the array (which we do here with splice)
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            const coin = this.level.coins[i]; // Get the current coin from the list

            // --- Collision Check Condition ---
            // Check if the character is currently colliding with this coin
            if (typeof this.character.isColliding === 'function' && this.character.isColliding(coin)) {
                // console.log('LOG: Character collided with and collected coin.'); // Optional Log

                // --- Actions on Successful Collection ---
                // Trigger coin collection logic in character (e.g., plays sound, handles animation/effects if needed)
                // Assumes a collectCoin method exists in the Character class
                if (typeof this.character.collectCoin === 'function') { // Safety check
                    this.character.collectCoin(coin); // Example: Character collects the coin
                } else {
                    // Optional warning if collectCoin method is missing
                    // console.warn('LOG: Character collectCoin method not found.');
                }

                this.coinCounter++; // Increment the world's internal coin counter

                // Update coin status bar (ensure status bar exists and has setPercentage method)
                if (this.statusBarCoin && typeof this.statusBarCoin.setPercentage === 'function') { // Safety checks
                     let percentage = (this.coinCounter / 10) * 100; // Assuming max 10 coins for 100% status bar (Adjust total if needed)
                     this.statusBarCoin.setPercentage(percentage);
                } else {
                     // Optional warning if status bar is missing
                     // console.warn('LOG: statusBarCoin or setPercentage method missing. Cannot update coin status bar.');
                }


                // *** CRITICAL: REMOVE the collected coin from the level's coins list ***
                // This step is necessary so the coin disappears and cannot be collected again.
                this.level.coins.splice(i, 1); // <-- THIS LINE WAS MISSING IN YOUR SNIPPET!
                // We use 'i' because we are iterating in reverse.
            }
        } // <-- REMOVE the extra semicolon here
    }

/**
     * Checks collision between character and collectible bottles.
     * If a collision is detected, the bottle is collected,
     * the number of collected bottles and the status bar are updated,
     * and the bottle is removed from the level.
     * <-- KORRIGIERTE METHODE (includes safe removal) -->
     * <-- WIRD VON checkCollisions() AUFGERUFEN -->
     * @method
     */
    checkCollisionsCharacterWithBottles() {
        // *** Use a reverse loop when removing elements from the array (safe with splice) ***
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            const bottle = this.level.bottles[i]; // Get the current collectible bottle

            // --- Collision Check Condition ---
            // Check if the character is currently colliding with this collectible bottle
            if (typeof this.character.isColliding === 'function' && this.character.isColliding(bottle)) {
                // console.log('LOG: Character collided with and collected collectible bottle.'); // Optional Log

                // --- Actions on Successful Collection ---
                // Trigger bottle collection logic in character (increments count, handles sound/effects)
                if (typeof this.character.collectBottle === 'function') {
                    this.character.collectBottle(bottle);
                }

                // Update bottle status bar
                if (this.statusBarBottle && typeof this.statusBarBottle.setPercentage === 'function') {
                     let bottlePercentage = (this.character.bottlesCollected / 8) * 100; // Adjust total if needed
                     this.statusBarBottle.setPercentage(bottlePercentage);
                }


                // *** CRITICAL: REMOVE the collected bottle from the level's bottles list ***
                // This makes it disappear and prevents re-collection.
                this.level.bottles.splice(i, 1); // <-- ADD/ENSURE THIS LINE IS PRESENT!
                // 'i' is the correct index because we iterate in reverse.

                // Optional: Play collection sound if not handled in Character.collectBottle
                // if (this.audioManager && typeof this.audioManager.playSound === 'function') { this.audioManager.playSound('bottleCollect'); }
            }
        }
    }

/**
     * Checks collisions involving throwable objects (bottles) with enemies and the ground.
     * Called periodically via interval.
     * This method acts as a coordinator, calling specific collision checks for different target types.
     * <-- WIRD VOM Throwable Object-Interval (throwIntervalId) AUFGERUFEN -->
     * @method
     */
    checkCollisionThrowableObject() {
        // console.log('LOG: checkCollisionThrowableObject() called.'); // Optional Log to confirm this method is running

        // Delegate the collision check with the Endboss to a specific method
        this.checkCollisionBottleEndboss();

        // Delegate the collision check with normal Chickens to a specific method
        this.checkCollisionBottleChicken(); // Calls the method to check bottle vs Chicken collisions

        // Delegate the collision check with Mini-Chickens to a specific method
        this.checkCollisionBottleChickenMini(); // Calls the method to check bottle vs MiniChicken collisions

        // Note: The checkCollisionBottleGround() method is NO LONGER CALLED from here.
        // The logic for a bottle hitting the ground is now handled directly within
        // the ThrowableObject's own update() method based on its y-position and speedY.
    }

/**
     * Checks collision between a throwable bottle and the end boss.
     * If collision occurs with a living endboss, the endboss takes damage and the bottle reacts (splashes).
     * Sets bottle.isColliding = true to trigger the bottle's impact logic (splash and removal).
     * <-- WIRD VON checkCollisionThrowableObject() AUFGERUFEN -->
     * @method
     */
    checkCollisionBottleEndboss() {
        // Ensure the endboss array exists and contains at least one endboss instance before checking
        // Also, exit the method early if the Endboss is already defeated.
        if (this.level.endboss && this.level.endboss[0]) {
            const endboss = this.level.endboss[0]; // Assuming there is only one Endboss in this list

             // --- Early Exit if Endboss is Dead ---
             // If the endboss is already dead, no further collision checks with the boss are needed.
            if (typeof endboss.isDeadEndboss === 'function' && endboss.isDeadEndboss()) {
                 // console.log('LOG: checkCollisionBottleEndboss - Boss is already dead, returning.'); // Optional Log
                 return; // Exit the method immediately
            }

            // --- Iterate through Thrown Bottles ---
            // Loop through all active throwable objects (bottles).
            // Using forEach is safe here because bottles remove themselves, we don't splice this array from here.
            this.throwableObjects.forEach(bottle => {
                // --- Collision Check Conditions ---
                // Check if:
                // 1. The bottle has NOT already splashed (prevents multiple hits from the same bottle).
                // 2. Ensure the Endboss object has an isColliding method before calling.
                // 3. The Endboss IS currently colliding with the bottle.
                if (!bottle.isSplashed && typeof endboss.isColliding === 'function' && endboss.isColliding(bottle)) {

                    // console.log('LOG: Bottle collision detected with Endboss.'); // Log Collision Detection

                    // --- Actions on Successful Bottle Hit ---
                    // Ensure hitEndboss is called only if the boss is still alive (redundant with early exit, but harmless safety)
                    if (typeof endboss.isDeadEndboss === 'function' && !endboss.isDeadEndboss()) {
                         if (typeof endboss.hitEndboss === 'function') { // Safety check
                            // console.log('LOG: Calling hitEndboss on Endboss.'); // Log Hit Call
                            endboss.hitEndboss(); // Call the method on the Endboss to take damage (Endboss's hitEndboss should manage its health and trigger gameWin if health <= 0)
                            // Optional: Update the Endboss Status Bar to reflect the new health percentage
                             if (this.statusBarEndboss && typeof this.statusBarEndboss.setPercentage === 'function') { // Safety checks
                                this.statusBarEndboss.setPercentage(endboss.health); // Assuming Endboss has a 'health' property
                             } else {
                                 // Optional warning if status bar is missing
                                 // console.warn('LOG: statusBarEndboss or setPercentage method missing for Endboss.');
                             }
                         } else {
                              // Optional warning if hit method is missing
                              console.warn('LOG: Endboss hitEndboss method not found.');
                         }
                    } else {
                         // Optional log if collision was detected but boss was already dead (shouldn't happen with early exit)
                         // console.log('LOG: Bottle collision detected, but Endboss was already dead.');
                    }


                    // *** ACTION: Set the isColliding Flag on the THROWABLE BOTTLE ***
                    // This is the CRITICAL step that tells the bottle itself it has hit something.
                    // This flag, when true, triggers the bottle's onTargetHit() method
                    // within its own update() loop in ThrowableObject.class.js.
                    bottle.isColliding = true; // <-- This is the CORRECT place to set this flag for object hits!

                    // *** BOTTLE REMOVES ITSELF ***
                    // The ThrowableObject is now responsible for removing itself from the
                    // world.throwableObjects list in its onTargetHit() method after
                    // playing the splash animation timeout.
                    // DO NOT add setTimeout/splice logic for bottle removal here in World!
                    // This duplicate logic was present in older code versions and has been removed.
                }
            });
        } else {
             // Optional warning if Endboss object is missing from level.endboss[0]
             // console.warn('LOG: checkCollisionBottleEndboss called but Endboss object not found in level.endboss[0].');
        }
    }


/**
     * Checks collision between a throwable bottle and normal chickens.
     * If a collision occurs with a living normal chicken, the chicken is killed and the bottle reacts (splashes).
     * Sets bottle.isColliding = true to trigger the bottle's impact logic (splash and removal).
     * Uses a reverse loop for safe enemy removal.
     * <-- WIRD VON checkCollisionThrowableObject() AUFGERUFEN -->
     * @method
     */
    checkCollisionBottleChicken() {
         // --- Iterate through Thrown Bottles ---
         // Loop through all active throwable objects (bottles).
         // Using forEach is safe here because bottles remove themselves, we don't splice this array from here.
         this.throwableObjects.forEach(bottle => {
             // --- Check if Bottle is Ready for Collision ---
             // Process collision check only with bottles that haven't already splashed or hit something.
             if (!bottle.isSplashed) { // isSplashed is a flag in ThrowableObject, set after impact
                  // --- Iterate through Enemies ---
                  // Loop through all enemies in the level to find potential collision targets.
                  // Use a reverse loop because we might remove elements (Chickens) from this list during iteration using splice.
                  for (let i = this.level.enemies.length - 1; i >= 0; i--) {
                       const enemy = this.level.enemies[i]; // Get the current enemy

                       // --- Collision Check Conditions ---
                       // Check if:
                       // 1. The current enemy IS a normal Chicken (using instanceof).
                       // 2. The Chicken IS NOT already dead (assuming chickenIsDead boolean property exists).
                       // 3. Ensure the enemy object has an isColliding method before calling.
                       // 4. The Chicken IS currently colliding with the bottle.
                       if (enemy instanceof Chicken && enemy && typeof enemy.chickenIsDead === 'boolean' && !enemy.chickenIsDead && typeof enemy.isColliding === 'function' && enemy.isColliding(bottle)) {

                           // console.log('LOG: Bottle collision detected with Chicken.'); // Log Collision Detection

                           // --- Actions on Successful Bottle Hit ---
                           // Optional: Double check if Chicken is not dead (redundant with outer condition, but harmless safety)
                           if (!enemy.chickenIsDead) {
                               // Mark the Chicken as dead (This should trigger its death animation if implemented)
                               enemy.chickenIsDead = true; // Assuming this property exists in Chicken

                               // Optional: Play chicken hit/dead sound
                               if (this.audioManager && typeof this.audioManager.playSound === 'function') { // Safety checks
                                   this.audioManager.playSound('chickenDead'); // Assuming 'chickenDead' sound for Chicken
                               } else {
                                   // Optional warning if sound method is missing
                                   // console.warn('LOG: AudioManager or playSound method missing for chicken death sound.');
                               }

                               // Schedule removal of the dead Chicken from the enemy list after its death animation duration
                               const deathAnimationDuration = 500; // Duration in milliseconds (Adjust based on chicken's death animation length)
                               setTimeout(() => {
                                   // Safely remove the enemy from the level's enemies list
                                   // Check if the enemy still exists in the array at its original index before trying to remove it
                                   const currentEnemyIndex = this.level.enemies.indexOf(enemy);
                                   if (currentEnemyIndex > -1) {
                                        this.level.enemies.splice(currentEnemyIndex, 1); // Remove the enemy at its index
                                        // console.log('LOG: Chicken removed from enemies list after death timeout.'); // Optional Log
                                   } else {
                                        // Optional warning if enemy was already removed
                                        // console.warn('LOG: Chicken not found in enemies list for removal after hit timeout.');
                                   }
                               }, deathAnimationDuration); // Removal happens after the specified delay
                           } else {
                                // Optional log if collision detected but enemy was already dead
                                // console.log('LOG: Bottle collision detected, but Chicken was already dead.');
                           }


                           // *** ACTION: Set the isColliding Flag on the THROWABLE BOTTLE ***
                           // This is the CRITICAL step that tells the bottle itself it has hit something.
                           // This flag, when true, triggers the bottle's onTargetHit() method
                           // within its own update() loop in ThrowableObject.class.js.
                           bottle.isColliding = true; // <-- This is the CORRECT place to set this flag for object hits!

                           // *** BOTTLE REMOVES ITSELF ***
                           // The ThrowableObject is now responsible for removing itself from the
                           // world.throwableObjects list in its onTargetHit() method after
                           // playing the splash animation timeout.
                           // DO NOT add setTimeout/splice logic for bottle removal here in World!
                           // This duplicate logic was present in older code versions and has been removed.

                           // Optional: Break the inner loop if one bottle should only hit one enemy
                           // This prevents a single bottle from killing multiple chickens in one check cycle.
                           break; // Exit the inner 'for' loop
                       }
                   }
              } else {
                   // Optional log if a bottle is in the throwableObjects list but already splashed (should be removed soon)
                   // console.log('LOG: Bottle is already splashed, skipping collision check.');
              }
         });
    }


/**
     * Checks collision between a throwable bottle and mini chickens.
     * If a collision occurs with a living mini-chicken, the mini-chicken is killed and the bottle reacts (splashes).
     * Sets bottle.isColliding = true to trigger the bottle's impact logic (splash and removal).
     * Uses a reverse loop for safe enemy removal.
     * <-- WIRD VON checkCollisionThrowableObject() AUFGERUFEN -->
     * @method
     */
    checkCollisionBottleChickenMini() {
         // --- Iterate through Thrown Bottles ---
         // Loop through all active throwable objects (bottles).
         // Using forEach is safe here because bottles remove themselves, we don't splice this array from here.
         this.throwableObjects.forEach(bottle => {
              // --- Check if Bottle is Ready for Collision ---
              // Process collision check only with bottles that haven't already splashed or hit something.
              if (!bottle.isSplashed) { // isSplashed is a flag in ThrowableObject, set after impact
                   // --- Iterate through Enemies ---
                   // Loop through all enemies in the level to find potential collision targets.
                   // Use a reverse loop because we might remove elements (Mini-Chickens) from this list during iteration using splice.
                   for (let i = this.level.enemies.length - 1; i >= 0; i--) {
                       const enemy = this.level.enemies[i]; // Get the current enemy

                       // --- Collision Check Conditions ---
                       // Check if:
                       // 1. The current enemy IS a Mini-Chicken (using instanceof).
                       // 2. The Mini-Chicken IS NOT already dead (assuming chickenIsDead boolean property exists).
                       // 3. Ensure the enemy object has an isColliding method before calling.
                       // 4. The Mini-Chicken IS currently colliding with the bottle.
                       if (enemy instanceof ChickenMini && enemy && typeof enemy.chickenIsDead === 'boolean' && !enemy.chickenIsDead && typeof enemy.isColliding === 'function' && enemy.isColliding(bottle)) { // Assuming MiniChicken also uses chickenIsDead Flag

                           // console.log('LOG: Bottle collision detected with ChickenMini.'); // Log Collision Detection

                           // --- Actions on Successful Bottle Hit ---
                           // Optional: Double check if Mini-Chicken is not dead (redundant with outer condition, but harmless safety)
                           if (!enemy.chickenIsDead) {
                              // Mark the Mini-Chicken as dead (This should trigger its death animation if implemented)
                              enemy.chickenIsDead = true; // Assuming this property exists in MiniChicken

                              // Optional: Play mini-chicken hit/dead sound (can use the same sound as normal chicken)
                              if (this.audioManager && typeof this.audioManager.playSound === 'function') { // Safety checks
                                   this.audioManager.playSound('chickenDead'); // Using 'chickenDead' sound for MiniChicken (common practice)
                                // Or if you have a specific sound: this.audioManager.playSound('chickenMiniDead');
                              } else {
                                   // Optional warning if sound method is missing
                                   // console.warn('LOG: AudioManager or playSound method missing for MiniChicken death sound.');
                              }


                              // Schedule removal of the dead Mini-Chicken from the enemy list after its death animation duration
                               const deathAnimationDuration = 500; // Duration in milliseconds (Adjust based on MiniChicken's death animation length)
                               setTimeout(() => {
                                   // Safely remove the enemy from the level's enemies list
                                   // Check if the enemy still exists in the array at its original index before trying to remove it
                                   const currentEnemyIndex = this.level.enemies.indexOf(enemy);
                                   if (currentEnemyIndex > -1) {
                                       this.level.enemies.splice(currentEnemyIndex, 1); // Remove the enemy at its index
                                       // console.log('LOG: Mini-Chicken removed from enemies list after death timeout.'); // Optional Log
                                   } else {
                                        // Optional warning if enemy was already removed
                                        // console.warn('LOG: MiniChicken not found in enemies list for removal after hit timeout.');
                                   }
                               }, deathAnimationDuration); // Removal happens after the specified delay
                           } else {
                               // Optional log if collision detected but enemy was already dead
                               // console.log('LOG: Bottle collision detected, but MiniChicken was already dead.');
                           }


                           // *** ACTION: Set the isColliding Flag on the THROWABLE BOTTLE ***
                           // This is the CRITICAL step that tells the bottle itself it has hit something.
                           // This flag, when true, triggers the bottle's onTargetHit() method
                           // within its own update() loop in ThrowableObject.class.js.
                           bottle.isColliding = true; // <-- This is the CORRECT place to set this flag for object hits!

                           // *** BOTTLE REMOVES ITSELF ***
                           // The ThrowableObject is now responsible for removing itself from the
                           // world.throwableObjects list in its onTargetHit() method after
                           // playing the splash animation timeout.
                           // DO NOT add setTimeout/splice logic for bottle removal here in World!
                           // This duplicate logic was present in older code versions and has been removed.

                           // Optional: Break the inner loop if one bottle should only hit one enemy
                           // This prevents a single bottle from killing multiple mini-chickens in one check cycle.
                           break; // Exit the inner 'for' loop
                       }
                   }
              } else {
                   // Optional log if a bottle is in the throwableObjects list but already splashed (should be removed soon)
                   // console.log('LOG: Bottle is already splashed, skipping collision check.');
              }
         });
    }

/**
     * Draws the entire game frame by frame using requestAnimationFrame.
     * Clears the canvas, applies camera translation, draws all game objects and UI elements,
     * and then requests the next frame to continue the animation loop.
     * <-- WIRD VOM Constructor aufgerufen, startet die Animations-Loop -->
     * @method
     */
    draw() {
        // 1. Clear the entire canvas before drawing the new frame.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // --- 2. Draw World Objects with Camera Translation ---
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
        this.addToMap(this.character); // Draw the main character.
        this.addObjectsToMap(this.level.endboss); // Draw endboss(es).
        this.addObjectsToMap(this.level.enemies); // Draw other enemies (Chicken, MiniChicken, etc.).
        this.addObjectsToMap(this.level.coins); // Draw collectible coins.
        this.addObjectsToMap(this.level.bottles); // Draw collectible bottles.
        this.addObjectsToMap(this.throwableObjects); // Draw active thrown bottles.

        // Restore the canvas context to its state before the camera translation.
        // This is crucial so that subsequent drawing (UI elements) is not affected by the camera.
        this.ctx.restore();


        // --- 3. Draw Fixed UI Elements (Status Bars) without Camera Translation ---
        // These elements are drawn in the fixed canvas coordinate system, always visible regardless of camera position.
        // No translation needed here.
        // Saving/Restoring context isn't strictly necessary here if no further transformations are applied,
        // but is good practice if you add more complex UI drawing later.
        // this.ctx.save();
        this.addToMap(this.statusBar); // Draw Character Health Status Bar.
        this.addToMap(this.statusBarBottle); // Draw Bottle Count Status Bar.
        this.addToMap(this.statusBarCoin); // Draw Coin Count Status Bar.
        this.addToMap(this.statusBarEndboss); // Draw Endboss Health Status Bar.
        // Optional: Add other fixed UI elements (like score, messages) here.
        // this.ctx.restore();


        // 4. Request the next frame for the animation loop.
        // This creates a continuous loop that calls draw() again and again, updating the display.
        requestAnimationFrame(() => {
            this.draw(); // Recursive call to continue the loop.
        });
    }

/**
     * Adds an array of movable objects to the map for drawing.
     * Iterates through each object in the array and calls addToMap for drawing.
     * Includes safety checks to ensure the input is an array and objects are valid.
     * <-- WIRD VON draw() AUFGERUFEN, um Listen von Objekten zu zeichnen -->
     * @method
     * @param {MovableObject[]} objects - An array of movable objects to draw on the canvas.
     */
    addObjectsToMap(objects) {
        // --- Safety Check: Ensure the input is a valid array ---
        // This prevents errors if draw() accidentally passes something that is not an array.
        if (Array.isArray(objects)) {
            // --- Iterate through the Array ---
            // Loop through each object in the provided array.
            // forEach is safe here as we are not modifying (adding/removing) the 'objects' array during iteration.
            objects.forEach(o => {
                // --- Safety Check: Ensure the object itself is valid ---
                // Check if the current element 'o' is not null or undefined before attempting to draw it.
                if (o) {
                     // Delegate the actual drawing of the single object to the addToMap method.
                     this.addToMap(o);
                } else {
                     // Optional warning if a null/undefined object is found in the list.
                     // console.warn('LOG: Skipping drawing for null/undefined object found in array:', objects);
                }
            });
        } else {
             // Optional warning if the input was not an array.
             // console.warn('LOG: addObjectsToMap called with invalid input (not an array):', objects);
        }
    }

/**
     * Adds a single movable object or UI element to the canvas for drawing.
     * Handles horizontal image flipping for objects facing the opposite direction,
     * with a special case for the dead Endboss not to be flipped.
     * Draws the object's image and optionally its collision frame for debugging.
     * <-- This is a core drawing method called by draw() and addObjectsToMap() -->
     * <-- Includes the logic to fix the dead Endboss rotation issue -->
     * @method
     * @param {MovableObject | DrawableObject} mo - The object instance to draw on the canvas.
     */
    addToMap(mo) {
        // --- Safety Check: Ensure the object is valid and has a draw method ---
        // Prevents errors if a null/undefined object or an object without a draw method is passed.
        if (!mo || typeof mo.draw !== 'function') {
             // console.warn('LOG: addToMap called with invalid object (missing draw method):', mo); // Warning for debugging
             return; // Exit the method if the object is invalid
        }

        // --- Handle Image Flipping ---
        // Determine if the object should be flipped horizontally (e.g., if facing left).
        // Includes a special condition to NOT flip the dead Endboss, even if its otherDirection flag is true.
        // Assumes Endboss instances have an 'isDeadEndboss()' method and other MovableObjects have 'otherDirection'.
        const isDeadEndboss = mo instanceof Endboss && typeof mo.isDeadEndboss === 'function' && mo.isDeadEndboss();

        // The object should be flipped if it's facing the other direction AND it's NOT a dead Endboss.
        // We check if mo.otherDirection exists before using it, as not all DrawableObjects might have it.
        const shouldFlip = (mo && typeof mo.otherDirection === 'boolean' && mo.otherDirection) && !isDeadEndboss; // <-- CORRECTED FLIP CONDITION

        if (shouldFlip) {
            // If flipping is needed, apply canvas transformations.
            this.flipImage(mo); // Delegates to flipImage method to modify the context and object's x.
        }

        // --- Draw Object Image ---
        // Call the object's own draw method to render its image on the canvas context.
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

        // Optional: Add logging here to track which objects are being drawn.
        // if (mo instanceof Endboss) console.log('LOG: Drawing Endboss. otherDirection:', mo.otherDirection, 'isDead:', isDeadEndboss, 'ShouldFlip:', shouldFlip);
        // console.log('LOG: Added to map:', mo.constructor.name, 'at x:', mo.x, 'y:', mo.y);
    }

/**
     * Flips the canvas context horizontally for drawing an object in the opposite direction.
     * Saves the current context state before transforming.
     * Updates the object's x-coordinate temporarily for drawing within the flipped context.
     * <-- WIRD VON addToMap() AUFGERUFEN, wenn mo.otherDirection wahr ist (und nicht toter Endboss) -->
     * @method
     * @param {MovableObject | DrawableObject} mo - The object instance whose image needs to be flipped.
     */
    flipImage(mo) {
        // 1. Save the current state of the canvas context.
        // This is crucial so we can revert the transformations later in flipImageBack().
        this.ctx.save();

        // 2. Translate (shift) the origin of the canvas context horizontally.
        // We move the origin to the right edge of the object (mo.width, 0).
        // This prepares the context so that when we scale by -1, it flips around the object's own axis (right edge)
        // instead of flipping around the canvas origin (0,0).
        this.ctx.translate(mo.width, 0);

        // 3. Scale the canvas context horizontally by -1.
        // This performs the actual horizontal mirroring/flipping. The y-axis scale is 1 (no vertical change).
        this.ctx.scale(-1, 1);

        // 4. Adjust the object's x-coordinate for the flipped context.
        // Since the context's origin is now at the object's right edge and scaled by -1,
        // multiplying the object's original x-coordinate by -1 places it correctly
        // in the new, flipped coordinate system for drawing.
        // This modification to mo.x is TEMPORARY for drawing only!
        mo.x = mo.x * -1;
    }

/**
     * Restores the canvas context to its state before horizontal flipping.
     * Corrects the object's x-coordinate back to its original value, undoing the temporary change made for drawing.
     * <-- WIRD VON addToMap() AUFGERUFEN, wenn flipImage aufgerufen wurde -->
     * @method
     * @param {MovableObject | DrawableObject} mo - The object instance whose image was flipped.
     */
    flipImageBack(mo) {
        // 1. Reset the object's x-coordinate to its original value.
        // This reverses the temporary change made in flipImage().
        mo.x = mo.x * -1; // Undoes the mo.x = mo.x * -1 operation

        // 2. Restore the canvas context to the state it was in before flipImage() was called.
        // This reverts the translate and scale transformations.
        // It restores the context to the state saved by this.ctx.save() in flipImage().
        this.ctx.restore();
    }


/**
     * Stops all relevant game intervals and processes for the character, enemies, throwable objects, and world logic.
     * This function should be called when the game ends (either win or lose) to freeze the game state.
     * It delegates the stopping of specific object intervals to the objects themselves.
     * <-- WIRD VON gameLose() und gameWin() AUFGERUFEN (typischerweise in game.js) -->
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
            // Optional: Clear the list of thrown objects immediately when the game stops.
            // This can also be done in the gameWin/gameLose cleanup logic if needed later.
            // this.throwableObjects = []; // Safely clear the array
        } else {
             // Optional warning if the list is invalid.
             console.warn("LOG: this.throwableObjects is not an array or missing, cannot stop bottle intervals.");
        }


        // 4. Stop World-specific intervals (like the main collision checks and throwable logic interval).
        this.stopWorldIntervals(); // Delegates to a separate method to clear specific World interval IDs.
        // console.log("LOG: World intervals stopped."); // Optional log


        // 5. Stop World's RequestAnimationFrame loops, if any, that are NOT managed by object intervals.
        // Typically, the main draw loop isn't explicitly cancelled here; it just stops drawing movement as objects stop updating.
        // If you have a separate RAF ID for a world-specific loop, you would add cancelAnimationFrame(this.yourWorldRafId) here.


        // 6. Pause or stop background music and Endboss specific music.
        // Ensure AudioManager and its pause methods exist.
        if (this.audioManager && typeof this.audioManager.pauseBackgroundMusic === 'function' && typeof this.audioManager.pauseEndbossMusic === 'function') {
            // console.log("LOG: Pausing background and endboss music."); // Optional log
            this.audioManager.pauseBackgroundMusic();
            this.audioManager.pauseEndbossMusic(); // Pause Endboss specific music if it's playing.
        } else {
            // Optional warning if AudioManager or pause methods are missing.
            // console.warn('LOG: AudioManager or pause music methods not available in stopAllIntervals.');
        }


        // 7. Optional: Stop Gravity for any remaining MovableObjects.
        // This section is often redundant if stop...Intervals() methods in specific classes
        // correctly call super.stopGravity() for all objects that use gravity.
        // Keeping it commented out is fine unless you find objects still affected by gravity after stopping intervals.
        /*
        console.log("LOG: Attempting to stop gravity for all remaining movable objects.");
        const allMovableObjects = [this.character, ...(Array.isArray(this.level.enemies) ? this.level.enemies : []), ...(Array.isArray(this.level.endboss) ? this.level.endboss : []), ...(Array.isArray(this.throwableObjects) ? this.throwableObjects : [])]; // Gather all potential objects
        allMovableObjects.forEach(obj => {
            if (obj && typeof obj.stopGravity === 'function') {
                obj.stopGravity(); // Call stopGravity method on the object if it exists.
            }
        });
        */

        console.log("LOG: --- End stopAllIntervals (World) ---"); // Log end
    }

/**
     * Stops the intervals specific to the World class (e.g., main collision check and throwable object logic intervals).
     * Clears the interval IDs and sets them to null.
     * <-- WIRD VON stopAllIntervals() AUFGERUFEN, um World-eigene Loops anzuhalten -->
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

    // --- Commented Out / Removed Methods ---

    // /**
    //  * Removes an object (coin, collectible bottle, or potentially ThrowableObject) from its respective list in the level.
    //  * This method's logic was ambiguous and is redundant with direct splice calls in collision/collection methods.
    //  * It should ideally be DELETED from the class.
    //  */
    // /*
    // removeObject(object) {
    //     console.warn('LOG: removeObject() called. This method is likely redundant and should be deleted.');
    //     // The problematic and ambiguous logic for removing objects based on type and indexOf was here.
    //     // ... (code removed) ...
    // }
    // */
    // // *** ACTION: DELETE the removeObject() method completely! ***
    // // Object removal is now handled directly using splice(i, 1) within the iterating collision/collection methods.


    // /**
    //  * Optional alternative method to periodically check for dead enemies and remove them after their death animation finishes.
    //  * This is an alternative pattern to using setTimeout for removal in the collision methods.
    //  * Not currently used in the active code.
    //  */
    // /*
    // checkDeadEnemies() {
    //     // This method would need to be called by an interval in run() to work.
    //     // Iterates through enemies and removes them if they are dead AND their death animation is finished.
    //     // ... (code removed) ...
    // }
    // */
    // // *** Note: The current code uses setTimeout in checkCollisionBottle... methods for timed enemy removal, which is also a valid approach. ***


    // --- End of World Class ---
}