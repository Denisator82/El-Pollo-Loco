class ChickenMini extends MovableObject {
    y = 360;
    height = 60;
    width = 60;
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor(){
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.offset = { top: 0, right: 0, bottom: 0, left: 0 }; // Offset

        this.x = 600 + Math.random() * 1800; // Zahl zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.55;
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}