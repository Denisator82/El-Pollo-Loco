/**
 * Represents a cloud in the game.
 * Inherits from MovableObject and includes properties for dimensions and position.
 */
class Cloud extends MovableObject {
    y = 20; // Y-coordinate of the cloud
    width = 500; // Width of the cloud
    height = 250; // Height of the cloud
    
    /**
     * Initializes the Cloud class.
     * Loads the image of the cloud, sets the initial position, 
     * and starts the animation to move the cloud.
     */
    constructor() {
        super().loadImage('img/img/5_background/layers/4_clouds/1.png'); // Load the image for the cloud
        this.x = 220 + Math.random() * 2500; // Set the initial x-coordinate randomly between 220 and 2720
        this.animate(); // Start the animation
    }

    /**
     * Animates the cloud by moving it to the left continuously.
     */
    animate() {
        // Move the cloud to the left at approximately 60 frames per second
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
