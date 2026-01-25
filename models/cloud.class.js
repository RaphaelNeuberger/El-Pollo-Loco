class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;
  imageIndex = 0;

  CLOUD_IMAGES = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.loadImages(this.CLOUD_IMAGES);

    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();

      // If image completely disappears to the left, switch to next image
      if (this.x < -this.width) {
        this.imageIndex = (this.imageIndex + 1) % this.CLOUD_IMAGES.length;
        this.x = 720; // Reappear on the right (800 + some buffer)
      }

      // Display current image
      let path = this.CLOUD_IMAGES[this.imageIndex];
      this.img = this.imageCache[path];
    }, 1000 / 60);
  }
}
