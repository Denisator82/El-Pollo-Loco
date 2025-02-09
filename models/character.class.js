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
    walking_sound = new Audio('audio/walking_sound.mp3'); // Sound for walking
    jumping_sound = new Audio('audio/jumping_sound.mp3'); // Sound for jumping

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
     * Reduces the character's energy by a fixed amount (1) when hit.
     * If energy falls below 0, it is set to 0. Otherwise, updates the timestamp of the last hit.
     */
    hit() {
        this.energy -= 1;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
    
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
        if (!this.isAboveGround()) {
            this.speedY = 15; // Apply vertical speed to simulate jump
        }
    }

    /**
     * Animates the character based on its state (walking, jumping, etc.).
     * Handles character movement and sound effects.
     */
    animateCharacter() {
        // Primary animation loop running at approximately 60 frames per second
        setInterval(() => {
            this.walking_sound.pause(); // Pause the walking sound initially

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.walking_sound.play(); // Play the walking sound
                this.resetStandingTime(); // Reset the standing time counter
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.walking_sound.play(); // Play the walking sound
                this.resetStandingTime(); // Reset the standing time counter
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.jumping_sound.play(); // Play the jumping sound
                this.resetStandingTime(); // Reset the standing time counter
            }

            // Update the camera position based on the character's x position
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60); // Run at 60 frames per second

        // // Secondary animation loop (approx. 10 FPS)
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD); // Play the dead animation if the character is dead
                this.resetStandingTime();
                this.playAnimation(this.IMAGES_HURT); // Play the hurt animation if the character is hurt
                this.resetStandingTime();
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING); // Play the jumping animation if the character is in the air
                this.resetStandingTime();
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING); // Play the walking animation if moving left or right
                this.resetStandingTime();
            } else {
                this.animateStanding(); // Play the standing animation if no other conditions are met
            }
        }, 100); // Run at 10 frames per second
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
     * Collects a coin and updates the coin status.
     * @param {Object} coin - The coin object to be collected.
     */
    collectCoin(coin) {
        this.coinsCollected++; // Increment the collected coins counter
        this.world.removeObject(coin); // Remove the coin from the world
        this.updateCoinStatus(); // Update the coin status
    }

    /**
     * Updates the coin status bar based on the number of collected coins.
     */
    updateCoinStatus() {
        // 1 level per 2 coins
        const coinsPerLevel = 2;
        const level = Math.floor(this.coinsCollected / coinsPerLevel);
        const percentage = (level / 5) * 100;
        this.world.statusBarCoin.setPercentage(percentage); // Set the percentage for the coin status bar
    }

    /**
     * Collects a bottle and updates the bottle status.
     * @param {Object} bottle - The bottle object to be collected.
     */
    collectBottle(bottle) {
        this.bottlesCollected++; // Increment the collected bottles counter
        this.world.removeObject(bottle); // Remove the bottle from the world
        this.updateBottleStatus(); // Update the bottle status
    }

    /**
     * Updates the bottle status bar based on the number of collected bottles.
     */
    updateBottleStatus() {
        // 1 level per 8 bottles
        const bottlesPerLevel = 8;
        const percentage = (this.bottlesCollected / bottlesPerLevel) * 100;
        this.world.statusBarBottle.setPercentage(percentage); // Set the percentage for the bottle status bar
    }

    /**
     * Throws a bottle if available and updates the bottle status.
     */
    throwBottle() {
        if (this.bottlesCollected > 0) {
            this.bottlesCollected--; // Decrement the collected bottles counter
            this.updateBottleStatus(); // Update the bottle status
            let bottle = new ThrowableObject(this.x + 100, this.y + 100); // Create a new throwable object
            this.world.throwableObjects.push(bottle); // Add the throwable object to the world
        }
    }
}