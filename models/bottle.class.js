/**
 * Represents a collectible bottle in the game.
 * @class
 * @extends MovableObject
 */
class Bottle extends MovableObject {
  y = 80;
  height = 60;
  width = 50;
  speed = 0; // Bottles don't move horizontally
  /** @type {Object} */
  offset = { top: 10, bottom: 5, left: 15, right: 15 };

  /**
   * Creates a bottle instance at specified x position.
   * @param {number} x - The x coordinate for the bottle.
   */
  constructor(x) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.animate();
  }

  /**
   * Animates the bottle with a floating up and down motion.
   */
  animate() {
    // Bottle floats up and down (slower than coin)
    let direction = 1;
    setInterval(() => {
      this.y += direction * 1.5;
      if (this.y <= 60 || this.y >= 130) {
        direction *= -1;
      }
    }, 80);
  }
}
