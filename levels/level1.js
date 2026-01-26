let level1;

/**
 * Initializes level 1 with all game objects including enemies, clouds, backgrounds, coins, and bottles.
 */
function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles(),
  );
}

/**
 * Creates and returns an array of enemy objects for the level.
 * @returns {Array} Array containing chicken enemies and the endboss
 */
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

/**
 * Creates and returns an array of cloud objects for the level.
 * @returns {Array} Array containing cloud objects
 */
function createClouds() {
  return [new Cloud()];
}

/**
 * Creates and returns an array of background objects covering multiple layers and positions.
 * @returns {Array} Array containing all background layer objects
 */
function createBackgrounds() {
  return [
    ...createBackgroundLayer(-720),
    ...createBackgroundLayer(0),
    ...createBackgroundLayer(720),
    ...createBackgroundLayer(720 * 2),
    ...createBackgroundLayer(720 * 3),
  ];
}

/**
 * Creates a single background layer with multiple image layers at the specified x position.
 * @param {number} x - The horizontal position of the background layer
 * @returns {Array} Array containing background objects for air, third, second, and first layers
 */
function createBackgroundLayer(x) {
  return [
    new BackgroundObject("img/5_background/layers/air.png", x),
    new BackgroundObject(getThirdLayerImage(x), x),
    new BackgroundObject(getSecondLayerImage(x), x),
    new BackgroundObject(getFirstLayerImage(x), x),
  ];
}

/**
 * Returns the appropriate third layer background image based on x position.
 * @param {number} x - The horizontal position
 * @returns {string} Path to the third layer image
 */
function getThirdLayerImage(x) {
  return x === 0 || x === 720 * 2
    ? "img/5_background/layers/3_third_layer/1.png"
    : "img/5_background/layers/3_third_layer/2.png";
}

/**
 * Returns the appropriate second layer background image based on x position.
 * @param {number} x - The horizontal position
 * @returns {string} Path to the second layer image
 */
function getSecondLayerImage(x) {
  return x === 0 || x === 720 * 2
    ? "img/5_background/layers/2_second_layer/1.png"
    : "img/5_background/layers/2_second_layer/2.png";
}

/**
 * Returns the appropriate first layer background image based on x position.
 * @param {number} x - The horizontal position
 * @returns {string} Path to the first layer image
 */
function getFirstLayerImage(x) {
  return x === 0 || x === 720 * 2
    ? "img/5_background/layers/1_first_layer/1.png"
    : "img/5_background/layers/1_first_layer/2.png";
}

/**
 * Creates and returns an array of coin objects positioned throughout the level.
 * @returns {Array} Array containing coin objects
 */
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

/**
 * Creates and returns an array of bottle objects positioned throughout the level.
 * @returns {Array} Array containing bottle objects
 */
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
