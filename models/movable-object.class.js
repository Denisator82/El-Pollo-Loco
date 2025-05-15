/**
 * Represents a movable object in the game world.
 * Handles movement, collision detection, gravity simulation, and animation logic.
 * Inherits from {@link DrawableObject}.
 */
class MovableObject extends DrawableObject {
  /**
   * Horizontal movement speed.
   * @type {number}
   */
  speed = 0.55;

  /**
   * Indicates if the object is facing left (true) or right (false).
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * Vertical speed (for jumping and falling).
   * @type {number}
   */
  speedY = 0;

  /**
   * Acceleration due to gravity.
   * @type {number}
   */
  acceleration = 0.3;

  /**
   * The health or energy level of the object.
   * @type {number}
   */
  energy = 100;

  /**
   * Timestamp of the last hit.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Tracks idle time to trigger sleep animations.
   * @type {number}
   */
  standingTime = 0;

  /**
   * Time (in ms) after which sleep animations begin.
   * @type {number}
   */
  sleepDelay = 6000;

  /**
   * Y-coordinate representing the ground level.
   * @type {number}
   */
  groundLevel = 175;

  /**
   * ID of the requestAnimationFrame used for gravity.
   * @type {number|null}
   */
  gravityFrameId = null;

  /**
   * Creates a new movable object and initializes the DrawableObject base.
   */
  constructor() {
    super();
  }

  /**
   * Starts gravity simulation using requestAnimationFrame.
   * Applies acceleration to simulate falling until ground contact.
   */
  applyGravity() {
    if (this.gravityFrameId !== null) return;

    const gravityEffect = () => {
      if (
        this.isAboveGround() ||
        (this.y <= this.groundLevel && this.speedY > 0)
      ) {
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
   * Checks whether the object is currently above ground.
   * @returns {boolean}
   */
  isAboveGround() {
    return this.y < this.groundLevel || this.speedY > 0;
  }

  /**
   * Checks if this object is colliding with another movable object.
   * Takes object offsets into account for precision.
   *
   * @param {MovableObject} mo - The other object to test collision against.
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
   * Plays an animation by cycling through a given array of image paths.
   * Loops continuously.
   *
   * @param {string[]} images - Array of image paths for the animation.
   */
  playAnimation(images) {
    const index = this.currentImage % images.length;
    this.img = this.imageCache[images[index]];
    this.currentImage++;
  }

  /**
   * Stops gravity simulation.
   * Cancels the current requestAnimationFrame if one is active.
   */
  stopGravity() {
    if (this.gravityFrameId !== null) {
      cancelAnimationFrame(this.gravityFrameId);
      this.gravityFrameId = null;
    }
  }

  /**
   * Moves the object one frame to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Moves the object one frame to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Plays an animation only once and calls the provided callback after completion.
   *
   * @param {string[]} images - Array of image paths for the animation.
   * @param {Function} [callback] - Optional callback to run after animation ends.
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
