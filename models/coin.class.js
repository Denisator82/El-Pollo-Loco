/**
 * Represents a coin collectible in the game.
 * Inherits from {@link MovableObject} and includes dimensions, animation, and collection logic.
 */
class Coin extends MovableObject {
  /**
   * Width of the coin.
   * @type {number}
   */
  width = 120;

  /**
   * Height of the coin.
   * @type {number}
   */
  height = 120;

  /**
   * Indicates whether the coin has been collected.
   * @type {boolean}
   */
  collected = false;

  /**
   * Array of image paths used for the coin animation.
   * @type {string[]}
   */
  IMAGES = ["img/img/8_coin/coin_1.png", "img/img/8_coin/coin_2.png"];

  /**
   * ID of the animation interval.
   * @type {number|null}
   */
  animationIntervalId = null;

  /**
   * Creates a new Coin object.
   * Loads images, sets position and offset, and starts the animation.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.offset = { top: 40, right: 40, bottom: 40, left: 40 };
    this.x = 200 + Math.random() * 1800;
    this.y = 160 + Math.random() * 120;
    this.animate();
  }

  /**
   * Handles logic for when the coin has been collected.
   * Empties the image and hides it by setting width/height to 0.
   */
  coinCollected() {
    if (this.collected) {
      this.loadImage("");
      this.width = 0;
      this.height = 0;
    }
  }

  /**
   * Plays the coin animation if the coin has not yet been collected.
   */
  coinAnimation() {
    if (!this.collected) {
      this.playAnimation(this.IMAGES);
    }
  }

  /**
   * Starts the coin's animation loop.
   * Checks collection state and updates animation accordingly.
   */
  animate() {
    this.animationIntervalId = setInterval(() => {
      this.coinCollected();
      this.coinAnimation();
    }, 200);
  }

  /**
   * Stops the coin's animation interval.
   */
  stopCoinIntervals() {
    clearInterval(this.animationIntervalId);
    this.animationIntervalId = null;
    console.log("Coin intervals stopped.");
  }
}
