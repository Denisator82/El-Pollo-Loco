class Level {
    // endboss = [];
    enemies = [];
    clouds = [];
    coins = [];
    bottles = [];
    backgroundObjects = [];
    level_end_x = 3600; // Level Ende

    constructor(enemies = [], clouds = [], backgroundObjects = [], coins = [], bottles = []){
        // this.endboss = endboss;
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}