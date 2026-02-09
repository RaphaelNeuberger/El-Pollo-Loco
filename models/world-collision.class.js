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
      if (enemy.isDead() || this.world.character.isHurt()) return;
      if (this.isEnemyColliding(enemy)) {
        this.handleEnemyCollision(enemy);
      } else if (this.canJumpKillWithPrediction(enemy)) {
        this.handleJumpKill(enemy);
      }
    });
  }

  /**
   * Checks if character is colliding with an enemy.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if colliding.
   */
  isEnemyColliding(enemy) {
    return this.world.character.isColliding(enemy);
  }

  /**
   * Handles collision between character and enemy.
   * @param {MovableObject} enemy - The colliding enemy.
   */
  handleEnemyCollision(enemy) {
    if (this.isJumpKill(enemy)) {
      this.handleJumpKill(enemy);
    } else if (
      this.isChickenType(enemy) &&
      this.world.character.isAboveGround()
    ) {
      return;
    } else {
      this.handleNormalCollision(enemy);
    }
  }

  /**
   * Checks if character can kill enemy by jumping.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if jump kill is possible.
   */
  isJumpKill(enemy) {
    return (
      this.isChickenType(enemy) &&
      this.isCharacterFallingOnEnemy(enemy) &&
      !this.isDeadChicken(enemy)
    );
  }

  /**
   * Predictive jump kill check for fast-falling character.
   * Detects if character will land on enemy within the next gravity frame.
   * Solves the issue where the character falls too fast to collide with small enemies.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if predicted jump kill.
   */
  canJumpKillWithPrediction(enemy) {
    if (!this.isChickenType(enemy) || enemy.isDead()) return false;
    const char = this.world.character;
    if (char.speedY >= 0 || !char.isAboveGround()) return false;
    return (
      this.isHorizontalOverlap(char, enemy) && this.willLandOnEnemy(char, enemy)
    );
  }

  /**
   * Checks horizontal overlap between character and enemy using collision offsets.
   * @param {Character} char - The character.
   * @param {MovableObject} enemy - The enemy.
   * @returns {boolean} - True if horizontally overlapping.
   */
  isHorizontalOverlap(char, enemy) {
    const charLeft = char.x + char.offset.left;
    const charRight = char.x + char.width - char.offset.right;
    const enemyLeft = enemy.x + enemy.offset.left;
    const enemyRight = enemy.x + enemy.width - enemy.offset.right;
    return charRight > enemyLeft && charLeft < enemyRight;
  }

  /**
   * Checks if character bottom will pass through enemy top in the next gravity frame.
   * @param {Character} char - The character.
   * @param {MovableObject} enemy - The enemy.
   * @returns {boolean} - True if character will land on enemy.
   */
  willLandOnEnemy(char, enemy) {
    const charBottom = char.y + char.height - char.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    const enemyBottom = enemy.y + enemy.height - enemy.offset.bottom;
    const nextCharBottom = charBottom + Math.abs(char.speedY);
    return charBottom <= enemyBottom && nextCharBottom >= enemyTop;
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
   * Checks if character is falling from above onto an enemy.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if falling onto enemy.
   */
  isCharacterFallingOnEnemy(enemy) {
    const char = this.world.character;
    const charBottom = char.y + char.height - char.offset.bottom;
    const enemyBottom = enemy.y + enemy.height - enemy.offset.bottom;
    const isLandingOnTop = charBottom < enemyBottom;
    const isFalling = char.speedY < 0;
    const isInAir = char.isAboveGround();
    return isFalling && isLandingOnTop && isInAir;
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
    this.world.endbossBar.setPercentage(endboss.energy);
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
