class Bottle extends MovableObject {
  y = 80;
  height = 60;
  width = 50;
  speed = 0; // Bottles bewegen sich nicht horizontal

  constructor(x) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.animate();
  }

  animate() {
    // Flasche schwebt auf und ab (langsamer als Münze)
    let direction = 1;
    setInterval(() => {
      this.y += direction * 1.5;
      if (this.y <= 60 || this.y >= 130) {
        direction *= -1;
      }
    }, 80);
  }
}
