/**
 * Represents a status bar UI element that displays percentage-based values.
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  percentage = 100;

  /**
   * Creates a status bar instance.
   */
  constructor() {
    super();
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    // Initialize with an empty image to avoid errors
    this.loadImage("img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png");
  }

  /**
   * Sets the percentage value and updates the displayed image.
   * @param {number} percentage - The percentage value to display (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.updateImage();
  }

  /**
   * Updates the displayed image based on current percentage.
   */
  updateImage() {
    if (this.IMAGES && this.IMAGES.length > 0) {
      let index = this.resolveImageIndex();
      let path = this.IMAGES[index];
      if (this.imageCache[path]) {
        this.img = this.imageCache[path];
      }
    }
  }

  /**
   * Resolves the image index based on current percentage value.
   * @returns {number} Index of the image to display (0-5)
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }
}
