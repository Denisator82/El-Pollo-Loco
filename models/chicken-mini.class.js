/**
 * Represents a small enemy chicken in the game.
 * Inherits from {@link MovableObject}.
 */
class ChickenMini extends MovableObject {
  /**
   * Vertical position of the chicken.
   * @type {number}
   */
  y = 360;

  /**
   * Height of the chicken.
   * @type {number}
   */
  height = 60;

  /**
   * Width of the chicken.
   * @type {number}
   */
  width = 60;

  /**
   * Damage dealt by the chicken to the character.
   * @type {number}
   */
  damage = 20;

  /**
   * Whether the chicken is dead.
   * @type {boolean}
   */
  chickenIsDead = false;

  /**
   * Tracks if the death sound was already played.
   * @type {boolean}
   */
  deathSoundPlayed = false;

  /**
   * Walking animation images.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Death animation image.
   * @type {string[]}
   */
  IMAGES_DEAD = ["img/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * ID of the movement interval.
   * @type {number|null}
   */
  moveIntervalId = null;

  /**
   * ID of the animation interval.
   * @type {number|null}
   */
  animationIntervalId = null;

  /**
   * Creates a new small chicken enemy.
   * Initializes animations, position, speed, and collision offset.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.offset = { top: 0, right: 0, bottom: 0, left: 0 };
    this.x = 600 + Math.random() * 1800;
    this.speed = 0.15 + Math.random() * 0.55;

    this.animate();
  }

  /**
   * Returns whether the chicken is dead.
   * @returns {boolean}
   */
  isDead() {
    return this.chickenIsDead;
  }

  /**
   * Marks the chicken as dead.
   */
  setDead() {
    this.chickenIsDead = true;
  }

  /**
   * Moves the chicken to the left if not dead.
   */
  moveChicken() {
    if (!this.chickenIsDead) {
      this.x -= this.speed;
    }
  }

  /**
   * Plays the appropriate animation depending on chicken state.
   */
  chickenAnimation() {
    if (!this.chickenIsDead) {
      this.chickenAnimationWalk();
    } else {
      this.chickenAnimationDead();
    }
  }

  /**
   * Plays the walking animation.
   */
  chickenAnimationWalk() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Plays the death animation and sound.
   * Removes death image after a delay.
   */
  chickenAnimationDead() {
    this.playAnimation(this.IMAGES_DEAD);

    if (
      !this.deathSoundPlayed &&
      this.world?.audioManager &&
      !this.world.audioManager.isMuted
    ) {
      this.world.audioManager.playSound("chickenDead");
      this.deathSoundPlayed = true;
    }

    setTimeout(() => {
      this.IMAGES_DEAD = [];
    }, 500);
  }

  /**
   * Starts movement and animation intervals.
   */
  animate() {
    this.moveIntervalId = setInterval(() => {
      this.moveChicken();
    }, 1000 / 60);

    this.animationIntervalId = setInterval(() => {
      this.chickenAnimation();
    }, 200);
  }

  /**
   * Stops movement and animation intervals.
   */
  stopChickenMiniIntervals() {
    clearInterval(this.moveIntervalId);
    clearInterval(this.animationIntervalId);
    this.moveIntervalId = null;
    this.animationIntervalId = null;
  }
}
