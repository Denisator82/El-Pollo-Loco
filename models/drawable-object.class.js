/**
 * Represents a drawable object in the game.
 * Acts as a base class for all visual game entities.
 * Includes image handling, drawing, and collision box support.
 */
class DrawableObject {
  /**
   * The current image of the object.
   * @type {HTMLImageElement|undefined}
   */
  img;

  /**
   * Stores multiple images used for animation.
   * @type {Object<string, HTMLImageElement>}
   */
  imageCache = [];

  /**
   * The index of the currently displayed image.
   * @type {number}
   */
  currentImage = 0;

  /**
   * Horizontal position on the canvas.
   * @type {number}
   */
  x = 120;

  /**
   * Vertical position on the canvas.
   * @type {number}
   */
  y = 280;

  /**
   * Height of the object.
   * @type {number}
   */
  height = 150;

  /**
   * Width of the object.
   * @type {number}
   */
  width = 100;

  /**
   * Collision offset used for hitbox detection.
   * @type {{ top: number, right: number, bottom: number, left: number }}
   */
  offset = { top: 0, right: 0, bottom: 0, left: 0 };

  /**
   * Optional counter used for sound/music timing.
   * @type {number}
   */
  musicCounter = 0;

  /**
   * Loads a single image and assigns it to the object.
   * @param {string} path - The file path of the image.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws the original bounding box and the offset bounding box (hitbox) for debugging.
   * Only applies to known game entities.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof ChickenMini ||
      this instanceof Coin ||
      this instanceof Bottle ||
      this instanceof Endboss
    ) {
      // Original bounding box (blue)
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();

      // Offset bounding box (red)
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );
      ctx.stroke();
    }
  }

  /**
   * Loads multiple images and caches them for later use (e.g., animations).
   * @param {string[]} arr - An array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
