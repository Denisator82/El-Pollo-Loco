/**
 * Represents the end boss in the game.
 * Inherits from MovableObject and includes properties for different states and behaviors.
 */
class Endboss extends MovableObject {
    height = 400; // Height of the end boss
    width = 250; // Width of the end boss
    y = 55; // Y-coordinate of the end boss
    i = 0;
    hadFirstContact = false; // Indicates if the first contact has occurred
    speed = 2; // Speed of the end boss
    visible = false; // Visibility status of the end boss
    health = 100; // Energy of the end boss
    world;
    endboss_music = new Audio('audio/endboss_music.mp3');

    // Images for the alert state of the end boss
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

    // Images for the walking state of the end boss
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    // Images for the attack state of the end boss
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

    // Images for the hurt state of the end boss
    IMAGES_HURT = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    // Images for the dead state of the end boss
    IMAGES_DEAD = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
     * Initializes the end boss by loading images for different states 
     * and setting the initial position.
     */
    constructor(){
        // Call the parent class constructor and load the initial alert image
        super().loadImage(this.IMAGES_ALERT[0]);

        // Load images for different states of the end boss
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        // Set the initial x-coordinate of the end boss on the map
        this.x = 3900;
        
        //new Attribute
        this.lastHitEndboss = 0;

        // Start the animation method
        this.animate();    
    }

    /**
     * Drains energy from the target by decreasing health.
     */
    hitEndboss() {
        this.health -= 10;    
        if (this.health < 0) {
            this.health = 0;
        }
        else {
            this.lastHitEndboss = new Date().getTime();
        }
    }

    /**
     * Checks if the last hit occurred within the last second.
     * 
     * @returns {boolean} True if the last hit was within 1 second, otherwise false
     */
    isHurtEndboss() {
        return (Date.now() - this.lastHitEndboss) / 1000 < 1;
    }

    
    /**
     * Checks if the end boss's health is zero.
     * 
     * @returns {boolean} True if the health is zero, otherwise false
     */
    isDeadEndboss() {
        return this.health == 0;
    }    

    /**
     * Handles the animation of the end boss based on its state.
     */
    endbossAnimation() {
        if (!this.hadFirstContact) return; // End boss remains inactive until first contact occurs
        
        if (this.isDeadEndboss()) {
            this.endbossAnimationDead();
        } else if (this.isHurtEndboss()) {
            this.endbossAnimationHurt();
        } else if (this.i < this.IMAGES_ALERT.length) { 
            this.endbossAnimationAlert();
        } else if (this.i === this.IMAGES_ALERT.length) {
            this.showStatusBar(); // Status bar is shown after alert
        } else if (this.i < this.IMAGES_ALERT.length + this.IMAGES_ATTACK.length) {
            this.endbossAnimationAttack();
        } else {        
            this.endbossAnimationWalk();
            // this.endboss_music.play(); 
        }
        this.i++;
    }
    
    

    /**
     * Handles the animation when the end boss is dead.
     */
    endbossAnimationDead() {
        this.playAnimation(this.IMAGES_DEAD);
        world.gameOver = true;
        world.background_music.pause();
    }

    /**
     * Handles the animation when the end boss is hurt.
     */
    endbossAnimationHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }

    /**
     * Handles the animation when the end boss is on alert.
     */
    endbossAnimationAlert() {
        this.playAnimation(this.IMAGES_ALERT); 
    }

    /**
     * Handles the animation when the end boss is attacking.
     */
    endbossAnimationAttack() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    /**
     * Handles the animation when the end boss is walking.
     */
    endbossAnimationWalk() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Checks if the character had the first contact with the end boss.
     */
    endbossFirstContact() {
        if (world.character.x > this.x - 400 && !this.hadFirstContact) { 
            this.i = 0; // Zurücksetzen des Animationszählers
            this.hadFirstContact = true;
        }
    }

    /**
     * Starts the animations and movements of the end boss.
     */
    animate() {
        setInterval(() => {
            this.endbossFirstContact(); // Prüft regelmäßig den First Contact
            if (this.hadFirstContact) {
                this.endbossAnimation(); // Startet Animation erst nach First Contact
            }
        }, 500);
    
        setInterval(() => {
            if (this.hadFirstContact && this.i > this.IMAGES_ALERT.length + this.IMAGES_ATTACK.length && !this.isDeadEndboss() && !this.isHurtEndboss()) {
                this.x -= this.speed; // Endboss bewegt sich nach dem Alarm und Attack
            }        
        }, 1000 / 60);
    }
    

    /**
     * Shows the status bar for the end boss.
     * Makes the status bar of the end boss visible.
     */
    showStatusBar() {
        world.statusBarEndboss.visible = true;
    }
}