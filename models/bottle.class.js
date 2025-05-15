/**
 * Represents a bottle collectible or throwable object in the game.
 * Inherits from {@link MovableObject}.
 */
class Bottle extends MovableObject {
  /**
   * Width of the bottle.
   * @type {number}
   */
  width = 80;

  /**
   * Height of the bottle.
   * @type {number}
   */
  height = 80;

  /**
   * Vertical position of the bottle.
   * @type {number}
   */
  y = 350;

  /**
   * Indicates if the bottle has been thrown.
   * @type {boolean}
   */
  isThrow = false;

  /**
   * Image paths used for the bottle.
   * @type {string[]}
   */
  IMAGES = ["img/img/6_salsa_bottle/1_salsa_bottle_on_ground.png"];

  /**
   * Creates a new Bottle object at a random x-position.
   * Loads image assets and defines a collision offset.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.offset = { top: 10, right: 15, bottom: 0, left: 20 };
    this.x = 300 + Math.random() * 2200;
  }
}
