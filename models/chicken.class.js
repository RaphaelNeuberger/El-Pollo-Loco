/**
 * Represents a chicken enemy in the game. Supports normal and small variants via type parameter.
 * @class
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  _isDead = false;
  /** @type {string} */
  type;

  /** @type {Object} Configuration for each chicken type */
  static CONFIG = {
    normal: {
      y: 356,
      height: 55,
      width: 70,
      offset: { top: 5, bottom: 5, left: 10, right: 10 },
      speedBase: 0.15,
      speedRange: 0.5,
      imagesWalking: [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      ],
      imagesDead: ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"],
    },
    small: {
      y: 370,
      height: 40,
      width: 50,
      offset: { top: 5, bottom: 5, left: 5, right: 5 },
      speedBase: 0.2,
      speedRange: 0.35,
      imagesWalking: [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
      ],
      imagesDead: ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"],
    },
  };

  /**
   * Creates an instance of Chicken.
   * @param {number} x - The starting x position of the chicken.
   * @param {string} [type="normal"] - The chicken type: "normal" or "small".
   */
  constructor(x, type = "normal") {
    const config = Chicken.CONFIG[type];
    super().loadImage(config.imagesWalking[0]);
    this.type = type;
    this.y = config.y;
    this.height = config.height;
    this.width = config.width;
    this.offset = config.offset;
    this.IMAGES_WALKING = config.imagesWalking;
    this.IMAGES_DEAD = config.imagesDead;
    this.loadAllImages();
    this.x = x;
    this.speed = config.speedBase + Math.random() * config.speedRange;
    this.animate();
  }

  /**
   * Checks if this chicken is the small variant.
   * @returns {boolean} True if small chicken.
   */
  isSmall() {
    return this.type === "small";
  }

  /**
   * Loads all image sets for chicken animations.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Starts the animation intervals for movement and visual updates.
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 200);
  }

  /**
   * Handles the chicken movement logic each frame.
   */
  handleMovement() {
    if (this.canMove()) {
      this.moveLeft();
    }
  }

  /**
   * Checks if the chicken can move based on game state.
   * @returns {boolean} True if chicken can move.
   */
  canMove() {
    return !this.isDead() && this.isGameActive();
  }

  /**
   * Checks if game is active and chickens can move.
   * @returns {boolean} True if game allows movement.
   */
  isGameActive() {
    return this.world && this.world.gameStarted && this.world.chickensCanMove;
  }

  /**
   * Updates the current animation based on chicken state.
   */
  updateAnimation() {
    if (this._isDead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.world && this.world.gameStarted) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Checks if chicken is dead.
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this._isDead;
  }

  /**
   * Marks the chicken as dead and schedules removal from level.
   */
  die() {
    this._isDead = true;
    setTimeout(() => this.removeFromLevel(), 1000);
  }

  /**
   * Removes the chicken from the level's enemy array.
   */
  removeFromLevel() {
    if (this.world) {
      this.removeFromEnemyArray();
    }
  }

  /**
   * Removes chicken from enemy array.
   */
  removeFromEnemyArray() {
    const index = this.world.level.enemies.indexOf(this);
    if (index > -1) {
      this.world.level.enemies.splice(index, 1);
    }
  }
}
