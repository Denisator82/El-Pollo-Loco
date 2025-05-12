/**
 * Represents a small chicken in the game.
 * Inherits from MovableObject and includes properties for dimensions, images, and offsets.
 */
class ChickenMini extends MovableObject {
  y = 360; // Y-coordinate of the chicken
  height = 60; // Height of the chicken
  width = 60; // Width of the chicken
  damage = 10;
  chickenIsDead = false; // Flag to check if the chicken is dead

  // Images for the walking state of the small chicken
  IMAGES_WALKING = [
      "img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
      "img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
      "img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  // Images for the dead state of the small chicken
  IMAGES_DEAD = ["img/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  moveIntervalId = null; // Speichert die ID des Bewegungsintervalls
  animationIntervalId = null; // Speichert die ID des Animationsintervalls

  /**
   * Initializes the ChickenMini class.
   * Loads the images for walking and dead states, sets the initial position and dimensions,
   * and starts the animation.
   */
  constructor() {
      super().loadImage(this.IMAGES_WALKING[0]); // Load the initial walking image
      this.loadImages(this.IMAGES_WALKING); // Load all walking images
      this.offset = { top: 0, right: 0, bottom: 0, left: 0 }; // Set the offset for collision detection

      // Set the initial x-coordinate randomly between 600 and 2400
      this.x = 600 + Math.random() * 1800;

      // Set the speed of the chicken randomly between 0.15 and 0.7
      this.speed = 0.15 + Math.random() * 0.55;

      this.animate(); // Start the animation
  }

  /**
     * Lets the mini-chicken move left if it is not dead.
     * <-- Füge diese Methode hier hinzu -->
     */
    moveChicken() {
         if (!this.chickenIsDead) { // <-- Stelle sicher, dass chickenIsDead in Chicken/ChickenMini existiert
            this.x -= this.speed;
        }
    }

  /**
   * Handles the animation of the chicken.
   * Switches between walking and dead animations depending on the chicken's state.
   */
  chickenAnimation() {
      if (!this.chickenIsDead) {
          this.chickenAnimationWalk(); // If the chicken is not dead, animate walking
      } else {
          this.chickenAnimationDead(); // If the chicken is dead, animate death
      }
  }

  /**
   * Animation for walking.
   * Plays the walking animation of the chicken.
   */
  chickenAnimationWalk() {
      this.playAnimation(this.IMAGES_WALKING); // Play the walking images in sequence
  }

  /**
   * Animation for death.
   * Switches to the dead image and plays the death sound once via the AudioManager.
   */
  chickenAnimationDead() {
      this.loadImage(this.IMAGES_DEAD); // Load the dead image
      if (
          this.musicCounter === 0 &&
          this.world &&
          this.world.audioManager &&
          !this.world.audioManager.isMuted
      ) {
          this.world.audioManager.playSound("chickenDead"); // Play the death sound once via AudioManager
      }
      this.musicCounter++; // Increment the counter to prevent sound from playing repeatedly
      setTimeout(() => {
          this.IMAGES_DEAD = []; // Clear the dead images after a short delay
      }, 500);
  }

  /**
   * Starts the animation for the chicken.
   * Moves the chicken and animates it at regular intervals.
   */
  animate() {
      // Move the chicken every 1/60th of a second (60 frames per second)
      this.moveIntervalId = setInterval(() => { // Speichere die ID
          this.moveChicken();
      }, 1000 / 60);

      // Run the chicken animation every 200 milliseconds
      this.animationIntervalId = setInterval(() => { // Speichere die ID
          this.chickenAnimation();
      }, 200);
  }

  /**
   * Stops all intervals associated with the small chicken.
   */
  stopChickenMiniIntervals() {
      clearInterval(this.moveIntervalId);
      clearInterval(this.animationIntervalId);
      this.moveIntervalId = null; // Zur Sicherheit die IDs zurücksetzen
      this.animationIntervalId = null;
      console.log('ChickenMini-Intervalle gestoppt.');
  }
}