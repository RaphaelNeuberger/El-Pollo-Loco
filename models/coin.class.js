/**
 * Represents a collectible coin in the game.
 * @class
 * @extends MovableObject
 */
class Coin extends MovableObject {
  y = 100;
  height = 80;
  width = 80;
  speed = 0; // Coins don't move horizontally

  /**
   * Creates a coin instance at specified x position.
   * @param {number} x - The x coordinate for the coin.
   */
  constructor(x) {
    super().loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.animate();
  }

  /**
   * Animates the coin with a floating up and down motion.
   */
  animate() {
    // Coin floats up and down
    let direction = 1;
    setInterval(() => {
      this.y += direction * 2;
      if (this.y <= 80 || this.y >= 150) {
        direction *= -1;
      }
    }, 50);
  }
}
