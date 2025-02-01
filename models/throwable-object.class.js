class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    constructor(x, y) {
        super().loadImage('img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw();
        // this.animateRotation();
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval( () => {
            this.x += 10;
        }, 25);
    }

    // animateRotation() {
    //     setInterval(() => {
    //         this.playAnimation(this.IMAGES_ROTATION);
    //     }, 100);
    // }

    // animateSplash(){
    //     this.
    // }
    // applyGravity() {
    //     setInterval(() => {
    //         if (this.y < 360) { // Anpassen der Bodenhöhe nach Bedarf
    //             this.y += this.speedY;
    //             this.speedY -= 1;
    //         } else {
    //             this.y = 360; // Flasche am Boden positionieren
    //             this.speedY = 0;
    //             this.playSplashAnimation();
    //             clearInterval(this.intervalId); // Stoppt das horizontale Bewegen
    //             clearInterval(this.rotationIntervalId); // Stoppt das Rotieren
    //         }
    //     }, 25);
    // }

    // playSplashAnimation() {
    //     this.splashIntervalId = setInterval(() => {
    //         this.playAnimation(this.IMAGES_SPLASH);
    //         clearInterval(this.splashIntervalId); // Stoppt die Splash-Animation nach einmaligem Abspielen
    //     }, 100);
    // }
}