class Coin extends MoveableObject {

    width = 120;
    height = 120;

    IMAGES = [
        'img/img_pollo_locco/img/8_coin/coin_1.png',
        'img/img_pollo_locco/img/8_coin/coin_2.png',
    ];

    constructor() {
        super().loadImage('img/img_pollo_locco/img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES);
        this.x = 400 + Math.random() * 1500;
        this.y = 100 + Math.random() * 100;
    }

}