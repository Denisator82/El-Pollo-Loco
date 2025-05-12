/**
* Represents a movable object in the game.
* Inherits from DrawableObject and includes properties for speed, direction,
* vertical speed, acceleration, energy, and collision status.
*/
class MovableObject extends DrawableObject {
    speed = 0.55; // Horizontal movement speed
    otherDirection = false; // Indicates if the object is moving in the opposite direction
    speedY = 0; // Vertikale Geschwindigkeit, Startwert sollte meist 0 sein
    acceleration = 2.5; // Acceleration for gravity (ein bisschen höher für realistischere Schwerkraft)
    energy = 100; // Energy level of the object
    lastHit = 0; // Timestamp of the last hit
    standingTime = 0; // Time the object has been standing still
    sleepDelay = 6000; // Delay before the object goes to sleep
    groundLevel = 175; // Y-coordinate for the ground level (Stelle sicher, dass dies zum Level passt)
    gravityFrameId = null;

    /**
    * Constructor for MovableObject.
    * Sets default values or calls initialization methods.
    */
    constructor() {
        super(); // Rufe den Constructor der Elternklasse auf
        // Rufe applyGravity() hier auf, wenn das Objekt sofort der Schwerkraft unterliegen soll
        // Dies ist oft für den Charakter und Gegner der Fall, aber nicht für Wolken oder sammelbare Objekte
        // this.applyGravity(); // <-- Starte Schwerkraft hier, falls für alle MovableObjects nötig
    }


    /**
    * Simulates gravity by continuously adjusting the object's vertical position.
    * Uses requestAnimationFrame for smooth animation.
    * The loop continues as long as the object is above the ground or moving upwards.
    * 
    */
    applyGravity() {
        // Nur starten, wenn Schwerkraft noch NICHT aktiv ist
        if (this.gravityFrameId !== null) {
            // console.warn('LOG: applyGravity called, but gravityFrameId is not null for', this.constructor.name); // Optionaler Log
            return; // Verhindert das Starten mehrerer Loops
        }

        // console.log('LOG: Gravity started for', this.constructor.name); // Optionaler Log zum Start

        const gravityEffect = () => {
            // Die Schwerkraft wirkt, solange das Objekt ÜBER dem Boden ist ODER (am Boden/unter Boden UND sich nach oben bewegt).
            // Die isAboveGround() Methode wird jetzt für ALLE Objekte einheitlich gehandhabt (s.u.).
            if (this.isAboveGround() || (this.y <= this.groundLevel && this.speedY > 0)) {
                this.y -= this.speedY; // Position anpassen (speedY ist negativ beim Fallen)
                this.speedY -= this.acceleration; // Geschwindigkeit anpassen (Schwerkraft zieht nach unten, also speedY wird negativer)
                this.speedY = Math.max(this.speedY, -30); // Fallgeschwindigkeit begrenzen (z.B. auf max 30 Pixel/Frame, 20 war eventuell zu wenig)

                // *** Schedule the next frame ***
                // Rufe gravityEffect() rekursiv für den nächsten Frame auf und speichere die ID
                this.gravityFrameId = requestAnimationFrame(gravityEffect); // <-- Speichere die neue ID

            } else {
                // Wenn auf dem Boden (und speedY <= 0)
                // Stelle sicher, dass die Position GENAU auf dem Boden ist, um Untersinken zu verhindern
                this.y = this.groundLevel;
                this.speedY = 0; // Vertikale Geschwindigkeit auf 0 setzen

                // *** Stop the gravity loop when landed ***
                this.stopGravity(); // Rufe die stopGravity Methode auf (setzt gravityFrameId = null)
                // console.log('LOG: Gravity gestoppt: Landung auf Boden für', this.constructor.name); // Optionaler Log zur Landung

                // Kein rekursiver Aufruf hier, die Schleife stoppt
            }
        };

        // *** Start the initial loop and store the ID ***
        this.gravityFrameId = requestAnimationFrame(gravityEffect); // <-- Speichere die initiale ID
    }


    /**
    * Checks if the object is currently above the ground level.
    * This check is uniform for all MovableObjects subject to gravity.
    * @returns {boolean} - True if the object's bottom is above or at the ground level (considering speedY), otherwise false.
    * 
    */
    isAboveGround() {
        // Ein Objekt ist über dem Boden, wenn:
        // 1. Seine Y-Position (untere Kante) oberhalb des Boden-Levels ist (this.y < this.groundLevel).
        // 2. ODER wenn es sich gerade nach oben bewegt (this.speedY > 0), selbst wenn Y schon unter groundLevel ist (z.B. beim Springen vom Boden).
        // Die spezielle Logik für ThrowableObject (return !this.isColliding;) wird ENTFERNT, da sie Probleme verursacht hat.
        return this.y < this.groundLevel || this.speedY > 0;
    }

