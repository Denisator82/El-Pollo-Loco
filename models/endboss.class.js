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
        this.x = 2800;
        
        //new Attribute
        this.lastHitEndboss = 0;

        // Start the animation method
        this.animate();    
    }

    /**
     * drains energy from the target
     * 
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
     * 
     * @returns if the last hit was 1 second ago or not
     */
    isHurtEndboss() {
        return (Date.now() - this.lastHitEndboss) / 1000 < 1;
    }

    // //Alternative:
    // isHurtEndboss() {
    //     let timepassed = new Date().getTime() - this.lastHitEndboss;
    //     timepassed = timepassed / 1000;
    //     return timepassed < 1;
    // }
    
    /**
     * 
     * @returns if the energy is 0 
     */
    isDeadEndboss() {
        return this.health == 0;
    }    

    // /**
    //  * animation of the end boss
    //  * 
    //  */
    // endbossAnimation() {
    //     if (this.isDeadEndboss()) {
    //         this.endbossAnimationDead();
    //     }
    //     else if (this.isHurtEndboss()) {
    //         this.endbossAnimationHurt();
    //     }        
    //     else if (this.i < 15) {
    //         this.endbossAnimationAlert();
    //         this.showStatusBar();
    //     }
    //     else if (this.i < 30) {
    //         this.endbossAnimationAttack();
    //     }
    //     else {        
    //         this.endbossAnimationWalk();
    //     }
    //     this.i++;    
    //     this.endbossFirstContact();   
    // }

    endbossAnimation() {
        if (!this.hadFirstContact) return; // Endboss bleibt inaktiv, bis First Contact passiert
        
        if (this.isDeadEndboss()) {
            this.endbossAnimationDead();
        }
        else if (this.isHurtEndboss()) {
            this.endbossAnimationHurt();
        }        
        else if (this.i < this.IMAGES_ALERT.length) { 
            this.endbossAnimationAlert();
        }
        else if (this.i === this.IMAGES_ALERT.length) {
            this.showStatusBar(); // Statusbar wird erst nach Alert angezeigt
        }
        else if (this.i < this.IMAGES_ALERT.length + this.IMAGES_ATTACK.length) {
            this.endbossAnimationAttack();
        }
        else {        
            this.endbossAnimationWalk();
        }
        this.i++;   
    }
    
    

    /**
     * animation at death
     * 
     */
    endbossAnimationDead() {
        this.playAnimation(this.IMAGES_DEAD);
        world.gameOver = true;
        world.background_music.pause()
    }


    /**
     * animation at hurt
     * 
     */
    endbossAnimationHurt() {
        this.playAnimation(this.IMAGES_HURT);
    }

    /**
     * animation at alert
     * 
     */
    endbossAnimationAlert() {
        this.playAnimation(this.IMAGES_ALERT); 
    }

    /**
     * animation at attack
     * 
     */
    endbossAnimationAttack() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    /**
     * animation at walking
     * 
     */
    endbossAnimationWalk() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * checks if the character had first contact with the end boss
     * 
     */
    endbossFirstContact() {
        if (world.character.x > this.x - 400 && !this.hadFirstContact) { 
            this.i = 0; // Zurücksetzen des Animationszählers
            this.hadFirstContact = true;
        }
    }
    

    /**
     * animates the endboss
     * 
     */
    // animate() {
    //     setInterval(() => {
    //         this.endbossAnimation();            
    //     }, 200);
    //     setInterval(() => {
    //         if (this.hadFirstContact && this.i > 30 && !this.isDeadEndboss() && !this.isHurtEndboss()) {
    //             this.x -= this.speed;    
    //         }        
    //     }, 1000 / 60);
    //     setInterval(() => {
    //         if (this.isHurtEndboss()) {
    //         }
    //     }, 100);
    // }

    animate() {
        setInterval(() => {
            this.endbossFirstContact(); // Prüft regelmäßig den First Contact
            if (this.hadFirstContact) {
                this.endbossAnimation(); // Startet Animation erst nach First Contact
            }
        }, 200);
    
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

    // /**
    //  * Animates the character by playing different animations 
    //  * based on the value of the counter i and specific conditions.
    //  */
    // animate() {
    //     let i = 0;
    //     // Calls the function every 500 milliseconds
    //     setInterval(() => {
    //         if(i < 10) {
    //             // Plays the alert animation when i is less than 10
    //             this.playAnimation(this.IMAGES_ALERT);
    //         } else if (i === 10) { 
    //             // Displays the status bar when i equals 10
    //             this.showStatusBar();
    //         } else if (i < 20) {
    //             // Plays the attack animation when i is between 11 and 29
    //             this.playAnimation(this.IMAGES_ATTACK);
    //         } else {
    //             // Plays the walking animation when i is 30 or greater
    //             // and decreases the x position by the speed
    //             this.playAnimation(this.IMAGES_WALKING);
    //             this.x -= this.speed;
    //         }
    //         // Increments the counter i by 1 in each iteration
    //         i++;

    //         // Resets the counter i to 0 and marks the first contact 
    //         // as true when the character's x position is greater than 1500 
    //         // and the first contact has not occurred
    //         if(world.character.x > 1450 && !this.hadFirstContact) {// Für Test auf 400 gesetzt
    //             i = 0;
    //             this.hadFirstContact = true;
    //         }
    //     }, 500);
    // }
