/**
 * Collision detection module for the World class.
 * Handles all collision detection between game objects.
 * @class
 */
class WorldCollision {
  /**
   * Sets up collision properties for world instance.
   * @param {World} world - The world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks all types of collisions in the game.
   */
  checkCollisions() {
    if (this.world.isPaused || this.world.gameIsOver) return;
    this.checkAllCollisionTypes();
  }

  /**
   * Executes all collision checks.
   */
  checkAllCollisionTypes() {
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableObjectCollisions();
  }

  /**
   * Checks collisions between character and enemies.
   */
  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.isBasicEnemyCollision(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  /**
   * Checks basic collision (ignoring hurt state to allow jump kills).
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if colliding with a living enemy.
   */
  isBasicEnemyCollision(enemy) {
    return this.world.character.isColliding(enemy) && !enemy.isDead();
  }

  /**
   * Handles collision between character and enemy.
   * Jump kills work even during hurt invincibility, damage only when not hurt.
   * @param {MovableObject} enemy - The colliding enemy.
   */
  handleEnemyCollision(enemy) {
    if (this.isJumpKill(enemy)) {
      this.handleJumpKill(enemy);
    } else if (this.isEndbossJumpCollision(enemy)) {
      this.handleEndbossJump(enemy);
    } else if (!this.world.character.isHurt()) {
      this.handleNormalCollision(enemy);
    }
  }

  /**
   * Checks if character is jumping on the endboss.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} True if jumping on endboss.
   */
  isEndbossJumpCollision(enemy) {
    return enemy instanceof Endboss && this.isCharacterFallingFromAbove();
  }

  /**
   * Handles character jumping on endboss - bounces character back and endboss counterattacks.
   * @param {Endboss} endboss - The endboss.
   */
  handleEndbossJump(endboss) {
    const char = this.world.character;
    char.speedY = 20;
    const knockbackDirection = char.x < endboss.x ? -15 : 15;
    char.x += knockbackDirection;
    if (!char.isHurt()) {
      this.handleNormalCollision(endboss);
    }
    endboss.startAttack();
  }

  /**
   * Checks if character can kill enemy by jumping.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if jump kill is possible.
   */
  isJumpKill(enemy) {
    return (
      this.isChickenType(enemy) &&
      this.isCharacterFallingFromAbove() &&
      !this.isDeadChicken(enemy)
    );
  }

  /**
   * Checks if enemy is a chicken type.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if chicken type.
   */
  isChickenType(enemy) {
    return enemy instanceof Chicken || enemy instanceof ChickenSmall;
  }

  /**
   * Checks if character is falling from above.
   * Uses a 150ms grace period after landing to handle timing between gravity (40ms) and collision checks (100ms).
   * @returns {boolean} - True if falling or just landed from a fall.
   */
  isCharacterFallingFromAbove() {
    const char = this.world.character;
    const isFalling = char.speedY < 0 && char.isAboveGround();
    const justLanded = char.landedAt > 0 && Date.now() - char.landedAt < 150;
    return isFalling || justLanded;
  }

  /**
   * Checks if chicken is already dead.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if dead.
   */
  isDeadChicken(enemy) {
    return enemy.isDead();
  }

  /**
   * Handles jump kill action on enemy.
   * @param {MovableObject} enemy - The enemy to kill.
   */
  handleJumpKill(enemy) {
    this.executeJumpKill(enemy);
    this.playJumpKillSound(enemy);
    this.world.character.landedAt = 0;
    this.world.character.speedY = 15;
  }

  /**
   * Executes the jump kill and removes enemy.
   * @param {MovableObject} enemy - The enemy to kill.
   */
  executeJumpKill(enemy) {
    if (enemy.die) {
      enemy.die();
      this.world.enemiesKilledCount++;
    }
  }

  /**
   * Plays sound for jump kill based on enemy type.
   * @param {MovableObject} enemy - The enemy killed.
   */
  playJumpKillSound(enemy) {
    if (enemy instanceof ChickenSmall) {
      this.world.audio.playSmallChickenKillSound();
    } else {
      this.world.audio.playNormalChickenKillSound();
    }
  }

  /**
   * Handles normal collision damage to character.
   * @param {MovableObject} enemy - The enemy.
   */
  handleNormalCollision(enemy) {
    this.damageCharacter();
    this.world.audio.playEnemyHitSound(enemy);
  }

  /**
   * Reduces character health and updates health bar.
   */
  damageCharacter() {
    this.world.character.hit();
    this.world.healthBar.setPercentage(this.world.character.energy);
    if (this.world.character.isDead()) {
      this.world.triggerGameOver();
    }
  }

  /**
   * Checks collisions between character and coins.
   */
  checkCoinCollisions() {
    this.world.level.coins.forEach((coin, index) => {
      if (this.world.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  /**
   * Collects coin and updates coin bar.
   * @param {number} index - Index of coin in array.
   */
  collectCoin(index) {
    this.world.level.coins.splice(index, 1);
    this.world.coinsCollectedCount++;
    this.world.coinBar.setPercentage(
      (this.world.coinsCollectedCount / this.world.totalCoins) * 100,
    );
    this.world.audio.playCoinSound();
  }

  /**
   * Checks collisions between character and bottles.
   */
  checkBottleCollisions() {
    this.world.level.bottles.forEach((bottle, index) => {
      if (this.world.character.isColliding(bottle)) {
        this.collectBottle(index);
      }
    });
  }

  /**
   * Collects bottle and updates bottle bar.
   * @param {number} index - Index of bottle in array.
   */
  collectBottle(index) {
    this.world.level.bottles.splice(index, 1);
    this.world.bottlesCollectedCount++;
    this.world.bottleBar.setPercentage(
      (this.world.bottlesCollectedCount / this.world.totalBottles) * 100,
    );
    this.world.audio.playBottleSound();
  }

  /**
   * Checks collisions between throwable objects and enemies.
   */
  checkThrowableObjectCollisions() {
    this.world.throwableObjects.forEach((obj) => {
      if (obj.hasHit) return;
      this.checkObjectEnemyCollisions(obj);
    });
  }

  /**
   * Checks if throwable object hits any enemy.
   * @param {ThrowableObject} obj - The throwable object.
   */
  checkObjectEnemyCollisions(obj) {
    this.world.level.enemies.forEach((enemy) => {
      if (obj.isColliding(enemy) && !enemy.isDead()) {
        this.handleBottleHit(obj, enemy);
      }
    });
  }

  /**
   * Handles bottle hitting an enemy.
   * @param {ThrowableObject} obj - The bottle object.
   * @param {MovableObject} enemy - The enemy hit.
   */
  handleBottleHit(obj, enemy) {
    obj.splash();
    if (enemy instanceof Endboss) {
      this.hitEndboss(enemy);
    } else {
      this.hitRegularEnemy(enemy);
    }
  }

  /**
   * Handles bottle hitting the endboss.
   * @param {Endboss} endboss - The endboss.
   */
  hitEndboss(endboss) {
    this.damageEndboss(endboss);
    this.world.audio.playEndbossHitSound();
  }

  /**
   * Reduces endboss health and updates endboss bar.
   * @param {Endboss} endboss - The endboss.
   */
  damageEndboss(endboss) {
    endboss.hit();
    let percentage = (endboss.energy / 200) * 100;
    this.world.endbossBar.setPercentage(percentage);
  }

  /**
   * Handles bottle hitting a regular enemy.
   * @param {MovableObject} enemy - The enemy.
   */
  hitRegularEnemy(enemy) {
    if (enemy.die) {
      enemy.die();
      this.world.enemiesKilledCount++;
    }
  }
}
