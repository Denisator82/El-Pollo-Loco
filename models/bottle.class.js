class Bottle extends MovableObject {
    width = 80;
    height = 80;
    y = 350;
    

    IMAGES = [
        'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.offset = { top: 10, right: 15, bottom: 0, left: 20 }; // Beispiel-Offset
        this.x = 200 + Math.random() * 1800;
    }

}