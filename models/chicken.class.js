class Chicken extends MovableObject {
    y = 340;
    height = 80;
    width = 80;
    damage = 10;
    chickenIsDead = false;
    deathSoundPlayed = false;

    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    moveIntervalId = null;
    animationIntervalId = null;

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.offset = { top: 0, right: 0, bottom: 0, left: 0 };

        this.x = 400 + Math.random() * 2200;
        this.speed = 0.25 + Math.random() * 0.25;

        this.animate();
    }

    isDead() {
        return this.chickenIsDead;
    }

    setDead() {
        this.chickenIsDead = true;
    }

    moveChicken() {
        if (!this.chickenIsDead) {
            this.x -= this.speed;
        }
    }

    animate() {
        this.moveIntervalId = setInterval(() => {
            this.moveChicken();
        }, 1000 / 60);

        this.animationIntervalId = setInterval(() => {
            if (!this.chickenIsDead) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_DEAD);

                if (!this.deathSoundPlayed && this.world?.audioManager && !this.world.audioManager.isMuted) {
                    this.world.audioManager.playSound('chickenDead');
                    this.deathSoundPlayed = true;
                }
            }
        }, 200);
    }

    stopChickenIntervals() {
        clearInterval(this.moveIntervalId);
        clearInterval(this.animationIntervalId);
        this.moveIntervalId = null;
        this.animationIntervalId = null;
    }
}