/**
 * Represents a background object in the game, such as a layer in the parallax effect.
 * Inherits from {@link MovableObject}.
 */
class BackgroundObject extends MovableObject {
    /**
     * Width of the background object.
     * @type {number}
     */
    width = 720;

    /**
     * Height of the background object.
     * @type {number}
     */
    height = 480;

    /**
     * Creates a new background object at the specified horizontal position using a given image.
     * The y-coordinate is automatically calculated to align with the bottom of the screen.
     * 
     * @param {string} imagePath - The path to the image file.
     * @param {number} x - The initial x-coordinate of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}
