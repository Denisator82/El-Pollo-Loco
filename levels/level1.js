let level1;

// function initLevel() {

    level1 = new Level(
        [
            new Endboss()
        ],
        [
            new Chicken(),
            // new Chicken(),
            // new Chicken(),
            // new Chicken(),
            new ChickenMini(),
            // new ChickenMini(),
            // new ChickenMini(),
            // new ChickenMini(),
        ],
        [
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
        ],
        [
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png', -719),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png', -719),

            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png',0),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png',719),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 719),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 719),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 719),

            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png', 719*2),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 719*2),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 719*2),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 719*2),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png', 719*3),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 719*3),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 719*3),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 719*3),

            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png', 719*4),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 719*4),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 719*4),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 719*4),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png', 719*5),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 719*5),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 719*5),
            new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 719*5),
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
        ],
    );
// }