class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // Throwable Object should always fall
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(mo) {
    return this.isCollidingHorizontally(mo) && this.isCollidingVertically(mo);
  }

  isCollidingHorizontally(mo) {
    return this.x + this.width - 10 > mo.x && this.x + 10 < mo.x + mo.width;
  }

  isCollidingVertically(mo) {
    return this.y + this.height - 10 > mo.y && this.y + 10 < mo.y + mo.height;
  }

  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
    timepassed = timepassed / 1000; //    Difference in sec
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length; // let i = 7 % 6; => 1, Rest 1
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
