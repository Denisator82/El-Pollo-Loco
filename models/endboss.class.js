/**
 * Represents the Endboss in the game.
 * Inherits from MovableObject and handles movement, damage, and state.
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  speed = 2;
  health = 100;
  damage = 40;
  visible = false;
  hadFirstContact = false;
  i = 0; // Animation frame/state index

  world; // Reference to the game world

  animationIntervalId = null;
  movementIntervalId = null;
  firstContactIntervalId = null;

  offset = { top: 80, left: 40, right: 40, bottom: 20 };

  // Animation image arrays (used in different states)
  IMAGES_ALERT = [ 'img/img/4_enemie_boss_chicken/2_alert/G5.png', 'img/img/4_enemie_boss_chicken/2_alert/G6.png', 'img/img/4_enemie_boss_chicken/2_alert/G7.png', 'img/img/4_enemie_boss_chicken/2_alert/G8.png', 'img/img/4_enemie_boss_chicken/2_alert/G9.png', 'img/img/4_enemie_boss_chicken/2_alert/G10.png', 'img/img/4_enemie_boss_chicken/2_alert/G11.png', 'img/img/4_enemie_boss_chicken/2_alert/G12.png' ];

  IMAGES_WALKING = [ 'img/img/4_enemie_boss_chicken/1_walk/G1.png', 'img/img/4_enemie_boss_chicken/1_walk/G2.png', 'img/img/4_enemie_boss_chicken/1_walk/G3.png', 'img/img/4_enemie_boss_chicken/1_walk/G4.png' ];

  IMAGES_ATTACK = [ 'img/img/4_enemie_boss_chicken/3_attack/G13.png', 'img/img/4_enemie_boss_chicken/3_attack/G14.png', 'img/img/4_enemie_boss_chicken/3_attack/G15.png', 'img/img/4_enemie_boss_chicken/3_attack/G16.png', 'img/img/4_enemie_boss_chicken/3_attack/G17.png', 'img/img/4_enemie_boss_chicken/3_attack/G18.png', 'img/img/4_enemie_boss_chicken/3_attack/G19.png', 'img/img/4_enemie_boss_chicken/3_attack/G20.png' ];

  IMAGES_HURT = [ 'img/img/4_enemie_boss_chicken/4_hurt/G21.png', 'img/img/4_enemie_boss_chicken/4_hurt/G22.png', 'img/img/4_enemie_boss_chicken/4_hurt/G23.png' ];

  IMAGES_DEAD = [ 'img/img/4_enemie_boss_chicken/5_dead/G24.png', 'img/img/4_enemie_boss_chicken/5_dead/G25.png', 'img/img/4_enemie_boss_chicken/5_dead/G26.png' ];

  lastHitEndboss = 0;

  /**
   * Creates the Endboss, loads images and sets initial state.
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 3900;
    this.lastHitEndboss = 0;
    this.isCollidingWithCharacter = false;
  }


  /**
   * Activates the end boss on first contact.
   */
  endbossFirstContact() {
    console.log("LOG: endbossFirstContact() called.");
    this.hadFirstContact = true;
    console.log("LOG: hadFirstContact set to true in endbossFirstContact.");
    this.world.audioManager.playEndbossMusic(true);
    this.i = 0;
    console.log("LOG: i reset to 0.");
  }

  /**
   * Reduces the end boss's health. Triggers game win if dead.
   * @param {number} damageAmount - Amount of damage dealt
   */
  hitEndboss(damageAmount) {
    this.health -= damageAmount;

    if (this.health < 0) {
      this.health = 0;
    }

    this.lastHitEndboss = Date.now();
    console.log("Endboss hit! New health:", this.health);

    if (this.isDeadEndboss() && this.world && !this.world.gameOver) {
      console.log("LOG: Endboss is dead. Triggering game win.");

      if (typeof this.world.gameWin === "function") {
        this.world.gameWin();
      } else if (typeof gameWin === "function") {
        gameWin();
      } else {
        console.error("LOG: gameWin() function not found.");
      }
    }
  }

  /**
   * Returns true if the end boss was recently hit.
   * @returns {boolean}
   */
  isHurtEndboss() {
    return (Date.now() - this.lastHitEndboss) / 1000 < 1;
  }

  /**
   * Returns true if the end boss's health is 0 or less.
   * @returns {boolean}
   */
  isDeadEndboss() {
    return this.health <= 0;
  }

  /**
   * Handles actions when the end boss collides with the character.
   * Should be called by the collision detection logic in the World.
   * @method
   */
  handleCharacterCollision() {
    console.log("LOG: Endboss handleCharacterCollision() called.");
    this.isCollidingWithCharacter = true; // Set the flag
    // Optional: Set animation to "Attack" or trigger other immediate actions.
  }

  /**
   * Handles actions when the end boss collision with the character ends.
   * Should be called by the collision detection logic in the World when collision is no longer detected.
   * @method
   */
  handleCharacterCollisionEnd() {
    console.log("LOG: Endboss handleCharacterCollisionEnd() called.");
    this.isCollidingWithCharacter = false; // Reset the flag
  }

  /**
   * Starts the main logic intervals for the end boss.
   * Called by World.setWorld() after world reference is set.
   * @method
   */
  animate() {
    // 1. Interval zur Prüfung auf "First Contact" (Sollte sich selbst stoppen)
    // Periodically checks the character's position to activate the boss.
    this.firstContactIntervalId = setInterval(() => {
      // Ensure the world reference is available before proceeding
      if (!this.world) return; // Exit if world reference is not ready

      if (!this.hadFirstContact) {
        // Check if first contact hasn't occurred yet
        if (this.world.character) {
          const triggerX = this.x - 400; // Trigger X position for first contact
          const characterX = this.world.character.x; // Character's current X position

          // Check the condition for first contact
          if (characterX > triggerX) {
            console.log("LOG: First contact with end boss area detected! Boss activated.");
            this.endbossFirstContact(); // Activate the boss

            // Start animation and movement intervals
            this.startBossAnimation();
            this.startBossMovement();

            // Stop this first contact interval as it's no longer needed
            clearInterval(this.firstContactIntervalId);
            this.firstContactIntervalId = null;
            console.log("LOG: First Contact Interval cleared.");
          }
        }
      }
    }, 200); // Checks every 200ms
  }

  /**
   * Handles the animation of the end boss based on its state (Dead, Hurt, Alert, Attack, Walk, Colliding).
   * This method is called repeatedly by the animation interval after first contact.
   * It plays the correct image sequence and increments the frame counter 'this.i'.
   * @method
   */
  endbossAnimation() {
    // showStatusBar wird beim ersten i=0 Aufruf in diesem Interval gemacht (oder in endbossFirstContact())
    if (this.i === 0 && this.hadFirstContact) {
      // Nur beim allerersten Frame nach First Contact
      this.showStatusBar();
    }

    // --- Animation State Logic ---
    // Priorisiere kritische Zustände (Dead, Hurt) und den Kollisionszustand über die normale Sequenz.

    if (this.isCollidingWithCharacter) {
      // Attack Animation bei Kollision
      this.playAnimation(this.IMAGES_ATTACK);
      return; // Verhindert, dass i inkrementiert wird
    } else if (this.isDeadEndboss()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurtEndboss()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.i < this.IMAGES_ALERT.length) {
      // Spielt Alert Animation
      this.playAnimation(this.IMAGES_ALERT);
      this.i++; // Inkrementiere i nur im Alert-Zustand
    } else {
      // Spielt Walk Animation nach Alert
      this.playAnimation(this.IMAGES_WALKING);
      this.i++; // Inkrementiere i im Walk-Zustand

      // Loop zurück zu Alert, wenn Walk-Ende erreicht ist
      if (this.i >= this.IMAGES_ALERT.length + this.IMAGES_WALKING.length) {
        this.i = this.IMAGES_ALERT.length;
      }
    }
  }

  /**
   * Shows the status bar for the end boss.
   * @method
   */
  showStatusBar() {
    if (this.world && this.world.statusBarEndboss) {
      this.world.statusBarEndboss.visible = true;
    } else {
      console.warn("LOG: Endboss showStatusBar: world or statusBarEndboss missing.");
    }
  }

  /**
   * Starts the animation loop for the boss after first contact.
   * @method
   */
  startBossAnimation() {
    if (this.animationIntervalId === null) {
      console.log("LOG: Starting Boss Animation Interval."); // Log
      this.animationIntervalId = setInterval(() => {
        if (!this.isDeadEndboss()) {
          this.endbossAnimation();
        } else {
          clearInterval(this.animationIntervalId);
          this.animationIntervalId = null;
          console.log("LOG: Boss Animation Interval stopped due to death.");
        }
      }, 500); // Animation Speed
    }
  }

  /**
   * Starts the movement loop for the boss after first contact.
   * @method
   */
  startBossMovement() {
    if (this.movementIntervalId === null) {
      console.log("LOG: Starting Boss Movement Interval."); // Log
      this.movementIntervalId = setInterval(() => {
        if (!this.isDeadEndboss() && !this.isHurtEndboss()) {
          if (!this.isCollidingWithCharacter && this.i >= this.IMAGES_ALERT.length) {
            if (this.world && this.world.character) {
              const charCenterX = this.world.character.x + this.world.character.width / 2;
              const bossCenterX = this.x + this.width / 2;

              if (bossCenterX > charCenterX) {
                this.x -= this.speed; // Move left
              }
            }
          }
        }
      }, 1000 / 60); // 60 FPS
    }
  }

  /**
   * Stops all specific intervals associated with the end boss.
   * Called, for example, when the game ends.
   * @method
   */
  stopEndbossIntervals() {
    console.log("LOG: Stopping Endboss Intervals."); // Log
    if (this.firstContactIntervalId) clearInterval(this.firstContactIntervalId);
    if (this.movementIntervalId) clearInterval(this.movementIntervalId);
    if (this.animationIntervalId) clearInterval(this.animationIntervalId);

    this.firstContactIntervalId = null;
    this.movementIntervalId = null;
    this.animationIntervalId = null; // Set animation ID to null

    super.stopGravity(); // Assuming MovableObject has a stopGravity method
  }
}