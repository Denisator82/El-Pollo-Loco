/**
 * Represents a throwable object (e.g. bottle) in the game.
 * Inherits from {@link MovableObject}.
 * Handles throwing logic, gravity, collision, splash effects, and removal.
 */
class ThrowableObject extends MovableObject {
  /**
   * Reference to the current game world.
   * @type {World}
   */
  world;

  /**
   * Amount of damage this object causes upon hitting an enemy.
   * @type {number}
   */
  damage = 20;

  /**
   * Indicates if the object is currently colliding with another object.
   * @type {boolean}
   */
  isColliding = false;

  /**
   * Direction of the throw: 1 = right, -1 = left.
   * @type {number}
   */
  direction = 1;

  /**
   * Indicates if the object has splashed (hit the ground or target).
   * @type {boolean}
   */
  isSplashed = false;

  /**
   * The Y-position representing ground level for collision detection.
   * @type {number}
   */
  groundLevel = 355;

  /**
   * Image paths used for the rotation animation while flying.
   * @type {string[]}
   */
  IMAGES_ROTATION = [
    "img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Image paths used for the splash animation after hitting.
   * @type {string[]}
   */
  IMAGES_SPLASH = [
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Interval ID for horizontal movement.
   * @type {number|null}
   */
  moveIntervalId = null;

  /**
   * Interval ID for update and animation logic.
   * @type {number|null}
   */
  logicIntervalId = null;

  /**
   * Creates a new throwable object and starts the throw.
   *
   * @param {World} world - The game world reference.
   * @param {number} x - Initial x-coordinate.
   * @param {number} y - Initial y-coordinate.
   * @param {boolean} otherDirection - Whether it should be thrown to the left.
   */
  constructor(world, x, y, otherDirection) {
    super();
    this.world = world;

    this.loadImage("img/img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);

    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 80;
    this.speedY = 7;
    this.speed = 7;
    this.direction = otherDirection ? -1 : 1;

    this.throw();
  }

  /**
   * Starts the throw logic: gravity, horizontal movement and update loop.
   */
  throw() {
    this.applyGravity();

    this.moveIntervalId = setInterval(() => {
      if (!this.isSplashed) {
        this.x += this.speed * this.direction;
      }
    }, 1000 / 40);

    this.logicIntervalId = setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  /**
   * Updates position and animation. Handles collision logic and splash triggering.
   */
  update() {
    if (
      !this.isSplashed &&
      ((this.y >= this.groundLevel && this.speedY <= 0) || this.isColliding)
    ) {
      this.isColliding ? this.onTargetHit() : this.onGroundHit();
    }

    const animation = this.isSplashed
      ? this.IMAGES_SPLASH
      : this.IMAGES_ROTATION;
    this.playAnimation(animation);
  }

  /**
   * Handles logic when the object hits the ground.
   */
  onGroundHit() {
    this._splash();
    this.y = this.groundLevel;
    this._scheduleRemoval();
  }

  /**
   * Handles logic when the object hits a target.
   */
  onTargetHit() {
    this._splash();
    this._scheduleRemoval();
  }

  /**
   * Triggers the splash effect, stops movement and gravity, and plays sound.
   * Used by both target and ground hit.
   * @private
   */
  _splash() {
    this.isSplashed = true;
    this.speed = 0;
    this.speedY = 0;
    super.stopGravity();

    this.world?.audioManager?.playSound?.("bottle_hit");
  }

  /**
   * Schedules the object to be removed from the game after a short delay.
   * @private
   */
  _scheduleRemoval() {
    setTimeout(() => {
      this.stopThrowableObjectIntervals();
      const index = this.world?.throwableObjects?.indexOf(this);
      if (index > -1) {
        this.world.throwableObjects.splice(index, 1);
      }
    }, 500);
  }

  /**
   * Stops all active intervals and gravity for the throwable object.
   */
  stopThrowableObjectIntervals() {
    clearInterval(this.moveIntervalId);
    clearInterval(this.logicIntervalId);
    this.moveIntervalId = null;
    this.logicIntervalId = null;
    super.stopGravity();
  }
}
