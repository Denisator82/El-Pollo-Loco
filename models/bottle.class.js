class Bottle extends MoveableObject {
    
    width = 80;
    height = 80;

    IMAGES = [
        'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.loadImages(this.IMAGES);
        this.x = 400 + Math.random() * 1500;
    }

}