class EndBoss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    hadFirstContact = false;
    speed = 20;
    visible = false

    IMAGES_ALERT = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ATTACK = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor(){
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.offset = { top: 80, bottom: 30, left: 40, right: 40};
        this.x = 3900; // Platzierung vom Endboss auf der Karte
        this.animate();    
    }

    animate() {
        setInterval(() => {
            // console.log('Überprüfe CHarakterposition:', world.character.x);
            if (world.character.x > 2200 && !this.hadFirstContact) {
                this.hadFirstContact = true;
                this.startAnimation();
            }
        }, 1000 / 60); // Überprüfe kontinuierlich auf den ersten Kontakt mit dem Spieler
    }

    startAnimation() {
        let i = 0; //Variable um ZUstand der Animation zu verfolgen
        setInterval(() => {
            console.log('Animation:', i);
            if (i < 10) { // Abspielen der Alert Animation 5Sek.
                this.playAnimation(this.IMAGES_ALERT);
            } else if (i === 10) { // Statusbar Anzeigen
                this.showStatusBar();
            } else if (i < 30) { // i-Wert 20-30 Attack Animation 10sek.
                this.playAnimation(this.IMAGES_ATTACK);
            } else { // i-Wert ist 30 oder größer Walking Animation und bewegung nach links 
                this.playAnimation(this.IMAGES_WALKING);
                this.moveLeft();
            }
            i++; // Erhöhung des Wertes bei jedem Intervall
        }, 500); //Intervall 500 Millisekunden (2x pro Sekunde)
    }

    showStatusBar() {
        console.log('Statusleiste anzeigen');
        world.statusBarEndBoss.visible = true;
    }
}



