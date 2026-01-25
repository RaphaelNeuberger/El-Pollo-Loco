class Bottle extends MovableObject {
  y = 80;
  height = 60;
  width = 50;
  speed = 0; // Bottles don't move horizontally

  constructor(x) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.animate();
  }

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
