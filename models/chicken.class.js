/**
 * Represents a normal chicken in the game.
 * Inherits from MovableObject and includes properties for dimensions, images, and offsets.
 */
class Chicken extends MovableObject {
    y = 340; // Y-coordinate of the chicken
    height = 80; // Height of the chicken
    width = 80; // Width of the chicken
    chickenIsDead = false;

    // Images for the walking state of the normal chicken
    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    // Images for the dead state of the normal chicken
    IMAGES_DEAD = [
        'img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    moveIntervalId = null; // Speichert die ID des Bewegungsintervalls
    animationIntervalId = null; // Speichert die ID des Animationsintervalls

    /**
     * Initializes the Chicken class.
     * Loads the images for walking and dead states, sets the initial position and dimensions,
     * and starts the animation.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); // Load the initial walking image
        this.loadImages(this.IMAGES_WALKING); // Load all walking images
        this.loadImages(this.IMAGES_DEAD); // Load all dead images
        this.offset = { top: 0, right: 0, bottom: 0, left: 0 }; // Set the offset for collision detection

        // Set the initial x-coordinate randomly between 400 and 2600
        this.x = 400 + Math.random() * 2200;

        // Set the speed of the chicken randomly between 0.25 and 0.5
        this.speed = 0.25 + Math.random() * 0.25;

        this.animate(); // Start the animation
    }

    animate() {
        // Move the chicken to the left at approximately 60 frames per second
        this.moveIntervalId = setInterval(() => { // Speichere die ID
            this.moveChicken();
        }, 1000 / 60);

        // Play the walking animation at 5 frames per second
        this.animationIntervalId = setInterval(() => { // Speichere die ID
            if (!this.chickenIsDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
            else {
                this.loadImage(this.IMAGES_DEAD);
                if (this.musicCounter === 0 && this.world && this.world.audioManager && !this.world.audioManager.isMuted) {
                    this.world.audioManager.playSound('chickenDead');
                }
                this.musicCounter++;
                setTimeout(() => {
                    this.IMAGES_DEAD = [];
                }, 500);
            }
        }, 200);
    }

    /**
     * Stops all intervals associated with the normal chicken.
     */
    stopChickenIntervals() {
        clearInterval(this.moveIntervalId);
        clearInterval(this.animationIntervalId);
        this.moveIntervalId = null; // Zur Sicherheit die IDs zurücksetzen
        this.animationIntervalId = null;
        console.log('Chicken-Intervalle gestoppt.');
    }
}