/**
 * Extended class for movable game objects with physics.
 * Adds gravity, collision detection, health system, and movement.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** @type {number} */
  speed = 0.15;
  /** @type {boolean} */
  otherDirection = false;
  /** @type {number} */
  speedY = 0;
  /** @type {number} */
  acceleration = 2.5;
  /** @type {number} */
  energy = 100;
  /** @type {number} */
  lastHit = 0;

  /**
   * Applies gravity physics to the object.
   * Updates vertical position and speed every frame.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if object is above ground level.
   * @returns {boolean} True if object is in the air
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // Throwable Object should always fall
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Checks collision with another movable object.
   * @param {MovableObject} mo - The other object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    if (mo instanceof Endboss) {
      return this.isCollidingWithEndboss(mo);
    }
    return this.isCollidingHorizontally(mo) && this.isCollidingVertically(mo);
  }

  /**
   * Checks collision with endboss using custom offsets.
   * @param {Endboss} endboss - The endboss to check collision with
   * @returns {boolean} True if colliding with endboss
   */
  isCollidingWithEndboss(endboss) {
    const offset = endboss.offset;
    const buffer = endboss.collisionBuffer || 0;
    return (
      this.x + this.width - buffer > endboss.x + offset.left &&
      this.x + buffer < endboss.x + endboss.width - offset.right &&
      this.y + this.height - buffer > endboss.y + offset.top &&
      this.y + buffer < endboss.y + endboss.height - offset.bottom
    );
  }

  /**
   * Checks horizontal collision (X-axis) with 5px buffer.
   * @param {MovableObject} mo - The other object
   * @returns {boolean} True if overlapping on X-axis
   */
  isCollidingHorizontally(mo) {
    return this.x + this.width - 5 > mo.x && this.x + 5 < mo.x + mo.width;
  }

  /**
   * Checks vertical collision (Y-axis) with 5px buffer.
   * @param {MovableObject} mo - The other object
   * @returns {boolean} True if overlapping on Y-axis
   */
  isCollidingVertically(mo) {
    return this.y + this.height - 5 > mo.y && this.y + 5 < mo.y + mo.height;
  }

  /**
   * Reduces object's health when hit.
   * Sets energy to 0 if depleted, otherwise records hit time.
   */
  hit() {
    this.energy -= 17;
    if (this.energy <= 0) {
      this.energy = 0;
    }
    this.lastHit = new Date().getTime();
  }

  /**
   * Checks if object was recently hurt (within 1 second).
   * @returns {boolean} True if object is in hurt state
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
    timepassed = timepassed / 1000; //    Difference in sec
    return timepassed < 1;
  }

  /**
   * Checks if object has no health remaining.
   * @returns {boolean} True if energy is 0
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays animation by cycling through image array.
   * @param {string[]} images - Array of image paths for animation frames
   */
  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 7 % 6; => 1, remainder 1
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes object jump with initial upward velocity.
   */
  jump() {
    this.speedY = 30;
  }
}
