/**
 * Represents a game level with all its objects and entities.
 * @class
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2200;

  /**
   * Creates a level instance with all game objects.
   * @param {Array} enemies - Array of enemy objects
   * @param {Array} clouds - Array of cloud objects
   * @param {Array} backgroundObjects - Array of background objects
   * @param {Array} coins - Array of coin objects
   * @param {Array} bottles - Array of bottle objects
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
