/**
 * Represents a throwable object like a bottle.
 * Handles movement, gravity, splash logic, and removal.
 */
class ThrowableObject extends MovableObject {
    world;
    damage = 20;
    isColliding = false;
    direction = 1;
    isSplashed = false;
    groundLevel = 355;

    IMAGES_ROTATION = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    moveIntervalId = null;
    logicIntervalId = null;

    constructor(world, x, y, otherDirection) {
        super();
        this.world = world;

        this.loadImage('img/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
        this.speedY = 20;
        this.direction = otherDirection ? -1 : 1;
        this.speed = 10;

        this.throw();
    }

    throw() {
        this.applyGravity();
        this.moveIntervalId = setInterval(() => {
            if (!this.isSplashed) {
                this.x += this.speed * this.direction;
            }
        }, 1000 / 40);

        this.logicIntervalId = setInterval(() => {
            this.update();
        }, 1000 / 60);
    }

    update() {
        if (!this.isSplashed && ((this.y >= this.groundLevel && this.speedY <= 0) || this.isColliding)) {
            this.isColliding ? this.onTargetHit() : this.onGroundHit();
        }

        this.playAnimation(this.isSplashed ? this.IMAGES_SPLASH : this.IMAGES_ROTATION);
    }

    onGroundHit() {
        this._splash();
        this.y = this.groundLevel;
        this._scheduleRemoval();
    }

    onTargetHit() {
        this._splash();
        this._scheduleRemoval();
    }

    _splash() {
        this.isSplashed = true;
        this.speed = 0;
        this.speedY = 0;
        super.stopGravity();

        this.world?.audioManager?.playSound?.('bottle_hit');
    }

    _scheduleRemoval() {
        setTimeout(() => {
            this.stopThrowableObjectIntervals();
            const index = this.world?.throwableObjects?.indexOf(this);
            if (index > -1) this.world.throwableObjects.splice(index, 1);
        }, 500);
    }

    stopThrowableObjectIntervals() {
        clearInterval(this.moveIntervalId);
        clearInterval(this.logicIntervalId);
        this.moveIntervalId = null;
        this.logicIntervalId = null;
        super.stopGravity();
    }
}
