/**
 * Represents a throwable object in the game, like a bottle.
 * Inherits physical properties and drawing capabilities from MovableObject.
 * Handles its own movement, animation, and reaction to impacts (ground or target).
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    world; // <-- NEUE PROPERTY: Speichert die World-Instanz
    damage = 20;
    isColliding = false;
    direction = 1;
    isSplashed = false;
    groundLevel = 355; // Annahme: Boden-Y-Koordinate

    IMAGES_ROTATION = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    moveIntervalId = null;
    logicIntervalId = null;


    /**
     * Initializes a new ThrowableObject instance.
     * Loads images, sets initial position, size, speed, and starts the throw process.
     * @constructor
     * @param {World} world - The World instance this object belongs to. <-- Empfängt die World-Instanz
     * @param {number} x - Initial x-coordinate.
     * @param {number} y - Initial y-coordinate.
     * @param {boolean} otherDirection - Throw direction.
     */
    constructor(world, x, y, otherDirection) { // <-- Empfängt world als ersten Parameter
        super(); // Wichtig: super() zuerst aufrufen
        this.world = world; // <-- WORLD-INSTANZ HIER SPEICHERN

        // Bilder laden NACHDEM super() und this.world gesetzt sind
        this.loadImage('img/img/6_salsa_bottle/salsa_bottle.png'); // Initiales Bild
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        // Dimensionen und Startposition setzen
        this.x = x;
        this.y = y;
        this.height = 80; // Passe dies an die tatsächliche Flaschengröße an
        this.width = 80;  // Passe dies an die tatsächliche Flaschengröße an

        this.speedY = 20; // Anfangsgeschwindigkeit für Bogenwurf
        this.direction = otherDirection ? -1 : 1; // Wurfrichtung
        this.speed = 10; // Horizontale Geschwindigkeit

        // Optional: Passe Offset für Kollision genauer an, falls nötig
        // this.offset = { top: 10, right: 10, bottom: 10, left: 10 }; // Beispiel

        this.throw(); // Starte Bewegung und Logik-Interval
        // applyGravity() wird in throw() aufgerufen
    }

    /**
     * Starts bottle movement and logic intervals.
     * @method
     */
    throw() {
        this.applyGravity(); // Startet den Gravitationseffekt (von MovableObject)

        this.moveIntervalId = setInterval(() => {
            if (!this.isSplashed) { // Nur bewegen, wenn noch nicht zerplatzt
                this.x += this.speed * this.direction;
            }
        }, 1000 / 40); // Horizontale Bewegung z.B. 40 FPS

        this.logicIntervalId = setInterval(() => {
            this.update(); // Ruft die update Methode in jedem Tick auf
        }, 1000 / 60); // Logik/Update Frequenz z.B. 60 FPS (kann auch 20 wie vorher sein)
    }

    /**
     * Updates bottle state, checks for hits, plays animation.
     * @method
     */
    update() {
        // Prüfe auf Aufprall (Boden oder Ziel), wenn Flasche noch nicht zerplatzt ist
        // Die Bedingung prüft: Am Boden ODER Kollisions-Flag ist gesetzt.
        if (!this.isSplashed && ((this.y >= this.groundLevel && this.speedY <= 0) || this.isColliding)) {
            // console.log(`LOG: Bottle detected hit. isColliding=${this.isColliding}, y=${this.y}, speedY=${this.speedY}, groundLevel=${this.groundLevel}`); // Log
            // Differentiere zwischen Ziel-Treffer (Gegner/Endboss) und Boden-Treffer
            if (this.isColliding) { // isColliding wird vom CollisionManager gesetzt
                this.onTargetHit(); // Flasche trifft Ziel
            } else { // Nicht isColliding, aber am Boden -> Flasche trifft Boden
                this.onGroundHit(); // Flasche trifft Boden
            }
        }

        // Spiele Animation basierend auf dem Zustand
        if (this.isSplashed) {
            // Spiele die Zerplatzen-Animation
            this.playAnimation(this.IMAGES_SPLASH);
        } else {
            // Spiele die Rotations-Animation im Flug
            this.playAnimation(this.IMAGES_ROTATION);
        }
    }


