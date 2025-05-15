/**
 * Represents a cloud in the game background.
 * Inherits from {@link MovableObject} and includes properties for size, position, and animation.
 */
class Cloud extends MovableObject {
  /**
   * Vertical position of the cloud.
   * @type {number}
   */
  y = 20;

  /**
   * Width of the cloud image.
   * @type {number}
   */
  width = 500;

  /**
   * Height of the cloud image.
   * @type {number}
   */
  height = 250;

  /**
   * ID of the interval used to move the cloud.
   * @type {number|null}
   */
  moveIntervalId = null;

  /**
   * Creates a new Cloud object at a random horizontal position.
   * Loads the cloud image and starts the movement animation.
   */
  constructor() {
    super().loadImage("img/img/5_background/layers/4_clouds/1.png");
    this.x = 220 + Math.random() * 2500;
    this.animate();
  }

  /**
   * Starts animating the cloud by moving it continuously to the left.
   * Runs at approximately 60 frames per second.
   */
  animate() {
    this.moveIntervalId = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Stops the movement animation of the cloud.
   * Clears the interval and resets its ID.
   */
  stopCloudIntervals() {
    clearInterval(this.moveIntervalId);
    this.moveIntervalId = null;
    console.log("Cloud intervals stopped.");
  }
}
