/**
 * Represents the Endboss in the game.
 * Inherits from {@link MovableObject}.
 * Handles appearance, damage, animations, and attack behavior.
 */
class Endboss extends MovableObject {
  /** @type {number} */ height = 400;
  /** @type {number} */ width = 250;
  /** @type {number} */ y = 55;
  /** @type {number} */ x = 3900;
  /** @type {number} */ speed = 2;
  /** @type {number} */ health = 100;
  /** @type {number} */ damage = 40;
  /** @type {boolean} */ visible = false;
  /** @type {boolean} */ hadFirstContact = false;
  /** @type {boolean} */ isCollidingWithCharacter = false;
  /** @type {boolean} */ isAlreadyDeadAnimated = false;
  /** @type {boolean} */ isAttacking = false;
  /** @type {number} */ lastAttackTime = 0;
  /** @type {number} */ attackCooldown = 3000;
  /** @type {number} */ i = 0;
  /** @type {World} */ world;

  /** @type {{ top: number, left: number, right: number, bottom: number }} */
  offset = { top: 80, left: 40, right: 40, bottom: 20 };

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

  /** @type {number|null} */ animationFrameId = null;
  /** @type {number|null} */ movementIntervalId = null;
  /** @type {number|null} */ firstContactIntervalId = null;
  /** @type {number} */ lastHitEndboss = 0;

  /**
   * Initializes the Endboss by loading all animations and setting defaults.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Triggered on first character contact to start boss behavior.
   */
  endbossFirstContact() {
    this.hadFirstContact = true;
    this.i = 0;
    this.world?.audioManager?.playEndbossMusic?.(true);
  }

  /**
   * Applies damage to the Endboss and updates UI.
   * @param {number} damageAmount
   */
  hitEndboss(damageAmount) {
    this.health = Math.max(0, this.health - damageAmount);
    this.lastHitEndboss = Date.now();
    this.world?.statusBarEndboss?.setPercentage?.(this.health);
  }

  /**
   * Checks if the Endboss was recently hit.
   * @returns {boolean}
   */
  isHurtEndboss() {
    return (Date.now() - this.lastHitEndboss) / 1000 < 1;
  }

  /**
   * Checks whether the Endboss is dead.
   * @returns {boolean}
   */
  isDeadEndboss() {
    return this.health <= 0;
  }

  /** Sets collision flag to true. */
  handleCharacterCollision() {
    this.isCollidingWithCharacter = true;
  }

  /** Resets collision flag. */
  handleCharacterCollisionEnd() {
    this.isCollidingWithCharacter = false;
  }

  /**
   * Starts checking for character proximity to trigger boss behavior.
   */
  animate() {
    this.firstContactIntervalId = setInterval(() => {
      const triggerX = this.x - 400;
      const charX = this.world?.character?.x;

      if (!this.hadFirstContact && charX > triggerX) {
        this.endbossFirstContact();
        this.startBossAnimation();
        this.startBossMovement();
        clearInterval(this.firstContactIntervalId);
        this.firstContactIntervalId = null;
      }
    }, 200);
  }

  /**
   * Handles one frame of the Endboss animation based on current state.
   * @param {DOMHighResTimeStamp} now - Timestamp from requestAnimationFrame.
   */
  animateEndbossFrame(now) {
    if (this.world?.gameOver) return;

    this.showHealthBarOnce();

    if (this.shouldAttack()) return this.handleAttackAnimation();
    if (this.isDeadEndboss()) return this.handleDeathAnimation();
    if (this.isHurtEndboss()) return this.playAnimation(this.IMAGES_HURT);

    this.handleWalkCycle();
  }

  /**
   * Shows the health bar once after contact.
   */
  showHealthBarOnce() {
    if (this.i === 0 && this.hadFirstContact) {
      this.world?.statusBarEndboss &&
        (this.world.statusBarEndboss.visible = true);
    }
  }

  /**
   * Determines if the Endboss should attack based on cooldown and state.
   * @returns {boolean}
   */
  shouldAttack() {
    const now = Date.now();
    return (
      this.isCollidingWithCharacter &&
      !this.isAttacking &&
      now - this.lastAttackTime > this.attackCooldown
    );
  }

  /**
   * Plays the attack animation and resets state afterward.
   */
  handleAttackAnimation() {
    this.isAttacking = true;
    this.lastAttackTime = Date.now();
    this.playAnimationOnce(this.IMAGES_ATTACK, () => {
      this.isAttacking = false;
      this.handleCharacterCollisionEnd();
    });
  }

  /**
   * Plays death animation once and triggers game win.
   */
  handleDeathAnimation() {
    if (!this.isAlreadyDeadAnimated) {
      this.isAlreadyDeadAnimated = true;
      this.stopEndbossIntervals();
      this.playAnimationOnce(this.IMAGES_DEAD, () => {
        this.world?.gameWin?.() ?? gameWin?.();
      });
    }
  }

  /**
   * Manages alert and walking animation cycle.
   */
  handleWalkCycle() {
    if (this.i < this.IMAGES_ALERT.length) {
      this.playAnimation(this.IMAGES_ALERT);
      this.i++;
    } else {
      this.playAnimation(this.IMAGES_WALKING);
      this.i++;
      if (this.i >= this.IMAGES_ALERT.length + this.IMAGES_WALKING.length) {
        this.i = this.IMAGES_ALERT.length;
      }
    }
  }

  /**
   * Starts the boss animation loop via requestAnimationFrame.
   */
  startBossAnimation() {
    cancelAnimationFrame(this.animationFrameId);
    if (!this.hadFirstContact) return;

    let lastTime = performance.now();

    const step = (now) => {
      const delta = now - lastTime;
      if (delta >= 500) {
        this.animateEndbossFrame(now);
        lastTime = now;
      }

      const endAnimationFinished =
        this.isDeadEndboss() && this.isAlreadyDeadAnimated;

      if (!endAnimationFinished) {
        this.animationFrameId = requestAnimationFrame(step);
      }
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  /**
   * Starts boss movement toward the player when conditions are met.
   */
  startBossMovement() {
    if (!this.movementIntervalId) {
      this.movementIntervalId = setInterval(() => {
        const char = this.world?.character;
        const shouldMove =
          !this.isDeadEndboss() &&
          !this.isHurtEndboss() &&
          !this.isCollidingWithCharacter &&
          !this.world?.gameOver &&
          this.i >= this.IMAGES_ALERT.length;

        if (
          shouldMove &&
          char &&
          this.x + this.width / 2 > char.x + char.width / 2
        ) {
          this.x -= this.speed;
        }
      }, 1000 / 60);
    }
  }

  /**
   * Stops all intervals and animations related to the Endboss.
   */
  stopEndbossIntervals() {
    clearInterval(this.firstContactIntervalId);
    clearInterval(this.movementIntervalId);
    cancelAnimationFrame(this.animationFrameId);
    this.firstContactIntervalId =
      this.movementIntervalId =
      this.animationFrameId =
        null;
    super.stopGravity?.();
  }

  /**
   * Resumes Endboss movement and animation after a pause.
   */
  resumeEndboss() {
    if (this.hadFirstContact && !this.isDeadEndboss()) {
      this.startBossAnimation();
      this.startBossMovement();

      const audioManager = this.world?.audioManager;
      const music = audioManager?.sounds?.["endbossMusic"];
      if (audioManager && !audioManager.isMuted && music && music.paused) {
        music
          .play()
          .catch((e) => console.warn("Error resuming endboss music:", e));
      }
    }
  }
}
