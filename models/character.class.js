/**
 * Represents the main character in the game.
 * Inherits from MovableObject.
 */
class Character extends MovableObject {
    y = 180;
    height = 250;
    width = 120;
    speed = 5;
    coinsCollected = 0;
    bottlesCollected = 0;
    wasMovingLastFrame = false;
    world;
    offset = { top: 80, left: 20, right: 20, bottom: 0 };

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

    moveIntervalId = null;
    animationIntervalId = null;

    /**
     * Initializes the character with assets and behavior.
     */
    constructor() {
        super();
        this.loadAssets();
        this.offset = { top: 100, right: 30, bottom: 10, left: 20 };
        this.applyGravity();
        this.animateCharacter();
    }

    /** Loads all necessary animation images for the character. */
    loadAssets() {
        this.loadImage(this.IMAGES_STANDING[0]);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
    }

    /** Applies damage to the character. */
    hit(damageAmount) {
        if (typeof damageAmount !== 'number' || damageAmount < 0) damageAmount = 0;
        this.energy = Math.max(this.energy - damageAmount, 0);
        if (!this.isDead()) {
            this.lastHit = new Date().getTime();
            this.world?.audioManager?.playSound('hurt');
        } else {
            const walkSound = this.world?.audioManager?.sounds?.['walk'];
            if (walkSound) {
                walkSound.pause();
                walkSound.currentTime = 0;
            }
        }
    }

    isHurt() {
        return (new Date().getTime() - this.lastHit) / 1000 < 1;
    }

    isDead() {
        return this.energy === 0;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

jump() {
    if (!this.world || this.world.gameOver) return; // ⬅️ ganz oben

    if (!this.isDead() && !this.isAboveGround() && justPressed.SPACE) {
        console.log("JUMP!", this.y, this.isAboveGround(), this.world);
        this.speedY = 8;
        this.applyGravity();
        this.world?.audioManager?.playSound?.('jump');
        this.resetStandingTime();
        justPressed.SPACE = false;
    }
}

/**
 * Checks if the character is falling down onto an enemy (from above).
 * @param {MovableObject} enemy - The enemy object.
 * @returns {boolean}
 */
isJumpingOn(enemy) {
    return (
        this.speedY < 0 &&
        this.y + this.height <= enemy.y + enemy.height * 0.6
    );
}



    animateCharacter() {
        this.moveIntervalId = setInterval(() => {
            this._updateMovementAndSoundState();
            this._updateCamera();
        }, 1000 / 60);

        this.animationIntervalId = setInterval(() => {
            this._playAnimationBasedOnState();
        }, 100);
    }

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

    _handleWalkingSound(isMovingThisFrame) {
        if (this.isDead()) return;
        if (this.isAboveGround()) isMovingThisFrame = false; // ← NEU

        const am = this.world?.audioManager;
        const walkSound = am?.sounds?.['walk'];
        if (!am || am.isMuted || !walkSound) return;

        if (isMovingThisFrame && !this.wasMovingLastFrame) {
            walkSound.currentTime = 0;
            walkSound.play();
        } else if (!isMovingThisFrame && this.wasMovingLastFrame) {
            walkSound.pause();
            walkSound.currentTime = 0;
        }
    }

    _updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    _playAnimationBasedOnState() {
        if (this.isDead()) this.playAnimation(this.IMAGES_DEAD);
        else if (this.isHurt?.()) this.playAnimation(this.IMAGES_HURT);
        else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
            this.playAnimation(this.IMAGES_WALKING);
        else this.animateStanding();
        this.resetStandingTime();
    }

    animateStanding() {
        this.playAnimation(this.IMAGES_STANDING);
        this.standingTime += 65;
        if (this.standingTime >= this.sleepDelay) this.playAnimation(this.IMAGES_SLEEPING);
    }

    resetStandingTime() {
        this.standingTime = 0;
    }

    collectCoin(coin) {
        this.coinsCollected++;
        this.world?.audioManager?.playSound('coinCollected');
    }

    collectBottle(bottle) {
        this.bottlesCollected++;
        this.updateBottleStatus();
        this.world?.audioManager?.playSound('bottleCollect');
    }

    updateBottleStatus() {
        const percent = (this.bottlesCollected / 8) * 100;
        this.world?.statusBarBottle?.setPercentage(percent);
    }

    throwBottle(otherDirection) {
        if (this.bottlesCollected <= 0) return;
        this.bottlesCollected--;
        this.updateBottleStatus();

        const offsetX = 30, offsetY = 20;
        const x = otherDirection ? this.x - offsetX : this.x + this.width - offsetX;
        const y = this.y + this.height / 2 - offsetY;
        const bottle = new ThrowableObject(this.world, x, y, otherDirection);

        this.world?.throwableObjects?.push(bottle) ||
            console.error('Could not add bottle.');

        this.resetStandingTime();
    }

    stopCharacterIntervals() {
        if (this.moveIntervalId) clearInterval(this.moveIntervalId);
        if (this.animationIntervalId) clearInterval(this.animationIntervalId);
        this.moveIntervalId = null;
        this.animationIntervalId = null;
    }
}
