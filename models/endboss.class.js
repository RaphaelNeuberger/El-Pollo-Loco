/**
 * Represents the final boss enemy in the game.
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 50;
  energy = 200;
  isHurt = false;
  _isDead = false;
  isAttacking = false;
  world;
  speed = 3;
  offset = { top: 80, bottom: 20, left: 40, right: 40 };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
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

  /**
   * Creates an instance of Endboss and initializes its position and animations.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadAllImages();
    this.x = 2500;
    this.animate();
  }

  /**
   * Loads all image sets for the endboss animations.
   */
  loadAllImages() {
    this.loadMovementImages();
    this.loadCombatImages();
  }

  /**
   * Loads movement animation images.
   */
  loadMovementImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
  }

  /**
   * Loads combat animation images.
   */
  loadCombatImages() {
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Starts the animation intervals for movement and visual updates.
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 150);
  }

  /**
   * Handles the endboss movement logic each frame.
   */
  handleMovement() {
    if (!this._isDead && this.world) {
      this.moveTowardsCharacter();
    }
  }

  /**
   * Updates the current animation based on the endboss state.
   */
  updateAnimation() {
    if (this._isDead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Moves the endboss towards the character if conditions are met.
   */
  moveTowardsCharacter() {
    if (!this.hasValidWorld()) return;
    let distance = this.getDistanceToCharacter();
    this.processMovement(distance);
  }

  /**
   * Checks if the world and character references are valid.
   * @returns {boolean} True if world and character exist.
   */
  hasValidWorld() {
    return this.world && this.world.character;
  }

  /**
   * Processes movement based on distance to character.
   * @param {number} distance - The distance to the character.
   */
  processMovement(distance) {
    if (this.isCharacterNearby(distance)) {
      this.moveAndCheckAttack(distance);
    }
  }

  /**
   * Calculates the distance to the character.
   * @returns {number} The horizontal distance to the character.
   */
  getDistanceToCharacter() {
    return this.x - this.world.character.x;
  }

  /**
   * Checks if the character is within attack range.
   * @param {number} distance - The distance to the character.
   * @returns {boolean} True if character is nearby.
   */
  isCharacterNearby(distance) {
    return Math.abs(distance) < 600;
  }

  /**
   * Moves towards character and initiates attack if close enough.
   * @param {number} distance - The distance to the character.
   */
  moveAndCheckAttack(distance) {
    if (distance > 0) {
      this.x -= this.speed;
      this.otherDirection = false;
    } else {
      this.x += this.speed;
      this.otherDirection = true;
    }
    if (Math.abs(distance) < 200) {
      this.startAttack();
    }
  }

  /**
   * Initiates an attack sequence for the endboss.
   */
  startAttack() {
    if (!this.isAttacking && !this.isHurt) {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 800);
    }
  }

  /**
   * Reduces endboss energy when hit and triggers death or hurt state.
   * Takes 25 damage per hit (requires 8 out of 10 bottles to defeat).
   */
  hit() {
    this.energy -= 25;
    if (this.energy <= 0) {
      this.die();
    } else {
      this.showHurt();
    }
  }

  /**
   * Checks if endboss is dead.
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this._isDead;
  }

  /**
   * Handles the death of the endboss.
   */
  die() {
    this.energy = 0;
    this._isDead = true;
    this.isAttacking = false;
    this.isHurt = false;
  }

  /**
   * Temporarily sets the endboss to hurt state.
   */
  showHurt() {
    this.isHurt = true;
    setTimeout(() => {
      this.isHurt = false;
    }, 500);
  }
}
