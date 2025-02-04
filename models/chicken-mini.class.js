/**
 * Represents a small chicken in the game.
 * Inherits from MovableObject and includes properties for dimensions, images, and offsets.
 */
class ChickenMini extends MovableObject {
    y = 360; // Y-coordinate of the chicken
    height = 60; // Height of the chicken
    width = 60; // Width of the chicken

    // Images for the walking state of the small chicken
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    // Images for the dead state of the small chicken
    IMAGES_DEAD = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Initializes the ChickenMini class.
     * Loads the images for walking and dead states, sets the initial position and dimensions,
     * and starts the animation.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); // Load the initial walking image
        this.loadImages(this.IMAGES_WALKING); // Load all walking images
        this.loadImages(this.IMAGES_DEAD); // Load all dead images
        this.offset = { top: 0, right: 0, bottom: 0, left: 0 }; // Set the offset for collision detection

        // Set the initial x-coordinate randomly between 600 and 2400
        this.x = 600 + Math.random() * 1800; 

        // Set the speed of the chicken randomly between 0.15 and 0.7
        this.speed = 0.15 + Math.random() * 0.55; 
        
        this.animate(); // Start the animation
    }

    /**
     * Animates the small chicken by moving it to the left and playing the walking animation.
     */
    animate() {
        // Move the chicken to the left at approximately 60 frames per second
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        
        // Play the walking animation at 5 frames per second
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}
