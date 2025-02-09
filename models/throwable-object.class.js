/**
 * Represents a throwable object in the game.
 * Inherits from MovableObject and includes properties for collision detection.
 */
class ThrowableObject extends MovableObject {
    isColliding = false;
    

    // Array of image paths for the bottle rotation animation
    IMAGES_ROTATION = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    // Array of image paths for the bottle splash animation
    IMAGES_SPLASH = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /**
     * Initializes the SalsaBottle class.
     * Loads the image of the salsa bottle and its animations, 
     * sets the initial position and dimensions of the object, 
     * and starts the throw method.
     * 
     * @param {number} x - The initial x-coordinate of the object.
     * @param {number} y - The initial y-coordinate of the object.
     */
    constructor(x, y) {
        super().loadImage('img/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
        this.throw();
        this.animate();
    }
    
    /**
     * Throws the object by setting its initial vertical speed and applying gravity.
     * Updates the horizontal position at regular intervals to simulate the throw movement.
     */
    throw() {
        this.speedY = 20;
        if (!this.isColliding) {
            this.applyGravity();
            setInterval(() => {
                this.x += 10;
            }, 25);   
        }       
        setInterval(() => {
            this.animate();
        }, 100);
    }

    /**
     * Animates the bottle.
     * If the bottle is above ground and not colliding, plays the rotation animation.
     * Otherwise, plays the splash animation.
     */
    animate() {
        if (this.isAboveGround() && !this.isColliding) {
            this.playAnimation(this.IMAGES_ROTATION);
        } else {
            this.playAnimation(this.IMAGES_SPLASH);
        }
    } 
}
