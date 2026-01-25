/**
 * Extended class for movable game objects with physics.
 * Adds gravity, collision detection, health system, and movement.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** @type {number} Movement speed in pixels per frame */
  speed = 0.15;
  /** @type {boolean} Whether object is facing left (flipped) */
  otherDirection = false;
  /** @type {number} Vertical speed for gravity/jumping */
  speedY = 0;
  /** @type {number} Gravity acceleration */
  acceleration = 2.5;
  /** @type {number} Health points (0-100) */
  energy = 100;
  /** @type {number} Timestamp of last hit */
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
    return this.isCollidingHorizontally(mo) && this.isCollidingVertically(mo);
  }

  /**
   * Checks horizontal collision (X-axis) with 10px buffer.
   * @param {MovableObject} mo - The other object
   * @returns {boolean} True if overlapping on X-axis
   */
  isCollidingHorizontally(mo) {
    return this.x + this.width - 10 > mo.x && this.x + 10 < mo.x + mo.width;
  }

  /**
   * Checks vertical collision (Y-axis) with 10px buffer.
   * @param {MovableObject} mo - The other object
   * @returns {boolean} True if overlapping on Y-axis
   */
  isCollidingVertically(mo) {
    return this.y + this.height - 10 > mo.y && this.y + 10 < mo.y + mo.height;
  }

  /**
   * Reduces object's health when hit.
   * Sets energy to 0 if depleted, otherwise records hit time.
   */
  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
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
