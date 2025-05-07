/**
 * Represents a movable object in the game.
 * Inherits from DrawableObject and includes properties for speed, direction, 
 * vertical speed, acceleration, energy, and collision status.
 */
class MovableObject extends DrawableObject {
    speed = 0.55; // Horizontal movement speed
    otherDirection = false; // Indicates if the object is moving in the opposite direction
    speedY = 1; // Vertical speed for jumping or falling
    acceleration = 1.0; // Acceleration for gravity
    energy = 100; // Energy level of the object
    lastHit = 0; // Timestamp of the last hit
    standingTime = 0; // Time the object has been standing still
    sleepDelay = 6000; // Delay before the object goes to sleep
    groundLevel = 175; // Y-coordinate for the ground level

    /**
     * Simulates gravity by continuously adjusting the object's vertical position.
     * The object falls downward as long as it is above the ground or has remaining vertical speed.
     * The fall speed is limited to prevent excessive acceleration.
     * Once the object reaches the ground, its position is set precisely to avoid floating point inaccuracies.
     * Uses requestAnimationFrame for smooth animation.
     */
    applyGravity() {
        const gravityEffect = () => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY = Math.max(this.speedY - this.acceleration, -20); // Limit fall speed
            } else {
                this.speedY = 0; 
                this.y = Math.round(this.groundLevel); // Ensure precise ground position
            }
            requestAnimationFrame(gravityEffect);
        };
        gravityEffect();
    }


    /**
     * Checks if the object is above the ground level.
     * If the object is an instance of ThrowableObject, always returns true.
     * Otherwise, returns true if the object's y-position is less than the ground level.
     * 
     * @returns {boolean} - True if the object is above the ground, otherwise false.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < this.groundLevel; // groundLevel könnte eine definierte Konstante sein
    }

    /**
     * Checks if the character is colliding with another movable object, considering offsets.
     *
     * @param {MovableObject} mo - The other movable object to check for collision.
     * @returns {boolean} - True if the objects are colliding, otherwise false.
     */
    isColliding(mo) {
        let thisOffsetX = 0;
        let thisOffsetY = 0;
        let thisOffsetRight = 0;
        let thisOffsetBottom = 0;

        let otherOffsetX = 0;
        let otherOffsetY = 0;
        let otherOffsetRight = 0;
        let otherOffsetBottom = 0;

        if (this.offset) {
            thisOffsetX = this.offset.left || 0;
            thisOffsetY = this.offset.top || 0;
            thisOffsetRight = this.offset.right || 0;
            thisOffsetBottom = this.offset.bottom || 0;
        }

        if (mo.offset) {
            otherOffsetX = mo.offset.left || 0;
            otherOffsetY = mo.offset.top || 0;
            otherOffsetRight = mo.offset.right || 0;
            otherOffsetBottom = mo.offset.bottom || 0;
        }

        return this.x + this.width - thisOffsetRight > mo.x + otherOffsetX &&
               this.y + this.height - thisOffsetBottom > mo.y + otherOffsetY &&
               this.x + thisOffsetX < mo.x + mo.width - otherOffsetRight &&
               this.y + thisOffsetY < mo.y + mo.height - otherOffsetBottom;
    }


    /**
     * Plays the animation by cycling through a list of images.
     * Calculates the index of the current image using the modulus operator.
     * Sets the current image based on the calculated index and updates the image cache.
     * Increments the current image index for the next animation frame.
     * 
     * @param {Array} images - An array of image paths to be used in the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 7 % 6; => 1, Rest 1
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * let the chickens move left
     * 
     */
    moveChicken() {
    if (!this.chickenIsDead) {
        this.x -= this.speed;
        }
    }

    moveLeft() {
        this.x -= this.speed;
    }
}