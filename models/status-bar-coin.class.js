class StatusBarCoin extends DrawableObject {

    IMAGES = [
        'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
    ];

    percentage = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 45;
        this.width = 200;
        this.height = 50;
        this.setPercentage(0);
    }
    
    setPercentage(percentage) {
        this.percentage = percentage; // => 0 ... 5
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    
    //Zählung von 0 bis 100%
    resolveImageIndex(){
        if(this.percentage == 0) {
            return 0;
        } else if (this.percentage > 20) {
            return 1;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 80) {
            return 4;
        } else {
            return 5;
        }
    }
}