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
  offset = { top: 100, right: 30, bottom: 10, left: 20 };

  /**
   * Images for the standing state of the character
   */
  IMAGES_STANDING = [
    "img/img/2_character_pepe/1_idle/idle/I-1.png",
    "img/img/2_character_pepe/1_idle/idle/I-2.png",
    "img/img/2_character_pepe/1_idle/idle/I-3.png",
    "img/img/2_character_pepe/1_idle/idle/I-4.png",
    "img/img/2_character_pepe/1_idle/idle/I-5.png",
    "img/img/2_character_pepe/1_idle/idle/I-6.png",
    "img/img/2_character_pepe/1_idle/idle/I-7.png",
    "img/img/2_character_pepe/1_idle/idle/I-8.png",
    "img/img/2_character_pepe/1_idle/idle/I-9.png",
    "img/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Images for the sleeping state of the character
   */
  IMAGES_SLEEPING = [
    "img/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /**
   * Images for the walking state of the character
   */
  IMAGES_WALKING = [
    "img/img/2_character_pepe/2_walk/W-21.png",
    "img/img/2_character_pepe/2_walk/W-22.png",
    "img/img/2_character_pepe/2_walk/W-23.png",
    "img/img/2_character_pepe/2_walk/W-24.png",
    "img/img/2_character_pepe/2_walk/W-25.png",
    "img/img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Images for the jumping state of the character
   */
  IMAGES_JUMPING = [
    "img/img/2_character_pepe/3_jump/J-31.png",
    "img/img/2_character_pepe/3_jump/J-32.png",
    "img/img/2_character_pepe/3_jump/J-33.png",
    "img/img/2_character_pepe/3_jump/J-34.png",
    "img/img/2_character_pepe/3_jump/J-35.png",
    "img/img/2_character_pepe/3_jump/J-36.png",
    "img/img/2_character_pepe/3_jump/J-37.png",
    "img/img/2_character_pepe/3_jump/J-38.png",
    "img/img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Images for the dead state of the character
   */
  IMAGES_DEAD = [
    "img/img/2_character_pepe/5_dead/D-51.png",
    "img/img/2_character_pepe/5_dead/D-52.png",
    "img/img/2_character_pepe/5_dead/D-53.png",
    "img/img/2_character_pepe/5_dead/D-54.png",
    "img/img/2_character_pepe/5_dead/D-55.png",
    "img/img/2_character_pepe/5_dead/D-56.png",
    "img/img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Images for the hurt state of the character
   */
  IMAGES_HURT = [
    "img/img/2_character_pepe/4_hurt/H-41.png",
    "img/img/2_character_pepe/4_hurt/H-42.png",
    "img/img/2_character_pepe/4_hurt/H-43.png",
  ];

  moveIntervalId = null;
  animationIntervalId = null;

  /**
   * Initializes the character by loading assets, applying gravity, and starting animations.
   */
  constructor() {
    super();
    this.loadAssets();
    this.applyGravity();
    this.animateCharacter();
  }

  /**
   * Loads all image assets for character animations.
   */
  loadAssets() {
    this.loadImage(this.IMAGES_STANDING[0]);
    this.loadImages(this.IMAGES_STANDING);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
  }

  /**
   * Reduces the character's energy by the given amount and handles sound or death logic.
   * @param {number} damageAmount - The amount of damage to apply.
   */
  hit(damageAmount) {
    if (typeof damageAmount !== "number" || damageAmount < 0) damageAmount = 0;
    this.energy = Math.max(this.energy - damageAmount, 0);
    if (!this.isDead()) {
      this.lastHit = new Date().getTime();
      this.world?.audioManager?.playSound("hurt");
    } else {
      const walkSound = this.world?.audioManager?.sounds?.["walk"];
      if (walkSound) {
        walkSound.pause();
        walkSound.currentTime = 0;
      }
    }
  }

  /**
   * Checks if the character is currently in the 'hurt' state.
   * @returns {boolean} True if recently hit, otherwise false.
   */
  isHurt() {
    return (new Date().getTime() - this.lastHit) / 1000 < 1;
  }

  /**
   * Checks if the character is dead.
   * @returns {boolean} True if energy is 0, otherwise false.
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
   * Makes the character jump if conditions are met.
   */
  jump() {
    if (!this.world || this.world.gameOver) return;
    if (!this.isDead() && !this.isAboveGround() && justPressed.SPACE) {
      this.speedY = 8;
      this.applyGravity();
      this.world?.audioManager?.playSound("jump");
      this.resetStandingTime();
      justPressed.SPACE = false;
    }
  }

  /**
   * Checks if the character is jumping on an enemy.
   * @param {MovableObject} enemy - The enemy to check against.
   * @returns {boolean} True if jumping on the enemy.
   */
  isJumpingOn(enemy) {
    return (
      this.speedY < 0 && this.y + this.height <= enemy.y + enemy.height * 0.6
    );
  }

  /**
   * Starts movement and animation intervals for the character.
   */
  animateCharacter() {
    this.moveIntervalId = setInterval(() => {
      this.updateMovementAndSoundState();
      this.updateCamera();
    }, 1000 / 60);

    this.animationIntervalId = setInterval(() => {
      this.playAnimationBasedOnState();
    }, 100);
  }

  /**
   * Updates movement, jumping, and related sound effects per frame.
   */
  updateMovementAndSoundState() {
    let isMovingThisFrame = false;
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.resetStandingTime();
      isMovingThisFrame = true;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.resetStandingTime();
      isMovingThisFrame = true;
    }
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.resetStandingTime();
    }
    this.handleWalkingSound(isMovingThisFrame);
    this.wasMovingLastFrame = isMovingThisFrame;
  }

  /**
   * Manages walking sound based on movement state.
   * @param {boolean} isMovingThisFrame - Indicates if the character moved this frame.
   */
  handleWalkingSound(isMovingThisFrame) {
    if (this.isDead()) return;
    if (this.isAboveGround()) isMovingThisFrame = false;

    const am = this.world?.audioManager;
    const walkSound = am?.sounds?.["walk"];
    if (!am || am.isMuted || !walkSound) return;

    if (isMovingThisFrame && !this.wasMovingLastFrame) {
      walkSound.currentTime = 0;
      walkSound.play();
    } else if (!isMovingThisFrame && this.wasMovingLastFrame) {
      walkSound.pause();
      walkSound.currentTime = 0;
    }
  }

  /**
   * Updates the camera position based on character position.
   */
  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Plays the correct animation based on the character's state.
   */
  playAnimationBasedOnState() {
    if (this.isDead()) this.playAnimation(this.IMAGES_DEAD);
    else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
    else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
    else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      this.playAnimation(this.IMAGES_WALKING);
    else this.animateStanding();
    this.resetStandingTime();
  }

  /**
   * Plays the standing or sleeping animation depending on time idle.
   */
  animateStanding() {
    this.playAnimation(this.IMAGES_STANDING);
    this.standingTime += 65;
    if (this.standingTime >= this.sleepDelay)
      this.playAnimation(this.IMAGES_SLEEPING);
  }

  /**
   * Resets the standing time used for sleep animation.
   */
  resetStandingTime() {
    this.standingTime = 0;
  }

  /**
   * Collects a coin and updates the coin status bar.
   * @param {Object} coin - The collected coin object.
   */
  collectCoin(coin) {
    this.coinsCollected++;
    this.updateCoinsStatus();
    this.world?.audioManager?.playSound("coinCollected");
  }

  /**
   * Updates the coin status bar to reflect collected coins.
   */
  updateCoinsStatus() {
    const percent = (this.coinsCollected / 10) * 100;
    this.world?.statusBarCoin?.setPercentage(percent);
  }

  /**
   * Collects a bottle and updates the bottle status bar.
   * @param {Object} bottle - The collected bottle object.
   */
  collectBottle(bottle) {
    this.bottlesCollected++;
    this.updateBottleStatus();
    this.world?.audioManager?.playSound("bottleCollect");
  }

  /**
   * Updates the bottle status bar to reflect collected bottles.
   */
  updateBottleStatus() {
    const percent = (this.bottlesCollected / 10) * 100;
    this.world?.statusBarBottle?.setPercentage(percent);
  }

  /**
   * Throws a bottle in the given direction and adds it to the world.
   * @param {boolean} otherDirection - Indicates if the character is facing left.
   */
  throwBottle(otherDirection) {
    if (this.bottlesCollected <= 0) return;
    this.bottlesCollected--;
    this.updateBottleStatus();

    const offsetX = 30,
      offsetY = 20;
    const x = otherDirection ? this.x - offsetX : this.x + this.width - offsetX;
    const y = this.y + this.height / 2 - offsetY;
    const bottle = new ThrowableObject(this.world, x, y, otherDirection);

    this.world?.throwableObjects?.push(bottle) ||
      console.error("Could not add bottle.");

    this.resetStandingTime();
  }

  /**
   * Stops the movement and animation intervals.
   */
  stopCharacterIntervals() {
    if (this.moveIntervalId) clearInterval(this.moveIntervalId);
    if (this.animationIntervalId) clearInterval(this.animationIntervalId);
    this.moveIntervalId = null;
    this.animationIntervalId = null;
  }
}
