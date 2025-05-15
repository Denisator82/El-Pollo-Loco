/**
 * Declares the global variable for the first level of the game.
 * This will be initialized via `initLevel()`.
 * @type {Level}
 */
let level1;

/**
 * Initializes the first level of the game with all required game elements.
 *
 * This includes:
 * - An array of enemies (Endboss, Chickens, ChickenMinis)
 * - Background objects for the parallax scrolling effect
 * - Clouds for atmospheric effect
 * - Collectible coins and bottles
 *
 * The level is assigned to the global variable `level1`.
 */
function initLevel() {
  level1 = new Level(
    [], // Enemies for flying enemies (left empty for now)
    [
      new Endboss(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new ChickenMini(),
      new ChickenMini(),
      new ChickenMini(),
      new ChickenMini(),
    ],
    [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()],
    [
      new BackgroundObject("img/img/5_background/layers/air.png", -719),
      new BackgroundObject(
        "img/img/5_background/layers/3_third_layer/2.png",
        -719
      ),
      new BackgroundObject(
        "img/img/5_background/layers/2_second_layer/2.png",
        -719
      ),
      new BackgroundObject(
        "img/img/5_background/layers/1_first_layer/2.png",
        -719
      ),

      new BackgroundObject("img/img/5_background/layers/air.png", 0),
      new BackgroundObject(
        "img/img/5_background/layers/3_third_layer/1.png",
        0
      ),
      new BackgroundObject(
        "img/img/5_background/layers/2_second_layer/1.png",
        0
      ),
      new BackgroundObject(
        "img/img/5_background/layers/1_first_layer/1.png",
        0
      ),
      new BackgroundObject("img/img/5_background/layers/air.png", 719),
      new BackgroundObject(
        "img/img/5_background/layers/3_third_layer/2.png",
        719
      ),
      new BackgroundObject(
        "img/img/5_background/layers/2_second_layer/2.png",
        719
      ),
      new BackgroundObject(
        "img/img/5_background/layers/1_first_layer/2.png",
        719
      ),

      new BackgroundObject("img/img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject(
        "img/img/5_background/layers/3_third_layer/1.png",
        719 * 2
      ),
      new BackgroundObject(
        "img/img/5_background/layers/2_second_layer/1.png",
        719 * 2
      ),
      new BackgroundObject(
        "img/img/5_background/layers/1_first_layer/1.png",
        719 * 2
      ),
      new BackgroundObject("img/img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject(
        "img/img/5_background/layers/3_third_layer/2.png",
        719 * 3
      ),
      new BackgroundObject(
        "img/img/5_background/layers/2_second_layer/2.png",
        719 * 3
      ),
      new BackgroundObject(
        "img/img/5_background/layers/1_first_layer/2.png",
        719 * 3
      ),

      new BackgroundObject("img/img/5_background/layers/air.png", 719 * 4),
      new BackgroundObject(
        "img/img/5_background/layers/3_third_layer/1.png",
        719 * 4
      ),
      new BackgroundObject(
        "img/img/5_background/layers/2_second_layer/1.png",
        719 * 4
      ),
      new BackgroundObject(
        "img/img/5_background/layers/1_first_layer/1.png",
        719 * 4
      ),
      new BackgroundObject("img/img/5_background/layers/air.png", 719 * 5),
      new BackgroundObject(
        "img/img/5_background/layers/3_third_layer/2.png",
        719 * 5
      ),
      new BackgroundObject(
        "img/img/5_background/layers/2_second_layer/2.png",
        719 * 5
      ),
      new BackgroundObject(
        "img/img/5_background/layers/1_first_layer/2.png",
        719 * 5
      ),
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
    ]
  );
}
