/**
 * Represents a coin collection status bar.
 * @class
 * @extends StatusBar
 */
class CoinBar extends StatusBar {
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * Creates a coin bar instance and initializes it at 0%.
   */
  constructor() {
    super();
    this.x = 40;
    this.y = 45;
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }
}
