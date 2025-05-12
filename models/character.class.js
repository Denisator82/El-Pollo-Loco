/**
 * Represents the main character in the game.
 * Inherits from MovableObject and includes properties for dimensions, speed,
 * and collected items such as coins and bottles.
 */
class Character extends MovableObject {
    y = 180; // Y-coordinate of the character
    height = 250; // Height of the character
    width = 120; // Width of the character
    speed = 5; // Speed of the character
    coinsCollected = 0; // Number of coins collected by the character
    bottlesCollected = 0; // Number of bottles collected by the character
    world; // Reference to the game world (initialize as needed)
    offset = {
        top: 80,    // Oberer Abstand (reduziert die Höhe der Kollisionsbox oben)
        left: 20,   // Linker Abstand (reduziert die Breite der Kollisionsbox links)
        right: 20,  // Rechter Abstand (reduziert die Breite der Kollisionsbox rechts)
        bottom: 0    // Unterer Abstand (reduziert die Höhe der Kollisionsbox unten)
    };

    /**
     * Images for the standing state of the character
     */
    IMAGES_STANDING = [
        'img/img/2_character_pepe/1_idle/idle/I-1.png',
        'img/img/2_character_pepe/1_idle/idle/I-2.png',
        'img/img/2_character_pepe/1_idle/idle/I-3.png',
        'img/img/2_character_pepe/1_idle/idle/I-4.png',
        'img/img/2_character_pepe/1_idle/idle/I-5.png',
        'img/img/2_character_pepe/1_idle/idle/I-6.png',
        'img/img/2_character_pepe/1_idle/idle/I-7.png',
        'img/img/2_character_pepe/1_idle/idle/I-8.png',
        'img/img/2_character_pepe/1_idle/idle/I-9.png',
        'img/img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    /**
     * Images for the sleeping state of the character
     */
    IMAGES_SLEEPING = [
        'img/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    /**
     * Images for the walking state of the character
     */
    IMAGES_WALKING = [
        'img/img/2_character_pepe/2_walk/W-21.png',
        'img/img/2_character_pepe/2_walk/W-22.png',
        'img/img/2_character_pepe/2_walk/W-23.png',
        'img/img/2_character_pepe/2_walk/W-24.png',
        'img/img/2_character_pepe/2_walk/W-25.png',
        'img/img/2_character_pepe/2_walk/W-26.png',
    ];

    /**
     * Images for the jumping state of the character
     */
    IMAGES_JUMPING = [
        'img/img/2_character_pepe/3_jump/J-31.png',
        'img/img/2_character_pepe/3_jump/J-32.png',
        'img/img/2_character_pepe/3_jump/J-33.png',
        'img/img/2_character_pepe/3_jump/J-34.png',
        'img/img/2_character_pepe/3_jump/J-35.png',
        'img/img/2_character_pepe/3_jump/J-36.png',
        'img/img/2_character_pepe/3_jump/J-37.png',
        'img/img/2_character_pepe/3_jump/J-38.png',
        'img/img/2_character_pepe/3_jump/J-39.png'
    ];

    /**
     * Images for the dead state of the character
     */
    IMAGES_DEAD = [
        'img/img/2_character_pepe/5_dead/D-51.png',
        'img/img/2_character_pepe/5_dead/D-52.png',
        'img/img/2_character_pepe/5_dead/D-53.png',
        'img/img/2_character_pepe/5_dead/D-54.png',
        'img/img/2_character_pepe/5_dead/D-55.png',
        'img/img/2_character_pepe/5_dead/D-56.png',
        'img/img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Images for the hurt state of the character
     */
    IMAGES_HURT = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'
    ];

    moveIntervalId = null; // Speichert die ID des Bewegungsintervalls
    animationIntervalId = null; // Speichert die ID des Animationsintervalls

    /**
     * Initializes the Character class, loads the initial image, sets collision offsets,
     * applies gravity, and begins animation.
     */
    constructor() {
        super(); // Call the parent class constructor

        // Load the initial standing image
        this.loadImage(this.IMAGES_STANDING[0]);

        // Load all images for various states
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        // Set the offset for collision detection
        this.offset = { top: 100, right: 30, bottom: 10, left: 20 };

        // Apply gravity to the character
        this.applyGravity();

        // Start the animation
        this.animateCharacter();
    }

    /**
     * Reduces the character's energy by a specified amount when hit.
     * Sets last hit timestamp and plays hurt sound if character is not dead.
     * @param {number} damageAmount - The amount of energy to reduce.
     * @method
     */
    hit(damageAmount) { // <-- Parameter damageAmount hinzugefügt
        // Optional: Prüfe, ob damageAmount eine gültige Zahl ist, bevor du rechnest
        if (typeof damageAmount !== 'number' || damageAmount < 0) {
            console.warn('LOG: Character hit() called with invalid damageAmount:', damageAmount);
            damageAmount = 0; // Setze Schaden auf 0, wenn ungültig
        }

        this.energy -= damageAmount; // <-- Zieht den übergebenen Schaden ab

        if (this.energy < 0) {
            this.energy = 0; // Energie nicht unter 0 fallen lassen
        }

        // Setze lastHit nur, wenn der Charakter noch NICHT tot ist, um Hurt-Animation zu triggern
        if (!this.isDead()) {
            this.lastHit = new Date().getTime();

            // Sound beim getroffen werden
            // Stelle sicher, dass world und audioManager verfügbar sind
            if (this.world && this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
                this.world.audioManager.playSound('hurt'); // Benötigt 'hurt' Sound
            }
        } else {
            // Wenn der Charakter stirbt, kannst du hier spezielle Todesaktionen triggern,
            // aber die Game Over Logik ist ja im CollisionManager.
            console.log('LOG: Character died.'); // Optionaler Log
        }
    } // <-- Ende von hit(damageAmount)

    /**
     * Checks if the character is currently hurt.
     * Returns true if the character was hit within the last second.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 1;
    }

    /**
     * Checks if the character is dead.
     * Returns true if the character's energy is 0, otherwise false.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Moves the character to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the character to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the character jump if not already above the ground.
     */
    jump() {
    if (!this.isDead() && !this.isAboveGround()) { // Füge isDead hinzu, damit totes Char nicht springt
        this.speedY = 25; // Apply vertical speed to simulate jump (vielleicht 20 für etwas höheren Sprung?)
        this.applyGravity(); // <-- HINZUFÜGEN: Startet die Schwerkraft, damit der Charakter wieder fällt

        if (this.world && this.world.audioManager) {
            this.world.audioManager.playSound('jump');
        }
        this.resetStandingTime();
    }
}

/**
 * Animates the character based on its state (walking, jumping, etc.).
 * Handles character movement and sound effects based on keyboard input.
 * Manages the character's animation and updates the camera position.
 * Contains logging to check the character's X-position for debugging the Endboss "first contact".
 * @method
 */
animateCharacter() {
    // Primary animation loop running at approximately 60 frames per second.
    // This interval handles movement based on keyboard input, direction, and camera updates.
    this.moveIntervalId = setInterval(() => { // Store the interval ID
        let isMoving = false; // Flag to check if the character is currently moving

        // --- Handle Rightward Movement ---
        // Check if the RIGHT arrow key is pressed AND the character is within the level boundaries.
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight(); // Call the method to move the character to the right.
            this.otherDirection = false; // Set facing direction to right.
            // Play walking sound (ensure sound is handled correctly - playing only when moving).
            if (this.world && this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
                this.world.audioManager.playSound('walk'); // Assuming 'walk' sound exists and can be played/paused.
            }
            this.resetStandingTime(); // Reset idle/sleeping timer as character is active.
            isMoving = true; // Set moving flag.
        }

        // --- Handle Leftward Movement ---
        // Check if the LEFT arrow key is pressed AND the character is within the left boundary (usually 0).
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft(); // Call the method to move the character to the left.
            this.otherDirection = true; // Set facing direction to left.
            // Play walking sound.
            if (this.world && this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
                this.world.audioManager.playSound('walk'); // Assuming 'walk' sound exists.
            }
            this.resetStandingTime(); // Reset idle/sleeping timer.
            isMoving = true; // Set moving flag.
        }

        // --- Pause Walking Sound if Not Moving ---
        // Check if the character is NOT moving and the walk sound is currently playing/exists.
        if (!isMoving && this.world && this.world.audioManager && this.world.audioManager.sounds && this.world.audioManager.sounds['walk']) {
             // Assuming audioManager.sounds['walk'] gives access to the HTMLAudioElement or similar.
            if (typeof this.world.audioManager.sounds['walk'].pause === 'function') { // Safety check
                 this.world.audioManager.sounds['walk'].pause(); // Pause the walking sound.
                 this.world.audioManager.sounds['walk'].currentTime = 0; // Reset sound playback position to the start.
            }
        }

        // --- Handle Jumping ---
        // Check if the SPACE key is pressed AND the character is NOT currently in the air.
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump(); // Call the jump method.
            this.resetStandingTime(); // Reset idle/sleeping timer.
        }

        // --- Camera Update ---
        // Adjust the camera's X position based on the character's position.
        // This creates the scrolling effect. '-this.x + 100' centers the character roughly with an offset of 100 pixels.
        this.world.camera_x = -this.x + 100;

        // // *** LOGGING FOR ENDBOSS FIRST CONTACT DEBUGGING ***
        // // This log will show the character's current X-coordinate in the console.
        // // Check this value as you approach the Endboss area (around X=3500).
        // console.log('LOG: Character X:', this.x); // <-- DIESEN LOG HINZUFÜGEN UND IN DER KONSOLE BEOBACHTEN!
        // // ****************************************************

    }, 1000 / 60); // Run this interval at 60 frames per second for smooth movement and frequent checks/logs.


