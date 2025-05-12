/**
 * Represents the end boss in the game.
 * Inherits from MovableObject and includes properties for different states and behaviors.
 */
class Endboss extends MovableObject {
  height = 400; // Height of the end boss
  width = 250; // Width of the end boss
  damage = 40;
  y = 55; // Y-coordinate of the end boss
  i = 0; // Animation frame index/state counter
  hadFirstContact = false; // Indicates if the first contact has occurred
  speed = 2; // Speed of the end boss (adjust as needed for movement speed)
  visible = false; // Visibility status of the end boss (maybe for later use)
  health = 100; // Energy of the end boss
  world; // Reference to the game world

  firstContactIntervalId = null; // ID for the First Contact Interval
  movementIntervalId = null; // ID for the Movement Interval
  animationIntervalId = null; // *** NEW: ID for the Animation Interval ***

  offset = {
    // Collision box offset
    top: 80,
    left: 40,
    right: 40,
    bottom: 20,
  };

  // Animation Image Arrays (keep these as they are)
  IMAGES_ALERT = [
    "img/img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "img/img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ATTACK = [
    "img/img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  lastHitEndboss = 0; // Timestamp of the last hit

  /**
   * Initializes the end boss: loads images, sets initial position.
   * Note: Intervals are started by the World class after setting the world reference.
   * @constructor
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);

    // Load all images for different states
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 3900; // Initial x-coordinate
    this.lastHitEndboss = 0;
    this.isCollidingWithCharacter = false;
  }

  /**
   * Method to activate the end boss after first contact.
   * Sets the hadFirstContact flag, resets animation counter, plays music.
   * Called by the first contact interval when the condition is met.
   * @method
   */
  endbossFirstContact() {
    console.log("LOG: endbossFirstContact() called."); // Dieser Log sollte erscheinen, wenn die Methode aufgerufen wird.

    // Die Prüfung if (!this.hadFirstContact) ist im aufrufenden Interval jetzt, nicht hier.

    this.hadFirstContact = true; // <-- HIER WIRD DER FLAG GESETZT
    console.log("LOG: hadFirstContact set to true in endbossFirstContact."); // *** Füge diesen Log hier ein! ***

    this.world.audioManager.playEndbossMusic(true); // Musik starten
    this.i = 0; // Animationszähler zurücksetzen
    console.log("LOG: i reset to 0."); // Original Log

    // Optional: Weitere Aktionen, die direkt bei Boss-Aktivierung passieren sollen.
  }

/**
     * Reduces energy (health) when hit. Handles game win logic on death.
     * @method
     * @param {number} damageAmount - The amount of damage taken. <-- DIESEN PARAMETER HINZUFÜGEN
     */
    hitEndboss(damageAmount) { // <-- Methonensignatur anpassen, um Schaden zu empfangen
        // console.log(`LOG: Endboss hit with ${damageAmount} damage.`); // Optionaler Log

        this.health -= damageAmount; // Reduziere Lebenspunkte um den übergebenen Schaden

        if (this.health < 0) {
            this.health = 0; // Stelle sicher, dass Lebenspunkte nicht negativ werden
        }
        this.lastHit = new Date().getTime(); // Setze die Zeit des letzten Treffers

        console.log("Endboss getroffen! Neue Gesundheit:", this.health); // Logge die neue Gesundheit

        // Prüfe, ob der Boss tot ist und das Spiel noch nicht vorbei ist
        // Deine Logik, gameWin hier direkt auszulösen
        if (this.isDeadEndboss() && typeof this.isDeadEndboss === 'function' && this.world && !this.world.gameOver) { // Added typeof check for safety, using this.world
             console.log("Boss ist tot erkannt! Trigger gameWin."); // Log

             // Löse das Spiel Gewinnen aus (Deine aktuelle Struktur ruft gameWin hier direkt auf)
             // Stelle sicher, dass deine gameWin() Funktion im game.js (oder World) existiert
             // und das world.gameOver Flag setzt und Intervalle stoppt.
             if (typeof gameWin === "function") {
                  // Safety check
                  gameWin(); // Rufe die globale gameWin Funktion auf
             } else if (this.world && typeof this.world.gameWin === "function") { // Fallback zu World Methode
                  this.world.gameWin();
             }
             else {
                  console.error("LOG: gameWin function is not defined in World or globally!");
                  // Optional: Manuell Intervalle stoppen, falls gameWin fehlt (als Fallback)
                  // this.stopEndbossIntervals();
                  // if (this.world && typeof this.world.stopAllIntervals === 'function') {
                  //     this.world.stopAllIntervals();
                  // }
             }
            }
          }


  /**
   * Checks if the last hit occurred within the last second.
   * @returns {boolean}
   * @method
   */
  isHurtEndboss() {
    return (Date.now() - this.lastHitEndboss) / 1000 < 1;
  }

  /**
   * Checks if the end boss's health is zero or less.
   * @returns {boolean}
   * @method
   */
  isDeadEndboss() {
    return this.health <= 0; // Use <= 0
  }

  /**
   * Handles actions when the end boss collides with the character.
   * Should be called by the collision detection logic in the World.
   * @method
   */
  handleCharacterCollision() {
    console.log("LOG: Endboss handleCharacterCollision() called."); // Optionaler Log
    this.isCollidingWithCharacter = true; // <- Setzt den Flag
    // Optional: Hier könntest du auch die Animation auf "Attack" setzen oder andere sofortige Aktionen auslösen.
  }

  /**
   * Handles actions when the end boss collision with the character ends.
   * Should be called by the collision detection logic in the World when collision is no longer detected.
   * @method
   */
  handleCharacterCollisionEnd() {
    console.log("LOG: Endboss handleCharacterCollisionEnd() called."); // Optionaler Log
    this.isCollidingWithCharacter = false; // <- Setzt den Flag zurück
    // Optional: Hier könntest du auch die Animation auf "Walk" zurücksetzen oder andere Aktionen auslösen.
  }

  /**
   * Starts the main logic intervals for the end boss.
   * Called by World.setWorld() after world reference is set.
   * @method
   */
  animate() {
    // *** 1. Interval zur Prüfung auf "First Contact" (Sollte sich selbst stoppen) ***
    // Prüft periodisch die Position des Charakters, um den Boss zu aktivieren.
    this.firstContactIntervalId = setInterval(() => {
      // console.log('LOG: Endboss First Contact Interval Callback Firing.'); // <-- Minimal-Test-Log auskommentieren!

      // *** DEN GESAMTEN FOLGENDEN CODE WIEDER EINKOMMENTIEREN! ***
      // Robust check: Only proceed if world reference is available
      if (!this.world) {
        // console.log('LOG: Endboss First Contact Interval: Waiting for world reference...'); // Optional log
        return; // Exit callback if world is not ready
      }

      // Log to see if the interval is running and the flag state
      // console.log('LOG: Endboss First Contact Interval Check Running. hadFirstContact:', this.hadFirstContact); // Optional log

      if (!this.hadFirstContact) {
        // Check only if first contact has NOT yet occurred
        // Check if character reference is available
        if (this.world.character) {
          const triggerX = this.x - 400; // Calculate the trigger X position (3900 - 400 = 3500)
          const characterX = this.world.character.x; // Get character's current X position

          // Log values for debugging the condition
          // console.log('LOG: Checking First Contact Condition. Character X:', characterX, 'Boss Trigger X:', triggerX);
          // const conditionResult = characterX > triggerX;
          // console.log('LOG: First Contact Condition Result:', conditionResult, '(', characterX, '>', triggerX, ')');

          // *** THE ACTUAL FIRST CONTACT CONDITION ***
          if (characterX > triggerX) {
            // If the character is to the right of the trigger point (X > 3500)
            console.log(
              "LOG: Erster Kontakt mit Endboss-Bereich erkannt! Boss wird aktiviert."
            ); // Success log

            this.endbossFirstContact(); // Call the method to activate the boss (sets flag, resets i, plays music)

            // *** Start the separate Animation and Movement intervals HERE ***
            this.startBossAnimation();
            this.startBossMovement();
            // ***************************************************************

            // *** Stop THIS First Contact Interval as its job is done ***
            clearInterval(this.firstContactIntervalId);
            this.firstContactIntervalId = null; // Set ID to null after clearing
            console.log("LOG: First Contact Interval cleared."); // Log to confirm it stopped
          }
        } else {
          // Log if world exists but character doesn't (shouldn't happen if World is set up correctly)
          // console.warn('LOG: Endboss First Contact Check: World exists but Character missing.');
        }
      }
      // *** BIS HIER ALLES WIEDER EINKOMMENTIEREN! ***
    }, 200); // Frequency: Check every 200ms (adjust if needed)

    // Log, um zu sehen, ob die Interval ID gesetzt wird (optional).
    // console.log('LOG: Endboss Animate: firstContactIntervalId set to:', this.firstContactIntervalId);

    // *** startBossAnimation und startBossMovement Methoden sind weiterhin separate Methoden UNTER animate()! ***
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

    // *** NEUE PRÜFUNG: Spielt Attack Animation, wenn er mit dem Charakter kollidiert ***
    if (this.isCollidingWithCharacter) {
      // Spiele die Attack Animation bei Kollision.
      this.playAnimation(this.IMAGES_ATTACK);
      // WICHTIG: this.i wird HIER nicht inkrementiert, damit i im normalen Ablauf stoppt.
    }
    // ******************************************************************************
    else if (this.isDeadEndboss()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurtEndboss()) {
      this.playAnimation(this.IMAGES_HURT);
    }
    // Normale Sequenz: Alert -> Walk, nur wenn er NICHT kollidiert und nicht tot/verletzt ist
    else if (this.i < this.IMAGES_ALERT.length) {
      // Spielt Alert Animation, bis alle Alert-Bilder gezeigt wurden
      this.playAnimation(this.IMAGES_ALERT);
      this.i++; // Inkrementiere i nur im Alert-Zustand der normalen Sequenz
    } else {
      // <-- Dieser else Block wird erreicht, wenn i >= IMAGES_ALERT.length ist (Start des Walk-Zustands)
      // Spielt Walking Animation nach der Alert Sequenz
      this.playAnimation(this.IMAGES_WALKING);
      // Optional: Addiere zu i nur in der normalen Sequenz
      this.i++; // Inkrementiere i nur im Walk-Zustand der normalen Sequenz

      // *** KORRIGIERTE LOOP LOGIK für Alert -> Walk Sequenz ***
      // Loop die Walk-Animation, wenn i das Ende der Walk-Bilder erreicht hat (bezogen auf den Start des Walk-Zustands)
      if (this.i >= this.IMAGES_ALERT.length + this.IMAGES_WALKING.length) {
        this.i = this.IMAGES_ALERT.length; // Loop zurück zum START-INDEX des Walk-Zustands
      }
      // *****************************************************
    }

    // *** WICHTIG: this.i wird JETZT nur noch in den normalen Sequenz-Zuständen (Alert/Walk) inkrementiert,
    //             nicht wenn er Kollidiert, Tot oder Verletzt ist. ***
    // Das bedeutet, wenn er anfängt zu kollidieren, stoppt this.i im normalen Ablauf und die Attack Animation (wegen isCollidingWithCharacter) läuft.
    // Wenn die Kollision endet, läuft die normale Sequenz (Alert/Walk) von diesem.i weiter.
  }

  /**
   * Shows the status bar for the end boss.
   * @method
   */
  showStatusBar() {
    if (this.world && this.world.statusBarEndboss) {
      this.world.statusBarEndboss.visible = true;
    } else {
      console.warn(
        "LOG: Endboss showStatusBar: world or statusBarEndboss missing."
      );
    }
  }

  /**
   * Starts the animation loop for the boss after first contact.
   * @method
   */
  startBossAnimation() {
    // Ensure the interval isn't already running (safety)
    if (this.animationIntervalId === null) {
      console.log("LOG: Starting Boss Animation Interval."); // Log
      this.animationIntervalId = setInterval(() => {
        // This interval's only job is to call the animation logic periodically
        if (!this.isDeadEndboss()) {
          // Stop animating if dead (optional, Dead animation is handled inside endbossAnimation)
          this.endbossAnimation();
        } else {
          // If dead, stop this specific animation interval as well
          clearInterval(this.animationIntervalId);
          this.animationIntervalId = null;
          console.log("LOG: Boss Animation Interval stopped due to death.");
        }
      }, 500); // <-- Animation Speed: Adjust this value (milliseconds) to control animation speed.
      // Smaller value = faster animation. 80ms (approx 12.5 FPS) is a starting point. Try 100 or 150 if still too fast.
    } else {
      // console.warn('LOG: startBossAnimation called but animationIntervalId is not null.');
    }
  }

  /**
   * Starts the movement loop for the boss after first contact.
   * @method
   */
  startBossMovement() {
    // Ensure the interval isn't already running (safety)
    if (this.movementIntervalId === null) {
      console.log("LOG: Starting Boss Movement Interval."); // Log
      this.movementIntervalId = setInterval(() => {
        // Ensure boss is not dead or hurt before moving
        if (!this.isDeadEndboss() && !this.isHurtEndboss()) {
          // Nur bewegen, wenn KEINE Kollision mit dem Charakter stattfindet!
          if (!this.isCollidingWithCharacter) {
            // *** HIER DIE BEDINGUNG ANPASSEN: Nur bewegen, wenn der Boss im Walk-Animations-Zustand ist! ***
            // Der Walk-Zustand beginnt, wenn this.i >= IMAGES_ALERT.length ist.
            if (this.i >= this.IMAGES_ALERT.length) {
              // <--- NEUE KORRIGIERTE BEDINGUNG
              // *****************************************************************************************

              // --- Bewegungslogik hier (this.x ändern) ---
              // Move towards the character's horizontal position
              if (this.world && this.world.character) {
                const charCenterX =
                  this.world.character.x + this.world.character.width / 2;
                const bossCenterX = this.x + this.width / 2;

                if (bossCenterX > charCenterX) {
                  this.x -= this.speed; // Move left
                } else {
                  // Optional: Move right
                }
              }
            }
          }
        }
      }, 1000 / 60);
    } else {
      // console.warn('LOG: startBossMovement called but movementIntervalId is not null.');
    }
  }

  /**
   * Stops all specific intervals associated with the end boss.
   * Called, for example, when the game ends.
   * @method
   */
  stopEndbossIntervals() {
    console.log("LOG: Stopping Endboss Intervals."); // Log
    // Clear all known intervals and set their IDs to null
    if (this.firstContactIntervalId) clearInterval(this.firstContactIntervalId);
    if (this.movementIntervalId) clearInterval(this.movementIntervalId);
    if (this.animationIntervalId) clearInterval(this.animationIntervalId); // Clear the animation interval

    this.firstContactIntervalId = null;
    this.movementIntervalId = null;
    this.animationIntervalId = null; // Set animation ID to null

    super.stopGravity(); // Assuming MovableObject has a stopGravity method to clear its gravity interval/loop
  }
}
