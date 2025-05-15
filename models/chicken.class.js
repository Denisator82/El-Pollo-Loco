/**
 * Represents a normal-sized enemy chicken in the game.
 * Inherits from {@link MovableObject}.
 */
class Chicken extends MovableObject {
  /**
   * Vertical position of the chicken.
   * @type {number}
   */
  y = 340;

  /**
   * Height of the chicken.
   * @type {number}
   */
  height = 80;

  /**
   * Width of the chicken.
   * @type {number}
   */
  width = 80;

  /**
   * Damage dealt by the chicken to the character.
   * @type {number}
   */
  damage = 10;

  /**
   * Whether the chicken is dead.
   * @type {boolean}
   */
  chickenIsDead = false;

  /**
   * Indicates if the death sound has already been played.
   * @type {boolean}
   */
  deathSoundPlayed = false;

  /**
   * Image paths for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Image path for the dead state.
   * @type {string[]}
   */
  IMAGES_DEAD = ["img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

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
   * Creates a new Chicken enemy.
   * Loads animations, sets position, speed and starts movement.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.offset = { top: 0, right: 0, bottom: 0, left: 0 };

    this.x = 400 + Math.random() * 2200;
    this.speed = 0.25 + Math.random() * 0.25;

    this.animate();
  }

  /**
   * Checks whether the chicken is dead.
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
   * Moves the chicken to the left if it's still alive.
   */
  moveChicken() {
    if (!this.chickenIsDead) {
      this.x -= this.speed;
    }
  }

  /**
   * Starts the animation and movement intervals for the chicken.
   */
  animate() {
    this.moveIntervalId = setInterval(() => {
      this.moveChicken();
    }, 1000 / 60);

    this.animationIntervalId = setInterval(() => {
      if (!this.chickenIsDead) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_DEAD);

        if (
          !this.deathSoundPlayed &&
          this.world?.audioManager &&
          !this.world.audioManager.isMuted
        ) {
          this.world.audioManager.playSound("chickenDead");
          this.deathSoundPlayed = true;
        }
      }
    }, 200);
  }

  /**
   * Stops the movement and animation intervals.
   */
  stopChickenIntervals() {
    clearInterval(this.moveIntervalId);
    clearInterval(this.animationIntervalId);
    this.moveIntervalId = null;
    this.animationIntervalId = null;
  }
}
