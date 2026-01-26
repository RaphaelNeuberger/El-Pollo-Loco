/**
 * Represents a background object layer in the game.
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  /**
   * Creates a background object at specified position.
   * @param {string} imagePath - The path to the background image.
   * @param {number} x - The x coordinate for the background.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);

    this.x = x;
    this.y = 480 - this.height;
  }
}
