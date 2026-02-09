/**
 * Spawner module for the World class.
 * Handles spawning of chickens during gameplay.
 * @class
 */
class WorldSpawner {
  /**
   * Sets up spawner with world reference.
   * @param {World} world - The world instance
   */
  constructor(world) {
    this.world = world;
    this.chickenSpawnInterval = null;
  }

  /**
   * Starts spawning chickens at intervals.
   */
  startChickenSpawning() {
    this.chickenSpawnInterval = setInterval(() => {
      this.spawnChicken();
    }, 3000);
  }

  /**
   * Stops the chicken spawning interval.
   */
  stopChickenSpawning() {
    clearInterval(this.chickenSpawnInterval);
  }

  /**
   * Spawns a random chicken in the level.
   */
  spawnChicken() {
    if (this.shouldSpawnChicken()) {
      const chicken = this.createRandomChicken();
      this.addChickenToLevel(chicken);
    }
  }

  /**
   * Checks if chicken should spawn.
   * @returns {boolean} True if should spawn.
   */
  shouldSpawnChicken() {
    return (
      !this.world.gameIsOver &&
      this.world.gameStarted &&
      this.world.level.enemies.length < this.world.totalEnemies
    );
  }

  /**
   * Creates a random chicken type.
   * @returns {Chicken|ChickenSmall} The chicken.
   */
  createRandomChicken() {
    const isSmall = Math.random() < 0.5;
    return isSmall ? new ChickenSmall() : new Chicken();
  }

  /**
   * Adds chicken to the level enemies.
   * @param {Chicken|ChickenSmall} chicken - The chicken.
   */
  addChickenToLevel(chicken) {
    chicken.world = this.world;
    this.world.level.enemies.push(chicken);
    this.world.totalEnemies++;
  }
}
