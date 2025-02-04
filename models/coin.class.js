/**
 * Represents a coin in the game.
 * Inherits from MovableObject and includes properties for dimensions, images, and collection status.
 */
class Coin extends MovableObject {
    width = 120; // Width of the coin
    height = 120; // Height of the coin
    collected = false; // Status of the coin (collected or not)

    // Images for the coin
    IMAGES = [
        'img/img_pollo_locco/img/8_coin/coin_1.png',
        'img/img_pollo_locco/img/8_coin/coin_2.png',
    ];

    /**
     * Initializes the Coin class.
     * Loads the images for the coin, sets the initial position and dimensions, 
     * and starts the animation.
     */
    constructor() {
        super(); // Call the parent class constructor
        this.loadImage(this.IMAGES[0]); // Load the first image
        this.loadImages(this.IMAGES); // Load all images into memory
        this.offset = { top: 40, right: 40, bottom: 40, left: 40 }; // Set the offset for collision detection
        this.x = 200 + Math.random() * 1800; // Set the initial x-coordinate randomly between 200 and 2000
        this.y = 160 + Math.random() * 120; // Set the initial y-coordinate randomly between 160 and 280
        this.animate(); // Start the animation
    };

    /**
     * Collects the coin and updates its status.
     * Sets the image to empty and reduces the width and height to 0 if collected.
     */
    coinCollected() {
        if (this.collected) {
            this.loadImage(''); // Load an empty image
            this.width = 0;
            this.height = 0;
        }
    }

    /**
     * Plays the coin animation if the coin is not collected.
     */
    coinAnimation() {
        if (!this.collected) {
            this.playAnimation(this.IMAGES); // Play the coin animation
        }
    }

    /**
     * Main animation loop for the coin.
     * Checks the collection status and plays the appropriate animation.
     */
    animate() {
        setInterval(() => {
            this.coinCollected(); // Check if the coin is collected
            this.coinAnimation(); // Play the coin animation
        }, 200); // Run at 5 frames per second
    }
}
