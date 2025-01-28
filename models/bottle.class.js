class Bottle extends MovableObject {
    width = 80;
    height = 80;
    

    IMAGES = [
        'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 1500 + Math.random() * 1500;
    }

}