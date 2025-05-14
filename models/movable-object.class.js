/**
 * Represents a movable object in the game.
 * Handles movement, collision detection, gravity, and animation.
 * Inherits from DrawableObject.
 */
class MovableObject extends DrawableObject {
  speed = 0.55;
  otherDirection = false;
  speedY = 0;
  acceleration = 0.3;
  energy = 100;
  lastHit = 0;
  standingTime = 0;
  sleepDelay = 6000;
  groundLevel = 175;
  gravityFrameId = null;

  constructor() {
    super();
  }

  /**
   * Applies gravity to the object using requestAnimationFrame.
   * Simulates falling until ground level is reached.
   */
  applyGravity() {
    if (this.gravityFrameId !== null) return;

    const gravityEffect = () => {
      if (this.isAboveGround() || (this.y <= this.groundLevel && this.speedY > 0)) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.speedY = Math.max(this.speedY, -30);
        this.gravityFrameId = requestAnimationFrame(gravityEffect);
      } else {
        this.y = this.groundLevel;
        this.speedY = 0;
        this.stopGravity();
      }
    };

    this.gravityFrameId = requestAnimationFrame(gravityEffect);
  }

  /**
   * Returns whether the object is currently above ground.
   * @returns {boolean}
   */
  isAboveGround() {
    return this.y < this.groundLevel || this.speedY > 0;
  }

  /**
   * Determines collision with another object, factoring in offsets.
   * @param {MovableObject} mo - The other object to check against.
   * @returns {boolean}
   */
  isColliding(mo) {
    if (!this || !mo) return false;

    const a = this.offset || {};
    const b = mo.offset || {};

    return (
      this.x + this.width - (a.right || 0) > mo.x + (b.left || 0) &&
      this.y + this.height - (a.bottom || 0) > mo.y + (b.top || 0) &&
      this.x + (a.left || 0) < mo.x + mo.width - (b.right || 0) &&
      this.y + (a.top || 0) < mo.y + mo.height - (b.bottom || 0)
    );
  }

  /**
   * Loops through image frames for a repeating animation.
   * @param {string[]} images
   */
  playAnimation(images) {
    const index = this.currentImage % images.length;
    this.img = this.imageCache[images[index]];
    this.currentImage++;
  }

  /**
   * Cancels any active gravity effect.
   */
  stopGravity() {
    if (this.gravityFrameId !== null) {
      cancelAnimationFrame(this.gravityFrameId);
      this.gravityFrameId = null;
    }
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Plays animation frames once and executes callback after completion.
   * @param {string[]} images
   * @param {Function} [callback]
   */
  playAnimationOnce(images, callback) {
    let i = 0;
    const interval = setInterval(() => {
      this.img = this.imageCache[images[i]];
      i++;
      if (i >= images.length) {
        clearInterval(interval);
        callback?.();
      }
    }, 120);
  }
}
