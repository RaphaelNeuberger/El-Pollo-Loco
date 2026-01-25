class Chicken extends MovableObject {
  y = 360;
  height = 55;
  width = 70;
  isDead = false;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadAllImages();
    this.setRandomPosition();
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  setRandomPosition() {
    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() + 0.25;
  }

  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 200);
  }

  handleMovement() {
    if (this.canMove()) {
      this.moveLeft();
    }
  }

  canMove() {
    return (
      !this.isDead &&
      this.world &&
      this.world.gameStarted &&
      this.world.chickensCanMove
    );
  }

  updateAnimation() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.world && this.world.gameStarted) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  kill() {
    this.isDead = true;
    setTimeout(() => this.removeFromLevel(), 1000);
  }

  removeFromLevel() {
    if (this.world) {
      let index = this.world.level.enemies.indexOf(this);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }
  }
}
