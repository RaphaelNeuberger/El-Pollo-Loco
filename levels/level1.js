let level1;

function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles(),
  );
}

function createEnemies() {
  return [
    new Chicken(800),
    new Chicken(1400),
    new Chicken(2000),
    new ChickenSmall(1100),
    new ChickenSmall(1700),
    new ChickenSmall(2300),
    new Endboss(),
  ];
}

function createClouds() {
  return [new Cloud()];
}

function createBackgrounds() {
  return [
    ...createBackgroundLayer(-720),
    ...createBackgroundLayer(0),
    ...createBackgroundLayer(720),
    ...createBackgroundLayer(720 * 2),
    ...createBackgroundLayer(720 * 3),
  ];
}

function createBackgroundLayer(x) {
  return [
    new BackgroundObject("img/5_background/layers/air.png", x),
    new BackgroundObject(getThirdLayerImage(x), x),
    new BackgroundObject(getSecondLayerImage(x), x),
    new BackgroundObject(getFirstLayerImage(x), x),
  ];
}

function getThirdLayerImage(x) {
  return x === 0 || x === 720 * 2
    ? "img/5_background/layers/3_third_layer/1.png"
    : "img/5_background/layers/3_third_layer/2.png";
}

function getSecondLayerImage(x) {
  return x === 0 || x === 720 * 2
    ? "img/5_background/layers/2_second_layer/1.png"
    : "img/5_background/layers/2_second_layer/2.png";
}

function getFirstLayerImage(x) {
  return x === 0 || x === 720 * 2
    ? "img/5_background/layers/1_first_layer/1.png"
    : "img/5_background/layers/1_first_layer/2.png";
}

function createCoins() {
  return [
    new Coin(300),
    new Coin(360),
    new Coin(420),
    new Coin(800),
    new Coin(880),
    new Coin(960),
    new Coin(1400),
    new Coin(1500),
    new Coin(1900),
    new Coin(2000),
  ];
}

function createBottles() {
  return [
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
  ];
}
