/**
 * Main playable character (Pepe).
 * Handles player input, movement, animations, and camera control.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {number} */
  height = 250;
  /** @type {number} */
  y = 170;
  /** @type {number} */
  speed = 10;
  /** @type {Object} */
  offset = { top: 100, bottom: 10, left: 20, right: 20 };

  /** @type {string[]} */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  world;
  // walking_sound = new Audio("audio/running.mp3"); // Audio file not available
  lastInputTime = 0;

  /**
   * Creates a new Character instance.
   * Loads initial image, preloads animations, applies gravity, and starts animation loop.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadAllImages();
    this.applyGravity();
    this.animate();
  }

  /**
   * Preloads all character animation images.
   * Loads idle, walking, jumping, hurt, and death animations.
   */
  loadAllImages() {
    this.loadIdleImages();
    this.loadActionImages();
  }

  /**
   * Loads idle animation images.
   */
  loadIdleImages() {
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
  }

  /**
   * Loads action animation images.
   */
  loadActionImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Starts character animation loops.
   * Movement updates at 60 FPS, animation frames at 5 FPS.
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 200);
  }

  /**
   * Handles character movement each frame.
   * Processes input and updates camera position.
   */
  handleMovement() {
    if (this.world.gameWon || this.world.gameLost) return;
    this.processMovementInput();
    this.updateCamera();
  }

  /**
   * Processes keyboard input for movement.
   * Handles right, left, and jump actions.
   */
  processMovementInput() {
    this.handleRightMovement();
    this.handleLeftMovement();
    this.handleJump();
  }

  /**
   * Updates camera position to follow character.
   * Keeps character centered with 100px offset.
   */
  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Handles right movement input.
   * Moves character right if conditions are met.
   */
  handleRightMovement() {
    if (this.canMoveRight()) {
      this.moveRightAndUpdate();
    }
  }

  /**
   * Checks if character can move right.
   * @returns {boolean} True if RIGHT key pressed and not at level end or endboss
   */
  canMoveRight() {
    const endboss = this.world.level.enemies.find((e) => e instanceof Endboss);
    const maxX = endboss ? endboss.x - 50 : this.world.level.level_end_x;
    return this.world.keyboard.RIGHT && this.x < maxX;
  }

  /**
   * Moves character right and updates state.
   * Resets direction, updates input time, and activates chickens.
   */
  moveRightAndUpdate() {
    this.moveRight();
    this.otherDirection = false;
    this.lastInputTime = Date.now();
    this.activateChickens();
  }

  /**
   * Handles left movement input.
   * Moves character left if conditions are met.
   */
  handleLeftMovement() {
    if (this.canMoveLeft()) {
      this.moveLeftAndUpdate();
    }
  }

  /**
   * Checks if character can move left.
   * @returns {boolean} True if LEFT key pressed and not at left boundary
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Moves character left and updates state.
   * Sets direction to left, updates input time, and activates chickens.
   */
  moveLeftAndUpdate() {
    this.moveLeft();
    this.otherDirection = true;
    this.lastInputTime = Date.now();
    this.activateChickens();
  }

  /**
   * Activates chicken movement when character moves.
   * Chickens start moving after first character movement.
   */
  activateChickens() {
    if (!this.world.chickensCanMove) {
      this.world.chickensCanMove = true;
    }
  }

  /**
   * Handles jump input.
   * Makes character jump if SPACE pressed and on ground.
   */
  handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.currentImage = 0;
      this.lastInputTime = Date.now();
    }
  }

  /**
   * Updates character animation based on state.
   * Priority: dead > hurt > jumping > walking/idle.
   */
  updateAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else {
      this.playIdleOrWalkAnimation();
    }
  }

  /**
   * Plays jump animation frame based on current velocity.
   * Maps speedY to the correct frame so ascending and descending phases
   * each show the appropriate part of the animation.
   */
  playJumpAnimation() {
    const maxSpeed = 30;
    const totalFrames = this.IMAGES_JUMPING.length;
    const progress = 1 - (this.speedY + maxSpeed) / (2 * maxSpeed);
    const frameIndex = Math.min(
      Math.max(Math.floor(progress * totalFrames), 0),
      totalFrames - 1,
    );
    this.img = this.imageCache[this.IMAGES_JUMPING[frameIndex]];
  }

  /**
   * Plays either walking or idle animation.
   * Checks keyboard input to determine which animation to play.
   */
  playIdleOrWalkAnimation() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.selectIdleAnimation();
    }
  }

  /**
   * Selects appropriate idle animation.
   * Plays long idle after 5 seconds of inactivity.
   */
  selectIdleAnimation() {
    let timeSinceLastInput = (Date.now() - this.lastInputTime) / 1000;
    if (timeSinceLastInput > 5) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Makes character jump by setting vertical speed.
   * Sets speedY to 30 for upward movement.
   */
  jump() {
    this.speedY = 30;
  }
}