    /**
     * Checks if this object is colliding with another movable object, considering offsets.
     * Adds safety checks for missing offset properties.
     * @param {MovableObject} mo - The other movable object to check for collision.
     * @returns {boolean} - True if the objects' bounding boxes overlap, otherwise false.
     * 
     */
    isColliding(mo) {
        // Füge Sicherheitsprüfungen hinzu, ob die Objekte und ihre offset-Properties existieren
        // Wenn nicht, können sie nicht kollidieren (oder es wäre ein Fehler, hier false zurückzugeben ist sicherer als Absturz)
        if (!this || !mo) {
            // console.warn('LOG: isColliding called with null/undefined object.');
            return false;
        }

        // Stelle sicher, dass beide Objekte die offset-Property haben
        // Füge Standard-Offsets von 0 hinzu, wenn offset oder die spezifischen Richtungen fehlen
        const thisOffset = this.offset || {}; // Nutze {} wenn offset undefined ist
        const otherOffset = mo.offset || {}; // Nutze {} wenn offset undefined ist

        // Stelle sicher, dass die einzelnen Richtungen im offset-Objekt existieren, Standard 0
        const thisOffsetX = thisOffset.left || 0;
        const thisOffsetY = thisOffset.top || 0;
        const thisOffsetRight = thisOffset.right || 0;
        const thisOffsetBottom = thisOffset.bottom || 0;

        const otherOffsetX = otherOffset.left || 0;
        const otherOffsetY = otherOffset.top || 0;
        const otherOffsetRight = otherOffset.right || 0;
        const otherOffsetBottom = otherOffset.bottom || 0;


        // Log für Debugging: Zeige die Kollisionsrechtecke, die verglichen werden
        /*
        console.log(
            `Coll Check: ${this.constructor.name}[${this.x + thisOffsetX}, ${this.y + thisOffsetY}, ${this.x + this.width - thisOffsetRight}, ${this.y + this.height - thisOffsetBottom}] ` +
            `vs ${mo.constructor.name}[${mo.x + otherOffsetX}, ${mo.y + otherOffsetY}, ${mo.x + mo.width - otherOffsetRight}, ${mo.y + mo.height - otherOffsetBottom}]`
        );
        */


        // Kollisionslogik mit Berücksichtigung der Offsets und Sicherheitsprüfungen
        // Überlappung AABB (Axis-Aligned Bounding Box)
        const collision =
            this.x + this.width - thisOffsetRight > mo.x + otherOffsetX && // Rechte Kante dieses Objekts > Linke Kante des anderen Objekts
            this.y + this.height - thisOffsetBottom > mo.y + otherOffsetY && // Untere Kante dieses Objekts > Obere Kante des anderen Objekts
            this.x + thisOffsetX < mo.x + mo.width - otherOffsetRight && // Linke Kante dieses Objekts < Rechte Kante des anderen Objekts
            this.y + thisOffsetY < mo.y + mo.height - otherOffsetBottom; // Obere Kante dieses Objekts < Untere Kante des anderen Objekts

        // Optional: Log das Ergebnis der Kollisionsprüfung, wenn eine Kollision erkannt wurde
        // if (collision) {
        //     console.log(`LOG: Collision detected between ${this.constructor.name} and ${mo.constructor.name}!`);
        // }

        return collision; // Gibt true zurück, wenn sich die bereinigten Rechtecke überlappen
    }


    /**
     * Plays the animation by cycling through a list of images.
     * Calculates the index of the current image using the modulus operator.
     * Sets the current image based on the calculated index and updates the image cache.
     * Increments the current image index for the next animation frame.
     *
     * @param {Array} images - An array of image paths to be used in the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
      * Stops the recursive requestAnimationFrame loop for gravity.
      * <-- HINZUGEFÜGT/KORRIGIERT -->
      */
    stopGravity() {
        if (this.gravityFrameId !== null) {
            cancelAnimationFrame(this.gravityFrameId);
            this.gravityFrameId = null;
            // console.log('LOG: Gravity gestoppt für:', this.constructor.name); // Optionaler Log
        }
    }

    // Methode moveLeft() gehört in MovableObject, wenn sie generisch ist.
    moveLeft() {
        this.x -= this.speed;
    }
    // Füge moveRight() hinzu, wenn du es brauchst
    moveRight() {
        this.x += this.speed;
    }

}