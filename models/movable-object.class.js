/**
 * Represents a movable object in the game.
 * Inherits from DrawableObject and includes properties for speed, direction, 
 * vertical speed, acceleration, energy, and collision status.
 */
class MovableObject extends DrawableObject {
    speed = 0.55; // Horizontal movement speed
    otherDirection = false; // Indicates if the object is moving in the opposite direction
    speedY = 5; // Vertical speed for jumping or falling
    acceleration = 3.0; // Acceleration for gravity
    energy = 100; // Energy level of the object
    lastHit = 0; // Timestamp of the last hit
    standingTime = 0; // Time the object has been standing still
    sleepDelay = 6000; // Delay before the object goes to sleep
    groundLevel = 175; // Y-coordinate for the ground level

    /**
     * Applies gravity to the object by continuously adjusting its vertical position.
     * Creates a gravity effect that decreases the y-position and vertical speed
     * until the object is on the ground. Uses requestAnimationFrame for smooth animation.
     */
    applyGravity() {
        const gravityEffect = () => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0; // reset the vertical speed when the character is on the ground
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
     * Checks if the character is colliding with another movable object.
     * Uses the offset values to determine if the bounding boxes of the two objects overlap.
     * 
     * @param {MovableObject} mo - The other movable object to check for collision.
     * @returns {boolean} - True if the character is colliding with the object, otherwise false.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
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
}