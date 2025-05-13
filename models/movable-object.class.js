/**
* Represents a movable object in the game.
* Inherits from DrawableObject and includes properties for speed, direction,
* vertical speed, acceleration, energy, and collision status.
*/
class MovableObject extends DrawableObject {
    speed = 0.55;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    standingTime = 0;
    sleepDelay = 6000;
    groundLevel = 175;
    gravityFrameId = null;

    /**
    * Constructor for MovableObject.
    * Sets default values or calls initialization methods.
    */
    constructor() {
        super();
    }


    /**
    * Simulates gravity by continuously adjusting the object's vertical position.
    * Uses requestAnimationFrame for smooth animation.
    * The loop continues as long as the object is above the ground or moving upwards.
    * 
    */
    applyGravity() {
        if (this.gravityFrameId !== null) {
            return;
        }

        const gravityEffect = () => {
            if (this.isAboveGround() || (this.y <= this.groundLevel && this.speedY > 0)) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                this.speedY = Math.max(this.speedY, -30);
                this.gravityFrameId = requestAnimationFrame(gravityEffect);
            } else {
                this.y = this.groundLevel;
                this.speedY = 0;
                this.stopGravity();
            }
        };

        // *** Start the initial loop and store the ID ***
        this.gravityFrameId = requestAnimationFrame(gravityEffect);
    }


    /**
    * Checks if the object is currently above the ground level.
    * This check is uniform for all MovableObjects subject to gravity.
    * @returns {boolean} - True if the object's bottom is above or at the ground level (considering speedY), otherwise false.
    * 
    */
    isAboveGround() {
        return this.y < this.groundLevel || this.speedY > 0;
    }

    /**
     * Checks if this object is colliding with another movable object, considering offsets.
     * Adds safety checks for missing offset properties.
     * @param {MovableObject} mo - The other movable object to check for collision.
     * @returns {boolean} - True if the objects' bounding boxes overlap, otherwise false.
     * 
     */
    isColliding(mo) {
        if (!this || !mo) {
            return false;
        }

        const thisOffset = this.offset || {};
        const otherOffset = mo.offset || {};

        const thisOffsetX = thisOffset.left || 0;
        const thisOffsetY = thisOffset.top || 0;
        const thisOffsetRight = thisOffset.right || 0;
        const thisOffsetBottom = thisOffset.bottom || 0;

        const otherOffsetX = otherOffset.left || 0;
        const otherOffsetY = otherOffset.top || 0;
        const otherOffsetRight = otherOffset.right || 0;
        const otherOffsetBottom = otherOffset.bottom || 0;

        // Kollisionslogik mit Berücksichtigung der Offsets und Sicherheitsprüfungen
        // Überlappung AABB (Axis-Aligned Bounding Box)
        const collision =
            this.x + this.width - thisOffsetRight > mo.x + otherOffsetX &&
            this.y + this.height - thisOffsetBottom > mo.y + otherOffsetY &&
            this.x + thisOffsetX < mo.x + mo.width - otherOffsetRight &&
            this.y + thisOffsetY < mo.y + mo.height - otherOffsetBottom;
        return collision;
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
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Stops the recursive requestAnimationFrame loop for gravity.
     */
    stopGravity() {
        if (this.gravityFrameId !== null) {
            cancelAnimationFrame(this.gravityFrameId);
            this.gravityFrameId = null;
        }
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    playAnimationOnce(images, callback) {
        let i = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[images[i]];
            i++;
            if (i >= images.length) {
            clearInterval(interval);
            if (typeof callback === 'function') {
                callback(); // z.B. gameWin()
            }
            }
        }, 120); // z. B. 120ms pro Frame
    }

}