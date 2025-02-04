/**
 * Represents a level in the game.
 * Initializes arrays for different game objects including endboss, enemies, clouds,
 * coins, bottles, and background objects. Sets the x-coordinate for the end of the level.
 */
class Level {
    endboss = [];
    enemies = [];
    clouds = [];
    coins = [];
    bottles = [];
    backgroundObjects = [];
    level_end_x = 3600; // Level Ende

    /**
     * Initializes the Level class.
     * Sets up the level with arrays of game objects including endboss, enemies, clouds,
     * background objects, coins, and bottles.
     * 
     * @param {Array} endboss - Array of endboss objects.
     * @param {Array} enemies - Array of enemy objects.
     * @param {Array} clouds - Array of cloud objects.
     * @param {Array} backgroundObjects - Array of background objects.
     * @param {Array} coins - Array of coin objects.
     * @param {Array} bottles - Array of bottle objects.
     */
    constructor(endboss = [], enemies = [], clouds = [], backgroundObjects = [], coins = [], bottles = []) {
        this.endboss = endboss;
        this.coins = coins;
        this.bottles = bottles;
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}