    // Secondary animation loop (runs at approximately 10 frames per second).
    // This interval determines which animation sequence (walking, jumping, dead, etc.) is currently playing.
    this.animationIntervalId = setInterval(() => { // Store the interval ID
        // --- Animation State Logic ---
        // Play animations based on the character's current state, prioritized from critical states (dead) to idle.
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD); // Play the dead animation.
            this.resetStandingTime(); // Keep resetting timer even if dead? (Behavior depends on game design).
            // Game Over logic (stopping intervals etc.) is handled by World/global functions, not typically here.
        } else if (this.isHurt && typeof this.isHurt === 'function' && this.isHurt()) { // Check if hurt state is active (and method exists)
             this.playAnimation(this.IMAGES_HURT); // Play the hurt animation.
             this.resetStandingTime(); // Reset idle timer while hurt.
        } else if (this.isAboveGround()) { // Check if character is in the air (jumping or falling)
            this.playAnimation(this.IMAGES_JUMPING); // Play the jumping animation.
            this.resetStandingTime(); // Reset idle timer while in the air.
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) { // Check if moving horizontally
            this.playAnimation(this.IMAGES_WALKING); // Play the walking animation.
            this.resetStandingTime(); // Reset idle timer while walking.
        } else { // Character is not dead, not hurt, not in air, and not moving horizontally
            // Play the standing/idle animation, potentially transitioning to sleeping.
            this.animateStanding(); // Calls a helper method to manage idle/sleeping based on standing time.
        }
        // Note: playAnimation internally increments the image index and loads the next frame.
    }, 100); // Run this interval at 10 frames per second (100ms) - sufficient for most character animations.
}

    /**
     * Plays the standing animation for the character.
     * If the character stands still for a duration exceeding the sleep delay,
     * it plays the sleeping animation.
     */
    animateStanding() {
        // Play the standing animation
        this.playAnimation(this.IMAGES_STANDING);
        // Increment the standing time by 65 ms
        this.standingTime += 65;
        // If the character has been standing for longer than the sleep delay, switch to the sleeping animation
        if (this.standingTime >= this.sleepDelay) {
            this.playAnimation(this.IMAGES_SLEEPING);
        }
    }

    /**
     * Resets the standing time counter to 0.
     */
    resetStandingTime() {
        this.standingTime = 0;
    }

