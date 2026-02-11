/**
 * Represents a status bar UI element that displays percentage-based values.
 * Supports different types via constructor parameters (health, coin, bottle, endboss).
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  percentage = 100;

  /** @type {Object} Configuration for each status bar type */
  static CONFIG = {
    health: {
      x: 40,
      y: 0,
      startPercentage: 100,
      images: [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
      ],
    },
    coin: {
      x: 40,
      y: 45,
      startPercentage: 0,
      images: [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
      ],
    },
    bottle: {
      x: 40,
      y: 95,
      startPercentage: 0,
      images: [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ],
    },
    endboss: {
      x: 500,
      y: 70,
      startPercentage: 100,
      images: [
        "img/7_statusbars/2_statusbar_endboss/green/green0.png",
        "img/7_statusbars/2_statusbar_endboss/green/green20.png",
        "img/7_statusbars/2_statusbar_endboss/green/green40.png",
        "img/7_statusbars/2_statusbar_endboss/green/green60.png",
        "img/7_statusbars/2_statusbar_endboss/green/green80.png",
        "img/7_statusbars/2_statusbar_endboss/green/green100.png",
      ],
    },
  };

  /**
   * Creates a status bar instance.
   * @param {string} type - The bar type: "health", "coin", "bottle", or "endboss".
   */
  constructor(type) {
    super();
    const config = StatusBar.CONFIG[type];
    this.x = config.x;
    this.y = config.y;
    this.width = 200;
    this.height = 60;
    this.IMAGES = config.images;
    this.loadImage(config.images[0]);
    this.loadImages(this.IMAGES);
    this.setPercentage(config.startPercentage);
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
