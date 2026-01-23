class Coin extends MovableObject {
  y = 100;
  height = 80;
  width = 80;
  speed = 0; // Coins bewegen sich nicht horizontal

  constructor(x) {
    super().loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.animate();
  }

  animate() {
    // Münze schwebt auf und ab
    let direction = 1;
    setInterval(() => {
      this.y += direction * 2;
      if (this.y <= 80 || this.y >= 150) {
        direction *= -1;
      }
    }, 50);
  }
}