// In throwable_object.class.js, innerhalb der Klasse ThrowableObject

    // ... Methode update() ...

    /**
     * Handles bottle hitting the ground.
     * @method
     */
    onGroundHit() {
        // console.log('LOG: Bottle onGroundHit() called. Splashing.');
        this.isSplashed = true; // Setze Zustand auf zerplatzt

        // Stoppe sofort Bewegung und Gravitation
        this.speedY = 0;
        this.speed = 0;
        this.y = this.groundLevel; // Position exakt auf Bodenhöhe
        super.stopGravity(); // <-- Stopfe nur die Gravitation sofort

        // Das Stoppen der Intervalle erfolgt nun im setTimeout!
        // this.stopThrowableObjectIntervals(); // <-- DIESE ZEILE HIER ENTFERNEN!


        // Spiele Sound für Boden-Treffer
        if (this.world?.audioManager && typeof this.world.audioManager.playSound === 'function') {
             this.world.audioManager.playSound('bottle_hit'); // Annahme: 'bottle_hit' Sound
        }

        // Plane die Entfernung der Flasche nach Dauer der Splash-Animation
        const splashDuration = 500; // Dauer in ms
        setTimeout(() => {
            // --- NEU: Stoppe die Intervalle jetzt, kurz vor der Entfernung ---
            if (this.moveIntervalId) clearInterval(this.moveIntervalId); // Horizontale Bewegung
            if (this.logicIntervalId) clearInterval(this.logicIntervalId); // <-- UPDATE() INTERVAL STOPPEN!
            this.moveIntervalId = null;
            this.logicIntervalId = null;
            // super.stopGravity() wurde schon vorher gestoppt

            // Entferne die Flasche aus der World-Liste
            if (this.world?.throwableObjects && Array.isArray(this.world.throwableObjects)) {
                 const index = this.world.throwableObjects.indexOf(this);
                 if (index > -1) {
                      this.world.throwableObjects.splice(index, 1);
                      // console.log('LOG: Bottle removed after ground hit splash timeout.');
                 }
            }
        }, splashDuration);
    }

    /**
     * Handles bottle hitting a target.
     * @method
     */
    onTargetHit() {
         // console.log('LOG: Bottle onTargetHit() called. Splashing.');
        this.isSplashed = true; // Setze Zustand auf zerplatzt
        this.speedY = 0;
        this.speed = 0;
         super.stopGravity(); // <-- Stoppe nur die Gravitation sofort

         // Das Stoppen der Intervalle erfolgt nun im setTimeout!
         // this.stopThrowableObjectIntervals(); // <-- DIESE ZEILE HIER ENTFERNEN!


         // Spiele Sound für Ziel-Treffer
         if (this.world?.audioManager && typeof this.world.audioManager.playSound === 'function') {
             this.world.audioManager.playSound('bottle_hit'); // Annahme: 'bottle_hit' Sound
         }

         // Plane die Entfernung der Flasche nach Dauer der Splash-Animation
         const splashDuration = 500; // Dauer in ms
         setTimeout(() => {
             // --- NEU: Stoppe die Intervalle jetzt, kurz vor der Entfernung ---
             if (this.moveIntervalId) clearInterval(this.moveIntervalId); // Horizontale Bewegung
             if (this.logicIntervalId) clearInterval(this.logicIntervalId); // <-- UPDATE() INTERVAL STOPPEN!
             this.moveIntervalId = null;
             this.logicIntervalId = null;
             // super.stopGravity() wurde schon vorher gestoppt

             // Entferne die Flasche aus der World-Liste
             if (this.world?.throwableObjects && Array.isArray(this.world.throwableObjects)) {
                  const index = this.world.throwableObjects.indexOf(this);
                  if (index > -1) {
                       this.world.throwableObjects.splice(index, 1);
                       // console.log('LOG: Bottle removed after target hit splash timeout.');
                  }
             }
         }, splashDuration);
     }

    // ... Methode stopThrowableObjectIntervals() (wird jetzt nicht mehr von on...Hit aufgerufen, aber kann an anderen Stellen nützlich sein) ...
    // Du kannst die Methode stopThrowableObjectIntervals() behalten, aber entferne die Aufrufe aus onGroundHit() und onTargetHit().


    /**
     * Stops all intervals.
     * @method
     */
    stopThrowableObjectIntervals() {
         // console.log('LOG: stopThrowableObjectIntervals() called.');
         if (this.moveIntervalId) clearInterval(this.moveIntervalId);
         if (this.logicIntervalId) clearInterval(this.logicIntervalId);
         this.moveIntervalId = null;
         this.logicIntervalId = null;
         super.stopGravity(); // Stoppe das Gravity-Interval (von MovableObject geerbt)
         // console.log('ThrowableObject intervals stopped.');
     }

    // isAboveGround() Methode ist von MovableObject geerbt.
    // playAnimation() Methode ist von MovableObject/DrawableObject geerbt.
    // applyGravity() Methode ist von MovableObject geerbt.
    // stopGravity() Methode ist von MovableObject geerbt.
    }