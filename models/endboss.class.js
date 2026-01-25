class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  energy = 100;
  isHurt = false;
  isDead = false;
  isAttacking = false;
  world;
  speed = 2;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.x = 2500;
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 150);
  }

  handleMovement() {
    if (!this.isDead && this.world) {
      this.moveTowardsCharacter();
    }
  }

  updateAnimation() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  moveTowardsCharacter() {
    if (!this.hasValidWorld()) return;
    let distance = this.getDistanceToCharacter();
    this.processMovement(distance);
  }

  hasValidWorld() {
    return this.world && this.world.character;
  }

  processMovement(distance) {
    if (this.isCharacterNearby(distance)) {
      this.moveAndCheckAttack(distance);
    }
  }

  getDistanceToCharacter() {
    return this.x - this.world.character.x;
  }

  isCharacterNearby(distance) {
    return Math.abs(distance) < 500 && distance > 0;
  }

  moveAndCheckAttack(distance) {
    this.x -= this.speed;
    this.otherDirection = false;
    if (distance < 150) {
      this.startAttack();
    }
  }

  startAttack() {
    if (!this.isAttacking && !this.isHurt) {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 1000);
    }
  }

  hit() {
    this.energy -= 20;
    if (this.energy <= 0) {
      this.die();
    } else {
      this.showHurt();
    }
  }

  die() {
    this.energy = 0;
    this.isDead = true;
    this.isAttacking = false;
    this.isHurt = false;
  }

  showHurt() {
    this.isHurt = true;
    setTimeout(() => {
      this.isHurt = false;
    }, 500);
  }
}
