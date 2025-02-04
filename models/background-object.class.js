/**
 * Represents a background object in the game.
 * Inherits from MovableObject and sets default dimensions for width and height.
 */
class BackgroundObject extends MovableObject {
    width = 720; // Width of the background object
    height = 480; // Height of the background object

    /**
     * Initializes an object with the specified image path and x-coordinate.
     * Loads the image using the provided path and sets the initial x and y positions.
     * The y-coordinate is calculated to position the object based on its height.
     * 
     * @param {string} imagePath - The path to the image file.
     * @param {number} x - The initial x-coordinate of the object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}