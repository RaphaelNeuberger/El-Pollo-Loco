const level1 = new Level(
  [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new ChickenSmall(),
    new Endboss(),
  ],

  [new Cloud()],
  [
    new BackgroundObject("img/5_background/layers/air.png", -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
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
  // Coins - verteilt in Clustern über das Level (10 Coins = 100%)
  [
    // Cluster 1: Am Anfang (3 Coins)
    new Coin(300),
    new Coin(360),
    new Coin(420),

    // Cluster 2: Mitte-Links (3 Coins)
    new Coin(800),
    new Coin(880),
    new Coin(960),

    // Cluster 3: Mitte-Rechts (2 Coins)
    new Coin(1400),
    new Coin(1500),

    // Cluster 4: Ende (2 Coins)
    new Coin(1900),
    new Coin(2000),
  ],
  // Bottles - gleichmäßig einzeln verteilt (10 Bottles = 100%)
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
