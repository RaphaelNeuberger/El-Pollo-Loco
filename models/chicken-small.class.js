/**
 * Represents a small chicken enemy in the game.
 * @class
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
  y = 370;
  height = 40;
  width = 50;
  isDead = false;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Creates an instance of ChickenSmall and initializes its position and animations.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadAllImages();
    this.setRandomPosition();
    this.animate();
  }

  /**
   * Loads all image sets for small chicken animations.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Sets a random starting position and speed for the small chicken.
   */
  setRandomPosition() {
    this.x = 300 + Math.random() * 1500;
    this.speed = 0.2 + Math.random() * 0.35;
  }

  /**
   * Starts the animation intervals for movement and visual updates.
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 200);
  }

  /**
   * Handles the small chicken movement logic each frame.
   */
  handleMovement() {
    if (this.canMove()) {
      this.moveLeft();
    }
  }

  /**
   * Checks if the small chicken can move based on game state.
   * @returns {boolean} True if small chicken can move.
   */
  canMove() {
    return (
      !this.isDead &&
      this.world &&
      this.world.gameStarted &&
      this.world.chickensCanMove
    );
  }

  /**
   * Updates the current animation based on small chicken state.
   */
  updateAnimation() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.world && this.world.gameStarted) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Marks the small chicken as dead and schedules removal from level.
   */
  kill() {
    this.isDead = true;
    setTimeout(() => this.removeFromLevel(), 1000);
  }

  /**
   * Removes the small chicken from the level's enemy array.
   */
  removeFromLevel() {
    if (this.world) {
      let index = this.world.level.enemies.indexOf(this);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }
  }
}
