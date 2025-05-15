/**
 * Represents the main game world.
 * Handles rendering, physics, audio, collisions, and game object updates.
 */
class World {
  /**
   * The main player character.
   * @type {Character}
   */
  character = new Character();

  /**
   * Current level instance.
   * @type {Level}
   */
  level = level1;

  /**
   * Canvas rendering context.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * HTML canvas element.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * Audio manager instance.
   * @type {AudioManager}
   */
  audioManager;

  /**
   * Tracks keyboard state.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * Horizontal camera offset.
   * @type {number}
   */
  camera_x = 0;

  /**
   * UI element: character health bar.
   * @type {StatusBar}
   */
  statusBar = new StatusBar();

  /**
   * UI element: bottle collection bar.
   * @type {StatusBarBottle}
   */
  statusBarBottle = new StatusBarBottle();

  /**
   * UI element: coin collection bar.
   * @type {StatusBarCoin}
   */
  statusBarCoin = new StatusBarCoin();

  /**
   * UI element: endboss health bar.
   * @type {StatusBarEndboss}
   */
  statusBarEndboss = new StatusBarEndboss();

  /**
   * All throwable objects (e.g. bottles) in the world.
   * @type {ThrowableObject[]}
   */
  throwableObjects = [];

  /**
   * Tracks total collected coins.
   * @type {number}
   */
  coinCounter = 0;

  /**
   * Timestamp of the last bottle throw.
   * @type {number}
   */
  lastThrowTime = 0;

  /**
   * Indicates if the game is over.
   * @type {boolean}
   */
  gameOver = false;

  /**
   * ID of the collision detection interval.
   * @type {number|null}
   */
  collisionIntervalId = null;

  /**
   * ID of the throw-check interval.
   * @type {number|null}
   */
  throwIntervalId = null;

  /**
   * ID of the requestAnimationFrame loop.
   * @type {number|null}
   */
  animationFrameId = null;

  /**
   * Creates the game world and starts main loops.
   *
   * @param {HTMLCanvasElement} canvas - The rendering canvas.
   * @param {Keyboard} keyboard - The keyboard input state.
   * @param {AudioManager} audioManager - The audio manager instance.
   */
  constructor(canvas, keyboard, audioManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.audioManager = audioManager;
    this.collisionManager = new CollisionManager(this);
    this.loadSounds();
    this.setWorld();
    this.draw();
    this.run();
  }

  /**
   * Preloads all sound files into the audio manager.
   */
  loadSounds() {
    if (!this.audioManager) return;
    const sounds = [
      ["backgroundMusic", "audio/background_music.mp3", 0.1],
      ["bottleCollect", "audio/bottleCollect_sound.mp3"],
      ["bottle_hit", "audio/bottleBroke_sound.mp3"],
      ["chickenDead", "audio/chicken_sound.mp3"],
      ["coinCollected", "audio/coinCollect_sound.mp3"],
      ["endbossMusic", "audio/endboss_music.mp3"],
      ["gameOver", "audio/game_over_sound.mp3"],
      ["hurt", "audio/hurt_sound.mp3"],
      ["jump", "audio/jumping_sound.mp3"],
      ["lose", "audio/lose_sound.mp3"],
      ["throw", "audio/throw_sound.mp3"],
      ["walk", "audio/walking_sound.mp3"],
      ["win", "audio/win_sound.mp3"],
    ];

    sounds.forEach(([key, path, vol]) => {
      vol
        ? this.audioManager.setBackgroundMusic(path, vol)
        : this.audioManager.addSound(key, path);
    });
  }

  /**
   * Assigns the world reference to all world-related objects.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies?.forEach((enemy) => {
      enemy.world = this;
      if (enemy instanceof Endboss) enemy.animate();
    });
  }

  /**
   * Starts collision and throw-check intervals.
   */
  run() {
    this.collisionIntervalId = setInterval(
      () => this.collisionManager?.checkAllCollisions(),
      25
    );
    this.throwIntervalId = setInterval(() => this.checkThrowObjects(), 50);
  }

  /**
   * Checks if the character is allowed to throw and creates a bottle if so.
   */
  checkThrowObjects() {
    const cooldown = 850;
    const now = Date.now();

    if (
      justPressed.SHIFT &&
      now - this.lastThrowTime > cooldown &&
      this.character.bottlesCollected > 0 &&
      !this.character.isDead()
    ) {
      this.character.throwBottle(this.character.otherDirection);
      this.lastThrowTime = now;
      this.audioManager?.playSound("throw");
      justPressed.SHIFT = false;
    }
  }

