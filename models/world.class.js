/**
 * Represents the main game world.
 * Handles rendering, audio, collisions, and object logic.
 */
class World {
    character = new Character();
    level = level1;
    ctx;
    canvas;
    audioManager;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarBottle = new StatusBarBottle();
    statusBarCoin = new StatusBarCoin();
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = [];
    coinCounter = 0;
    lastThrowTime = 0;
    gameOver = false;
    collisionIntervalId = null;
    throwIntervalId = null;

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
            ["win", "audio/win_sound.mp3"]
        ];

        sounds.forEach(([key, path, vol]) => {
            vol ? this.audioManager.setBackgroundMusic(path, vol) : this.audioManager.addSound(key, path);
        });
    }

    setWorld() {
        this.character.world = this;
        if (Array.isArray(this.level.enemies)) {
            this.level.enemies.forEach(enemy => {
                if (enemy) {
                    enemy.world = this;
                    if (enemy instanceof Endboss) enemy.animate();
                }
            });
        }
    }

    run() {
        this.collisionIntervalId = setInterval(() => this.collisionManager?.checkAllCollisions(), 25);
        this.throwIntervalId = setInterval(() => this.checkThrowObjects(), 50);
    }

    checkThrowObjects() {
        const cooldown = 850;
        const now = Date.now();
        if (this.keyboard.SHIFT && now - this.lastThrowTime > cooldown && this.character.bottlesCollected > 0 && !this.character.isDead()) {
            this.character.throwBottle(this.character.otherDirection);
            this.lastThrowTime = now;
            this.audioManager?.playSound("throw");
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap([...this.level.backgroundObjects, ...this.level.clouds, this.character, ...this.level.endboss, ...this.level.enemies, ...this.level.coins, ...this.level.bottles, ...this.throwableObjects]);

        this.ctx.restore();
        [this.statusBar, this.statusBarBottle, this.statusBarCoin, this.statusBarEndboss].forEach(el => this.addToMap(el));
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects?.forEach(obj => obj && this.addToMap(obj));
    }

    addToMap(obj) {
        if (!obj?.draw) return;

        const shouldFlip = obj.otherDirection && !(obj instanceof Endboss && obj.isDeadEndboss?.());
        if (shouldFlip) this.flipImage(obj);

        obj.draw(this.ctx);

        // obj.drawFrame?.(this.ctx); // Uncomment for debugging

        if (shouldFlip) this.flipImageBack(obj);
    }

    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x *= -1;
    }

    flipImageBack(obj) {
        obj.x *= -1;
        this.ctx.restore();
    }

    stopAllIntervals() {
        this.character?.stopCharacterIntervals?.();
        this.level.enemies?.forEach(enemy => {
            if (enemy instanceof Chicken) enemy.stopChickenIntervals?.();
            else if (enemy instanceof ChickenMini) enemy.stopChickenMiniIntervals?.();
            else if (enemy instanceof Endboss) enemy.stopEndbossIntervals?.();
        });

        this.throwableObjects?.forEach(bottle => bottle?.stopThrowableObjectIntervals?.());
        this.stopWorldIntervals();

        this.audioManager?.pauseBackgroundMusic?.();
        this.audioManager?.pauseEndbossMusic?.();
    }

    stopWorldIntervals() {
        clearInterval(this.collisionIntervalId);
        clearInterval(this.throwIntervalId);
        this.collisionIntervalId = this.throwIntervalId = null;
    }
}
