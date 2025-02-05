/**
 * Represents a bottle in the game.
 * Inherits from MovableObject and includes properties for dimensions, images, and offsets.
 */
class Bottle extends MovableObject {
    width = 80; // Width of the bottle
    height = 80; // Height of the bottle
    y = 350; // Y-coordinate of the bottle
    isThrow = false; 

    // Image paths for the bottle
    IMAGES = [
        'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];

    /**
     * Initializes the Bottle class.
     * Loads the image of the bottle, sets the initial position and dimensions,
     * and applies an offset for collision detection.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.offset = { top: 10, right: 15, bottom: 0, left: 20 }; // Example offset for collision detection
        this.x = 300 + Math.random() * 2200; // Random x-coordinate for bottle placement
    }
}