class ChickenMini extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  damage = 10;
  chickenIsDead = false;
  deathSoundPlayed = false;

  IMAGES_WALKING = [
    "img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  moveIntervalId = null;
  animationIntervalId = null;

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.offset = { top: 0, right: 0, bottom: 0, left: 0 };
    this.x = 600 + Math.random() * 1800;
    this.speed = 0.15 + Math.random() * 0.55;

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

  chickenAnimation() {
    if (!this.chickenIsDead) {
      this.chickenAnimationWalk();
    } else {
      this.chickenAnimationDead();
    }
  }

  chickenAnimationWalk() {
    this.playAnimation(this.IMAGES_WALKING);
  }

  chickenAnimationDead() {
    this.playAnimation(this.IMAGES_DEAD);

    if (!this.deathSoundPlayed && this.world?.audioManager && !this.world.audioManager.isMuted) {
      this.world.audioManager.playSound("chickenDead");
      this.deathSoundPlayed = true;
    }

    setTimeout(() => {
      this.IMAGES_DEAD = [];
    }, 500);
  }

  animate() {
    this.moveIntervalId = setInterval(() => {
      this.moveChicken();
    }, 1000 / 60);

    this.animationIntervalId = setInterval(() => {
      this.chickenAnimation();
    }, 200);
  }

  stopChickenMiniIntervals() {
    clearInterval(this.moveIntervalId);
    clearInterval(this.animationIntervalId);
    this.moveIntervalId = null;
    this.animationIntervalId = null;
    console.log("ChickenMini-Intervalle gestoppt.");
  }
}
