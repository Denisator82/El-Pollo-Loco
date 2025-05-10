/**
 * Represents a throwable object in the game, like a bottle.
 * Inherits physical properties and drawing capabilities from MovableObject.
 * Handles its own movement, animation, and reaction to impacts (ground or target).
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /**
     * Indicates if the bottle has collided with a target (set by World class).
     * @property {boolean} isColliding - Defaults to false.
     */
    isColliding = false;

    /**
     * The horizontal direction the bottle is thrown.
     * 1 for right, -1 for left.
     * @property {number} direction - Defaults to 1.
     */
    direction = 1;

    /**
     * Flag indicating if the bottle has hit something and is playing the splash animation.
     * @property {boolean} isSplashed - Defaults to false.
     */
    isSplashed = false;

    /**
     * The Y-coordinate that represents the ground level for this object.
     * Inherited from MovableObject, but can be overridden if needed.
     * @property {number} groundLevel
     */
    // NOTE: This property can be set here if bottles have a different ground level
    // than other MovableObjects, otherwise it's inherited from MovableObject.
    groundLevel = 355; // Example: Set the ground level specifically for bottles


    /**
     * Array of image paths for the bottle rotation animation while in flight.
     * @property {string[]} IMAGES_ROTATION
     */
    IMAGES_ROTATION = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    /**
     * Array of image paths for the bottle splash animation upon impact.
     * @property {string[]} IMAGES_SPLASH
     */
    IMAGES_SPLASH = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /**
     * Stores the interval ID for horizontal movement updates.
     * @property {number|null} moveIntervalId
     */
    moveIntervalId = null;

    /**
     * Stores the interval ID for the main logic and animation loop.
     * This interval calls the update() method.
     * @property {number|null} logicIntervalId
     */
    logicIntervalId = null;


    /**
     * Initializes a new ThrowableObject instance.
     * Loads images, sets initial position, size, speed, and starts the throw process.
     * @constructor
     * @param {number} x - The initial x-coordinate of the bottle.
     * @param {number} y - The initial y-coordinate of the bottle.
     * @param {boolean} otherDirection - True if the bottle is thrown to the left, false for right.
     */
    constructor(x, y, otherDirection) {
        super(); // Call parent class constructor
        this.loadImage('img/img/6_salsa_bottle/salsa_bottle.png'); // Load initial standing image (or first rotation frame)
        this.loadImages(this.IMAGES_ROTATION); // Load rotation animation images
        this.loadImages(this.IMAGES_SPLASH); // Load splash animation images

        this.x = x; // Set initial X position
        this.y = y; // Set initial Y position
        this.height = 80; // Set object height (Example size)
        this.width = 80; // Set object width

        // Initial vertical speed (upward momentum for the throw arc)
        this.speedY = 20; // Adjust value as needed for desired arc

        // Acceleration due to gravity (inherited, but can be set here if different)
        // this.acceleration = 2.5; // Example, using value from MovableObject

        // Determine horizontal direction
        this.direction = otherDirection ? -1 : 1; // 1 for right, -1 for left
        this.speed = 10; // Horizontal movement speed (Example speed)

        // If bottles have a specific ground level different from MovableObject default, set it here:
        // this.groundLevel = 355; // Ensure this matches your game's ground Y coordinate

        this.throw(); // Start the throw process (gravity, movement, logic loop)
        // applyGravity() is called within throw()
        // The main logic/animation loop is started via interval within throw()
    }

    /**
     * Starts the bottle's horizontal movement and the main logic/animation interval loop.
     * Calls applyGravity to initiate the vertical movement (falling).
     * @method
     */
    throw() {
        // Start gravity simulation (for the parabolic arc)
        this.applyGravity(); // Inherited method from MovableObject

        // Start horizontal movement interval
        this.moveIntervalId = setInterval(() => {
            // Only move horizontally if the bottle hasn't splashed yet
            if (!this.isSplashed) {
               this.x += this.speed * this.direction; // Apply horizontal movement based on speed and direction
            }
        }, 1000 / 40); // Update frequency for horizontal position (e.g., ~40 FPS)

        // Start the main logic loop (collision checks, state updates, animation playing)
        // This interval calls the update() method on each tick
        this.logicIntervalId = setInterval(() => {
             this.update(); // Call the update method in each interval tick
        }, 1000 / 20); // Update frequency for logic and animation (e.g., 20 FPS)
    }

    /**
     * Updates the bottle's state, checks for ground or target hits, and plays the appropriate animation in each logic tick.
     * This method is called repeatedly by the logicIntervalId.
     * @method
     */
    update() {
        // Check for impact (ground or target collision) if the bottle hasn't already splashed
        // The condition checks:
        // 1. If the bottle has reached or passed the ground level AND is falling or stationary vertically (landed on ground).
        // 2. OR if the bottle's isColliding flag is set to true (set by World when it hits a target).
        if (!this.isSplashed && ((this.y >= this.groundLevel && this.speedY <= 0) || this.isColliding)) {
             // console.log(`LOG: Bottle detected hit. isColliding=${this.isColliding}, y=${this.y}, speedY=${this.speedY}, groundLevel=${this.groundLevel}`); // Optional Log

             // Differentiate between a target hit (enemy) and a ground hit
             if (this.isColliding) { // isColliding is set by World when hitting an object
                  this.onTargetHit(); // Handle hitting a target (enemy/Endboss)
             } else { // Not colliding with an object, but y is at/below ground and falling/stopped vertically
                  this.onGroundHit(); // Handle hitting the ground
             }
         }

         // Play animation based on the current state
         if (this.isSplashed) {
              // Play the splash animation sequence
              this.playAnimation(this.IMAGES_SPLASH);
         } else {
              // Play the rotation animation sequence while in flight
              this.playAnimation(this.IMAGES_ROTATION);
         }
    }


    /**
     * Handles the logic and actions when the bottle hits the ground.
     * Stops movement, sets splashed state, plays sound, and schedules removal from the game.
     * @method
     */
    onGroundHit() {
        // console.log('LOG: Bottle onGroundHit() called.'); // Optional Log
        this.isSplashed = true; // Set state to splashed
        this.speedY = 0; // Stop vertical movement immediately
        this.speed = 0; // Stop horizontal movement immediately
        this.y = this.groundLevel; // Ensure bottle is exactly at ground level (prevents sinking)

        this.stopThrowableObjectIntervals(); // Stop all active intervals (movement, logic, gravity)

        // Optional: Play sound for hitting the ground
        if (this.world && this.world.audioManager) { this.world.audioManager.playSound('bottleBroke'); } // Using 'bottleBroke' sound for ground splash

        // Schedule the removal of the bottle object from the game after the splash animation duration
        const splashDuration = 500; // Duration in milliseconds for the splash animation to play (Adjust as needed)
        setTimeout(() => {
            // Remove the bottle from the world's list of throwable objects
            // Assuming 'world' is a globally accessible variable or set as a property (e.g., in World.setWorld())
            if (typeof world !== 'undefined' && world && Array.isArray(world.throwableObjects)) {
                 const index = world.throwableObjects.indexOf(this);
                 if (index > -1) {
                     world.throwableObjects.splice(index, 1); // Remove the bottle from the array
                     // console.log('LOG: Bottle removed after ground hit splash timeout.'); // Optional Log
                 } else {
                      // console.warn('LOG: Bottle not found in world.throwableObjects list for removal after ground hit.'); // Optional Warning
                 }
            } else {
                 // console.warn('LOG: Could not access world or world.throwableObjects for bottle removal.'); // Optional Warning
            }
        }, splashDuration); // Removal happens after the specified duration
    }

    /**
     * Handles the logic and actions when the bottle hits a target (like an enemy or Endboss).
     * Stops movement, sets splashed state, plays sound, and schedules removal from the game.
     * This method is triggered when the World class sets the bottle's isColliding flag to true.
     * @method
     */
    onTargetHit() {
         // console.log('LOG: Bottle onTargetHit() called.'); // Optional Log
         this.isSplashed = true; // Set state to splashed
         this.speedY = 0; // Stop vertical movement immediately
         this.speed = 0; // Stop horizontal movement immediately
         // Adjust position slightly if needed for visual effect upon impact (optional)
         // this.x -= 10 * this.direction;


         this.stopThrowableObjectIntervals(); // Stop all active intervals (movement, logic, gravity)

         // Optional: Play sound for hitting a target (could be different from ground hit sound)
         // if (this.world && this.world.audioManager) { this.world.audioManager.playSound('bottle_hit'); }
         // Using the same 'bottleBroke' sound for target hit splash as ground splash
         if (this.world && this.world.audioManager) { this.world.audioManager.playSound('bottleBroke'); }


         // Schedule the removal of the bottle object from the game after the splash animation duration
         const splashDuration = 500; // Duration in milliseconds for the splash animation to play (Adjust as needed)
         setTimeout(() => {
             // Remove the bottle from the world's list of throwable objects
             // Assuming 'world' is a globally accessible variable or set as a property
             if (typeof world !== 'undefined' && world && Array.isArray(world.throwableObjects)) {
                 const index = world.throwableObjects.indexOf(this);
                 if (index > -1) {
                     world.throwableObjects.splice(index, 1); // Remove the bottle from the array
                      // console.log('LOG: Bottle removed after target hit splash timeout.'); // Optional Log
                 } else {
                      // console.warn('LOG: Bottle not found in world.throwableObjects list for removal after target hit.'); // Optional Warning
                 }
             } else {
                 // console.warn('LOG: Could not access world or world.throwableObjects for bottle removal after target hit.'); // Optional Warning
             }
         }, splashDuration); // Removal happens after the specified duration
     }


    /**
     * Stops all intervals and animation frames associated with the throwable object.
     * Includes horizontal movement, main logic loop, and inherited gravity.
     * This ensures the object stops moving and updating when it's removed or the game stops.
     * @method
     */
    stopThrowableObjectIntervals() {
         // console.log('LOG: stopThrowableObjectIntervals() called.'); // Optional Log
         if (this.moveIntervalId) clearInterval(this.moveIntervalId); // Stop horizontal movement interval
         if (this.logicIntervalId) clearInterval(this.logicIntervalId); // Stop main logic loop interval
         this.moveIntervalId = null; // Reset interval IDs
         this.logicIntervalId = null;
         super.stopGravity(); // <-- Stop the gravity animation frame loop (inherited from MovableObject)
         // console.log('ThrowableObject intervals stopped.'); // Optional Log
     }

    // The separate animate() method that previously existed is no longer needed.
    // Its logic is now integrated into the update() method, and playAnimation is called from there.

    // isAboveGround() method is inherited from MovableObject.
    // Its logic should check y < groundLevel or speedY > 0.
}