  /**
   * Main drawing loop using requestAnimationFrame.
   * Draws all visible game objects and UI.
   */
  draw() {
    if (!this.ctx || !this.canvas || this.gameOver) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    const visibleObjects = [
      ...this.level.backgroundObjects,
      ...this.level.clouds,
      this.character,
      ...this.level.endboss,
      ...this.level.enemies,
      ...this.level.coins,
      ...this.level.bottles,
      ...this.throwableObjects,
    ].filter((obj) => this.isVisibleOnCanvas(obj));

    this.addObjectsToMap(visibleObjects);
    this.ctx.restore();

    [
      this.statusBar,
      this.statusBarBottle,
      this.statusBarCoin,
      this.statusBarEndboss,
    ].forEach((el) => this.addToMap(el));

    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Checks if an object is within the visible camera area (with buffer).
   *
   * @param {Object} obj - Game object with x and width.
   * @returns {boolean}
   */
  isVisibleOnCanvas(obj) {
    const buffer = 100;
    const x = obj?.x ?? 0;
    const width = obj?.width ?? 0;
    const left = -this.camera_x - buffer;
    const right = -this.camera_x + this.canvas.width + buffer;
    return x + width > left && x < right;
  }

  /**
   * Adds multiple objects to the canvas.
   *
   * @param {Object[]} objects - Objects with a draw method.
   */
  addObjectsToMap(objects) {
    objects?.forEach((obj) => obj && this.addToMap(obj));
  }

  /**
   * Draws a single object and flips it if facing left.
   *
   * @param {Object} obj - The object to draw.
   */
  addToMap(obj) {
    if (!obj?.draw) return;

    const shouldFlip =
      obj.otherDirection && !(obj instanceof Endboss && obj.isDeadEndboss?.());
    if (shouldFlip) this.flipImage(obj);

    obj.draw(this.ctx);

    if (shouldFlip) this.flipImageBack(obj);
  }

  /**
   * Flips an object horizontally.
   *
   * @param {Object} obj - The object to flip.
   */
  flipImage(obj) {
    this.ctx.save();
    this.ctx.translate(obj.width, 0);
    this.ctx.scale(-1, 1);
    obj.x *= -1;
  }

  /**
   * Reverts image flipping.
   *
   * @param {Object} obj - The object to unflip.
   */
  flipImageBack(obj) {
    obj.x *= -1;
    this.ctx.restore();
  }

  /**
   * Stops all game intervals, animations, sounds and gravity.
   */
  stopAllIntervals() {
    this.character?.stopCharacterIntervals?.();

    this.level.enemies?.forEach((enemy) => {
      enemy?.stopChickenIntervals?.();
      enemy?.stopChickenMiniIntervals?.();
      enemy?.stopEndbossIntervals?.();
    });

    this.throwableObjects?.forEach((bottle) => {
      bottle?.stopThrowableObjectIntervals?.();
    });

    this.stopWorldIntervals();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.character?.stopGravity?.();
    this.audioManager?.pauseBackgroundMusic?.();
    this.audioManager?.pauseEndbossMusic?.();
  }

  /**
   * Clears the internal world-specific intervals.
   */
  stopWorldIntervals() {
    clearInterval(this.collisionIntervalId);
    clearInterval(this.throwIntervalId);
    this.collisionIntervalId = this.throwIntervalId = null;
  }

  /**
   * Restarts all world-specific intervals and rendering.
   */
  startWorldIntervals() {
    this.run();
    this.draw();
  }

  /**
   * Resumes animation, movement, and music after pause.
   */
  resumeAllIntervals() {
    this.startWorldIntervals?.();
    this.character.animateCharacter?.();

    this.level.enemies?.forEach((enemy) => {
      enemy?.animate?.();
      if (enemy instanceof Endboss) enemy.resumeEndboss?.();
    });

    const am = this.audioManager;
    const endboss = this.level.enemies.find((e) => e instanceof Endboss);

    if (am && !am.isMuted) {
      if (endboss?.hadFirstContact && !endboss?.isDeadEndboss()) {
        am.pauseBackgroundMusic?.();
        am.sounds["endbossMusic"]
          ?.play()
          .catch((e) => console.warn("Resume EndbossMusic failed", e));
        am.endbossFightStarted = true;
      } else if (!am.backgroundMusicPlaying && am.backgroundMusic?.paused) {
        am.backgroundMusic
          .play()
          .catch((e) => console.warn("Resume BackgroundMusic failed", e));
        am.backgroundMusicPlaying = true;
      }
    }
  }
}
