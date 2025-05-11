/**
 * Declares the global variable for the first level of the game.
 * @type {Level} level1 - The first level instance of the game.
 */
let level1;

/**
 * Initializes the first level (level1) with arrays of game objects.
 * @type {Level} level1 - The first level instance of the game.
 * Includes arrays for the endboss/enemies, clouds, background objects, coins, and bottles.
 */
function initLevel() {
    level1 = new Level(
        [ // <-- Dieses Array wird wahrscheinlich this.level.endbosses zugewiesen (oder ignoriert, je nach Level Constructor)
            // Lasse es leer ODER entferne den Parameter, wenn dein Level Constructor ihn nicht für die Hauptgegner-Logik braucht.
            // Oder setze hier die Endboss-Instanz NUR hin, wenn dein Level Constructor explizit eine separate Liste für den Boss hat UND deine World.setWorld Methode BEIDE Listen iteriert.
            // ABER da World.setWorld nur enemies iteriert, MUSS der Boss in der enemies Liste sein, damit World die Referenz setzen kann.
            // Daher: Endboss aus diesem Array entfernen oder dieses Array weglassen, wenn es nur für den Boss gedacht war und die World es nicht nutzt.
        ],
        [ // <-- DIES IST DAS ZWEITE ARRAY, das an den Level Constructor übergeben wird.
          // Dieses Array wird in deiner World.class.js als `this.level.enemies` verwendet!
            new Endboss(), // <--- *** VERSCHIEBE DEN ENDBOSS HIERHER! ***
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new ChickenMini(),
            new ChickenMini(),
            new ChickenMini(),
            new ChickenMini(),
        ],
        [ // Arrays für Clouds, Background Objects, Coins und Bottles bleiben wie gehabt
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
        ],
        [
             new BackgroundObject('img/img/5_background/layers/air.png', -719),
             new BackgroundObject('img/img/5_background/layers/3_third_layer/2.png', -719),
             new BackgroundObject('img/img/5_background/layers/2_second_layer/2.png', -719),
             new BackgroundObject('img/img/5_background/layers/1_first_layer/2.png', -719),

             new BackgroundObject('img/img/5_background/layers/air.png', 0),
             new BackgroundObject('img/img/5_background/layers/3_third_layer/1.png', 0),
             new BackgroundObject('img/img/5_background/layers/2_second_layer/1.png', 0),
             new BackgroundObject('img/img/5_background/layers/1_first_layer/1.png', 0),
             new BackgroundObject('img/img/5_background/layers/air.png', 719),
             new BackgroundObject('img/img/5_background/layers/3_third_layer/2.png', 719),
             new BackgroundObject('img/img/5_background/layers/2_second_layer/2.png', 719),
             new BackgroundObject('img/img/5_background/layers/1_first_layer/2.png', 719),

             new BackgroundObject('img/img/5_background/layers/air.png', 719 * 2),
             new BackgroundObject('img/img/5_background/layers/3_third_layer/1.png', 719 * 2),
             new BackgroundObject('img/img/5_background/layers/2_second_layer/1.png', 719 * 2),
             new BackgroundObject('img/img/5_background/layers/1_first_layer/1.png', 719 * 2),
             new BackgroundObject('img/img/5_background/layers/air.png', 719 * 3),
             new BackgroundObject('img/img/5_background/layers/3_third_layer/2.png', 719 * 3),
             new BackgroundObject('img/img/5_background/layers/2_second_layer/2.png', 719 * 3),
             new BackgroundObject('img/img/5_background/layers/1_first_layer/2.png', 719 * 3),

             new BackgroundObject('img/img/5_background/layers/air.png', 719 * 4),
             new BackgroundObject('img/img/5_background/layers/3_third_layer/1.png', 719 * 4),
             new BackgroundObject('img/img/5_background/layers/2_second_layer/1.png', 719 * 4),
             new BackgroundObject('img/img/5_background/layers/1_first_layer/1.png', 719 * 4),
             new BackgroundObject('img/img/5_background/layers/air.png', 719 * 5),
             new BackgroundObject('img/img/5_background/layers/3_third_layer/2.png', 719 * 5),
             new BackgroundObject('img/img/5_background/layers/2_second_layer/2.png', 719 * 5),
             new BackgroundObject('img/img/5_background/layers/1_first_layer/2.png', 719 * 5),
        ],
        [
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
            new Coin(),
        ],
        [
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
        ]
    );
}