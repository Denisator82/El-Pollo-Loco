class Coin extends MovableObject {
    width = 120;
    height = 120;
    collected = false; //Stautus der Münze

    IMAGES = [
        'img/img_pollo_locco/img/8_coin/coin_1.png',
        'img/img_pollo_locco/img/8_coin/coin_2.png',
    ];

    constructor() {
        super() // Initialisiere die Elternklasse
        this.loadImage(this.IMAGES[0]); //Lade das erste Bild
        this.loadImages(this.IMAGES); //Lade alle Bilder in den Speicher
        this.offset = { top: 40, right: 40, bottom: 40, left: 40 }; // Offset
        this.x = 200 + Math.random() * 1800;
        this.y = 160 + Math.random() * 120;
        this.animate(); //Startet die animation
    };

    //coins einsammeln
    coinCollected() {
        if (this.collected){
            this.loadImage(''); // Lade ein leeres Bild
            this.width = 0;
            this.height = 0;
        }
    }

    //bild animation Coin
    coinAnimation() {
        if(!this.collected) {
            this.playAnimation(this.IMAGES);
        }
    }

    //Hauptanimation 
    animate() {
        setInterval(() => {
            this.coinCollected();
            this.coinAnimation();
        }, 200);
    }

}