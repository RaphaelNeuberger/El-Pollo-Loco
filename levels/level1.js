let level1;
function initLevel() {
  level1 = new Level(
    [
      // 3 normal chickens evenly distributed up to endboss
      new Chicken(800),
      new Chicken(1400),
      new Chicken(2000),

      // 3 small chickens evenly distributed up to endboss
      new ChickenSmall(1100),
      new ChickenSmall(1700),
      new ChickenSmall(2300),

      new Endboss(),
    ],

    [new Cloud()],
    [
      new BackgroundObject("img/5_background/layers/air.png", -720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -720,
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/air.png", 720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

      new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        720 * 3,
      ),
    ],
    // Coins - distributed in clusters across the level (10 coins = 100%)
    [
      // Cluster 1: At the start (3 coins)
      new Coin(300),
      new Coin(360),
      new Coin(420),

      // Cluster 2: Middle-left (3 coins)
      new Coin(800),
      new Coin(880),
      new Coin(960),

      // Cluster 3: Middle-right (2 coins)
      new Coin(1400),
      new Coin(1500),

      // Cluster 4: End (2 coins)
      new Coin(1900),
      new Coin(2000),
    ],
    // Bottles - evenly distributed individually (10 bottles = 100%)
    [
      new Bottle(400),
      new Bottle(650),
      new Bottle(900),
      new Bottle(1100),
      new Bottle(1300),
      new Bottle(1500),
      new Bottle(1650),
      new Bottle(1800),
      new Bottle(1950),
      new Bottle(2100),
    ],
  );
}