/**
     * Collects a coin and updates the character's internal state and status bar.
     * Plays a sound upon collection.
     * The coin removal from the world list is handled by the World class.
     * @param {Coin} coin - The coin object to be collected.
     * @method
     */
    collectCoin(coin) {
        this.coinsCollected++;
        if (this.world && this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
            this.world.audioManager.playSound('coinCollected'); // Play sound if AudioManager is available.
        }
    }

    /**
     * Collects a collectible bottle and updates the character's internal bottle count and status bar.
     * Plays a sound upon collection.
     * The bottle removal from the world list is handled by the World class.
     * @param {Bottle} bottle - The collectible bottle object to be collected.
     * @method
     */
    collectBottle(bottle) {
        this.bottlesCollected++; // Correct: Character's internal counter is incremented.

        // The line this.world.removeObject(bottle); is now correctly removed/commented out.

        this.updateBottleStatus(); // Correct: Delegate updating the status bar to a helper method.

        // Play collectible bottle sound. This is valid Character-internal sound logic.
        if (this.world && this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
            this.world.audioManager.playSound('bottleCollect'); // Play sound if AudioManager is available.
        }
    }

    /**
     * Updates the bottle status bar based on the character's collected bottle count.
     * Calculates the percentage for the status bar and calls the World's status bar instance.
     * @method
     */
    updateBottleStatus() {
         // Calculation logic for percentage. Based on 8 bottles for 100%.
         const bottlesPerLevel = 8; // How many bottles total for 100% status bar?
         const percentage = (this.bottlesCollected / bottlesPerLevel) * 100; // Calculate percentage directly from total count

        // Update the specific status bar instance owned by the World.
        // This is functional: Character tells World's UI element to update.
        // Alternative (slightly cleaner design): World updates its own status bar directly in the collision method.
        if (this.world && this.world.statusBarBottle && typeof this.world.statusBarBottle.setPercentage === 'function') {
            this.world.statusBarBottle.setPercentage(percentage);
        }
    }

