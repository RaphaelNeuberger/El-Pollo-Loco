/**
 * Represents a throwable bottle object that can be thrown by the character.
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  isSplashing = false;
  hasHit = false;

  /**
   * Creates a throwable object at specified position.
   * @param {number} x - The x coordinate.
   * @param {number} y - The y coordinate.
   * @param {boolean} direction - The throw direction.
   */
  constructor(x, y, direction) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.otherDirection = direction;
    this.creationTime = Date.now();
    this.trow();
    this.animate();
  }

  /**
   * Initiates the throwing motion with gravity and direction.
   */
  trow() {
    this.speedY = 30;
    this.applyGravity();
    this.throwInDirection();
  }

  /**
   * Moves the bottle horizontally based on throw direction.
   */
  throwInDirection() {
    setInterval(() => {
      if (this.otherDirection) {
        this.x -= 10;
      } else {
        this.x += 10;
      }
    }, 25);
  }

  /**
   * Updates the animation between rotation and splash states.
   */
  animate() {
    setInterval(() => {
      if (this.isSplashing) {
        this.playAnimation(this.IMAGES_SPLASH);
      } else {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 100);
  }

  /**
   * Triggers the splash animation and stops movement.
   */
  splash() {
    this.isSplashing = true;
    this.hasHit = true;
    this.speedY = 0;
    this.speedX = 0;
  }
}
