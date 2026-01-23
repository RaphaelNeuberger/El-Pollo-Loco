class StatusBar extends DrawableObject {
  percentage = 100;

  constructor() {
    super();
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    // Initialisiere mit einem leeren Bild um Fehler zu vermeiden
    this.loadImage("img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png");
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    if (this.IMAGES && this.IMAGES.length > 0) {
      let index = this.resolveImageIndex();
      let path = this.IMAGES[index];
      if (this.imageCache[path]) {
        this.img = this.imageCache[path];
      }
    }
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