/**
     * Throws a bottle if the character has bottles available.
     * Decrements the bottle count, updates the status bar, creates a new throwable object,
     * adds it to the world, plays a sound, and resets standing time.
     * @param {boolean} otherDirection - Indicates if the character is facing the other direction (left).
     * @method
     */
    throwBottle(otherDirection) {
        if (this.bottlesCollected > 0) { // Check if the character has bottles to throw
            this.bottlesCollected--; // Decrement the internal bottle count
            this.updateBottleStatus(); // Update the bottle count status bar in the UI

            // --- Calculate the starting position of the thrown bottle ---
            let bottleX = this.x; // Start with the character's x-position

            // Adjust the starting X position based on the character's facing direction (otherDirection).
            // Position the bottle near the character's edge, not in the center.
            // The parameter offsetX was not passed from World, so it was undefined.
            // We will calculate the position using the character's width and maybe a small fixed offset.
            const bottleHorizontalOffset = 10; // Adjust this value for desired spacing from character's edge

            if (otherDirection) {
                // If facing left, start the bottle near the character's left edge.
                bottleX -= bottleHorizontalOffset; // Start 'bottleHorizontalOffset' pixels to the left of character's x.
            } else {
                // If facing right, start the bottle near the character's right edge.
                bottleX += this.width - bottleHorizontalOffset; // Start 'bottleHorizontalOffset' pixels to the left of character's right edge.
            }

            // Calculate the starting Y position (vertically somewhat centered relative to the character).
            let bottleY = this.y + this.height / 2 - 20; // Adjust '-20' for desired vertical position

            // --- Create and Add the Throwable Object ---
            // Create a new ThrowableObject instance at the calculated position with the character's direction.
            let bottle = new ThrowableObject(bottleX, bottleY, otherDirection);
            // Add the newly created bottle to the World's list of active throwable objects.
            this.world.throwableObjects.push(bottle);

            // Play the bottle throw sound (This can also be in World.checkThrowObjects, but here is also fine).
            if (this.world && this.world.audioManager && typeof this.world.audioManager.playSound === 'function') {
                this.world.audioManager.playSound('throw'); // Play throw sound.
            }

            // Reset the character's standing time (likely to prevent idle animation immediately after action).
            if (typeof this.resetStandingTime === 'function') { // Safety check
                this.resetStandingTime();
            } else {
                 // Optional warning
                 // console.warn('LOG: Character resetStandingTime method not found.');
            }
        }
    }

/**
     * Stops all specific intervals associated with the character's movement and animation.
     * Sets the interval IDs to null after clearing.
     * <-- WIRD VON World.stopAllIntervals() aufgerufen -->
     * @method
     */
    stopCharacterIntervals() {
        // Clear the movement interval and reset its ID.
        if (this.moveIntervalId) { // Safety check
            clearInterval(this.moveIntervalId);
            this.moveIntervalId = null; // Set ID to null
        } else {
            // Optional warning
            // console.warn('LOG: Character moveIntervalId was null when trying to stop.');
        }


        // Clear the animation interval and reset its ID.
        if (this.animationIntervalId) { // Safety check
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null; // Set ID to null
        } else {
            // Optional warning
            // console.warn('LOG: Character animationIntervalId was null when trying to stop.');
        }

        // Optional: If character has a gravity requestAnimationFrame loop managed by a specific ID, cancel it here.
        // Example: if (this.gravityFrameId) { cancelAnimationFrame(this.gravityFrameId); this.gravityFrameId = null; }
        // Or if gravity is handled by a general update loop that gets stopped, this might not be needed here.


        // Optional log to confirm method execution.
        // console.log('LOG: Character intervals stopped.');
    }
}