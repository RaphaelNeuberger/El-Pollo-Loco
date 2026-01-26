/**
 * Represents the endboss health status bar.
 * @class
 * @extends StatusBar
 */
class EndbossBar extends StatusBar {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  /**
   * Creates an endboss bar instance positioned at top right and initializes it at 100%.
   */
  constructor() {
    super();
    this.x = 500; // Positioned at top right
    this.y = 10;
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }
}
