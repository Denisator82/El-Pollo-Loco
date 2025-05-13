/**
 * Represents the main character in the game.
 * Inherits from MovableObject.
 */
class Character extends MovableObject {
    y = 180; // Y-coordinate
    height = 250; // Height
    width = 120; // Width
    speed = 5; // Speed
    coinsCollected = 0; // Coins collected
    bottlesCollected = 0; // Bottles collected
    wasMovingLastFrame = false;
    world; // Reference to the game world
    offset = { top: 80, left: 20, right: 20, bottom: 0 }; // Collision box offsets

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

    moveIntervalId = null; // Stores the movement interval ID
    animationIntervalId = null; // Stores the animation interval ID

    /**
     * Initializes the character, loads images, sets collision offset,
     * applies gravity, and starts the animation.
     */
    constructor() {
        super(); // Parent constructor

        this.loadImage(this.IMAGES_STANDING[0]);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.offset = { top: 100, right: 30, bottom: 10, left: 20 };

        this.applyGravity();
        this.animateCharacter();
    }

    /**
     * Reduces energy when damaged and plays a sound, unless the character is dead.
     * @param {number} damageAmount - The amount of damage to reduce from the character's energy.
     */
    hit(damageAmount) {
        if (typeof damageAmount !== 'number' || damageAmount < 0) {
            console.warn('Invalid damage:', damageAmount);
            damageAmount = 0;
        }

        this.energy -= damageAmount;
        if (this.energy < 0) this.energy = 0;

        if (!this.isDead()) {
            this.lastHit = new Date().getTime();
            if (this.world?.audioManager?.playSound)
                this.world.audioManager.playSound('hurt');
        } else {
            console.log('LOG: Character died.');
        }
    }

    /**
     * Returns true if the character was hit recently.
     * @returns {boolean} - True if the character was hit within the last second.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return (timepassed / 1000) < 1;
    }

    /**
     * Returns true if the character is dead (energy is 0).
     * @returns {boolean} - True if the character is dead.
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
     * Makes the character jump if possible (not dead and not above the ground).
     */
    jump() {
        if (!this.isDead() && !this.isAboveGround()) {
            this.speedY = 25;
            this.applyGravity();
            if (this.world?.audioManager)
                this.world.audioManager.playSound('jump');
            this.resetStandingTime();
        }
    }

    /**
     * Startet zwei Intervalle: Bewegung (~60 FPS) & Animation (~10 FPS).
     */
    animateCharacter() {
        this.moveIntervalId = setInterval(() => {
            this._updateMovementAndSoundState();
            this._updateCamera();
        }, 1000 / 60);

        this.animationIntervalId = setInterval(() => {
            this._playAnimationBasedOnState();
        }, 100); 
    }


    /**
     * Verwaltet Bewegung, Springen und Sound-Zustände pro Frame.
     */
    _updateMovementAndSoundState() {
        let isMovingThisFrame = false;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight(); this.otherDirection = false;
            this.resetStandingTime(); isMovingThisFrame = true;
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft(); this.otherDirection = true;
            this.resetStandingTime(); isMovingThisFrame = true;
        }

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump(); this.resetStandingTime();
        }

        this._handleWalkingSound(isMovingThisFrame);
        this.wasMovingLastFrame = isMovingThisFrame;
    }

    /**
     * Startet oder stoppt Laufgeräusche basierend auf Bewegungsstatus.
     */
    _handleWalkingSound(isMovingThisFrame) {
        const walkSound = this.world?.audioManager?.sounds?.['walk'];
        if (!walkSound) return;

        if (isMovingThisFrame && !this.wasMovingLastFrame) {
            if (typeof walkSound.play === 'function') {
                walkSound.currentTime = 0;
                walkSound.play();
            }
        } else if (!isMovingThisFrame && this.wasMovingLastFrame) {
            if (typeof walkSound.pause === 'function') {
                walkSound.pause(); walkSound.currentTime = 0;
            }
        }
    }


    /**
     * Aktualisiert die Kamera basierend auf der X-Position des Charakters.
     */
    _updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Determines and plays the correct animation sequence based on the character's state.
     * Called by the animationIntervalId (~10 FPS).
     * @private
     * @method
     */
    _playAnimationBasedOnState() { // <-- NEUE HILFSMETHODE (< 14 Zeilen)
        // Play animations based on the character's current state, prioritized from critical states (dead) to idle.
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.resetStandingTime();
        } else if (this.isHurt && typeof this.isHurt === 'function' && this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.resetStandingTime();
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
            this.resetStandingTime();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) { // Prüft immer noch, ob eine Richtungstaste gedrückt ist
            this.playAnimation(this.IMAGES_WALKING);
            this.resetStandingTime();
        } else {
            this.animateStanding(); // Ruft Hilfsmethode für Idle/Sleeping auf
        }
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
     * Increments coin count and plays a collection sound.
     * Coin removal from world is handled elsewhere.
     * @param {Coin} coin - The collected coin object.
     */
    collectCoin(coin) {
        this.coinsCollected++;
        this.world?.audioManager?.playSound?.('coinCollected');
    }

    /**
     * Increments bottle count, updates the status bar, and plays a collection sound.
     * @param {Bottle} bottle - The collected bottle (removed by the World class).
     */
    collectBottle(bottle) {
        this.bottlesCollected++;
        this.updateBottleStatus?.();
        this.world?.audioManager?.playSound?.('bottleCollect');
    }

    /**
     * Updates the bottle status bar based on collected bottle count (max 8 = 100%).
     */
    updateBottleStatus() {
        const percent = (this.bottlesCollected / 8) * 100;
        this.world?.statusBarBottle?.setPercentage?.(percent);
    }

    /**
     * Throws a bottle if available: updates status, creates and adds the bottle, plays sound.
     * @param {boolean} otherDirection - True if character is facing left.
     */
    throwBottle(otherDirection) {
        if (this.bottlesCollected <= 0) return;
        this.bottlesCollected--;
        this.updateBottleStatus?.();
        
        const offsetX = 30, offsetY = 20;
        const bottleX = otherDirection ? this.x - offsetX : this.x + this.width - offsetX;
        const bottleY = this.y + this.height / 2 - offsetY;
        const bottle = new ThrowableObject(this.world, bottleX, bottleY, otherDirection);
        
        this.world?.throwableObjects?.push?.(bottle) ||
        console.error('LOG: Could not add bottle – missing array.');

        this.resetStandingTime?.();
    }

    /**
     * Stops all specific intervals associated with the character's movement and animation.
     * Clears the interval IDs and sets them to null.
     * Called by World.stopAllIntervals().
     * @method
     */
    stopCharacterIntervals() {
        // Clear movement interval
        if (this.moveIntervalId) {
            clearInterval(this.moveIntervalId);
            this.moveIntervalId = null;
        }

        // Clear animation interval
        if (this.animationIntervalId) {
            clearInterval(this.animationIntervalId);
            this.animationIntervalId = null;
        }
    }
}