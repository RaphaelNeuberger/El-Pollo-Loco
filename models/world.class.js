/**
 * Main game engine that manages all game objects and rendering.
 * Delegates responsibilities to specialized modules.
 * @class
 */
class World {
  /** @type {Character} */
  character = new Character();
  /** @type {Level} */
  level = level1;
  /** @type {HTMLCanvasElement} */
  canvas;
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /** @type {Keyboard} */
  keyboard;
  /** @type {number} */
  camera_x = 0;
  /** @type {HealthBar} */
  healthBar = new HealthBar();
  /** @type {CoinBar} */
  coinBar = new CoinBar();
  /** @type {BottleBar} */
  bottleBar = new BottleBar();
  /** @type {EndbossBar} */
  endbossBar = new EndbossBar();
  /** @type {ThrowableObject[]} */
  throwableObjects = [];
  /** @type {number} */
  collectedCoins = 0;
  /** @type {number} */
  collectedBottles = 0;
  /** @type {number} */
  totalCoins = 0;
  /** @type {number} */
  totalBottles = 0;
  /** @type {number} */
  coinsCollectedCount = 0;
  /** @type {number} */
  bottlesCollectedCount = 0;
  /** @type {number} */
  enemiesKilledCount = 0;
  /** @type {number} */
  totalEnemies = 0;
  /** @type {boolean} */
  gameWon = false;
  /** @type {boolean} */
  gameLost = false;
  /** @type {boolean} */
  gameStarted = false;
  /** @type {boolean} */
  chickensCanMove = false;
  /** @type {boolean} */
  isPaused = false;
  /** @type {boolean} */
  gameIsOver = false;
  /** @type {boolean} */
  soundMuted = false;
  /** @type {boolean} */
  endbossSoundPlayed = false;
  /** @type {boolean} */
  endbossDefeated = false;
  /** @type {Image} */
  youWonImage = new Image();
  /** @type {Image} */
  youLostImage = new Image();
  /** @type {Image} */
  startScreenImage = new Image();
  /** @type {Image} */
  restartButtonImg = new Image();
  /** @type {Image} */
  mainMenuButtonImg = new Image();
  youWonImg = new Image();
  youLostImg = new Image();
  /** @type {number} */
  restartButtonX = 150;
  restartButtonY = 320;
  restartButtonWidth = 150;
  restartButtonHeight = 60;
  mainMenuButtonX = 420;
  mainMenuButtonY = 320;
  mainMenuButtonWidth = 150;
  mainMenuButtonHeight = 60;
  /** @type {number} */
  lastThrowTime = 0;
  /** @type {Audio} */
  introSound = new Audio("audio/game-intro-345507.mp3");
  /** @type {Audio} */
  gameStartSound = new Audio("audio/game-start-6104.mp3");
  /** @type {Audio} */
  bottleCollectSound = new Audio(
    "audio/fantasy-game-sword-cut-sound-effect-get-more-on-my-patreon-339824.mp3",
  );
  /** @type {Audio} */
  coinCollectSound = new Audio("audio/game-bonus-02-294436.mp3");
  /** @type {Audio} */
  gameMusicLoop = new Audio("audio/game-music-loop-6-144641.mp3");
  /** @type {Audio} */
  endbossWarningSound = new Audio("audio/wrong-place-129242.mp3");
  /** @type {Audio} */
  winnerSound = new Audio("audio/winner-game-sound-404167.mp3");
  /** @type {Audio} */
  gameOverSound1 = new Audio("audio/game-over-160612.mp3");
  /** @type {Audio} */
  gameOverSound2 = new Audio("audio/game-over-38511.mp3");
  /** @type {Audio} */
  jumpKillSound = new Audio("audio/retro-game-shot-152052.mp3");
  /** @type {Audio} */
  chickenKillSound = new Audio(
    "audio/muffled-sound-of-falling-game-character-131797.mp3",
  );
  /** @type {Audio} */
  smallChickenHitSound = new Audio("audio/game-character-scream-131144.mp3");
  /** @type {Audio} */
  endbossHitSound = new Audio("audio/rpg-sword-attack-combo-34-388950.mp3");
  /** @type {number} */
  chickenSpawnInterval;
  /** @type {number} */
  animationFrameId;
  /** @type {number} */
  gameLoopIntervalId;
  /** @type {WorldAudio} */
  audio;
  /** @type {WorldCollision} */
  collision;
  /** @type {WorldRenderer} */
  renderer;

  /**
   * Creates a new World instance and initializes the game.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audio = new WorldAudio(this);
    this.collision = new WorldCollision(this);
    this.renderer = new WorldRenderer(this);
    this.initializeCounts();
    this.loadEndScreenImages();
    this.audio.setupAudioSettings();
    this.initializeHealthBar();
    this.draw();
    this.setWorld();
  }

  /**
   * Initializes coin, bottle, and enemy counts.
   */
  initializeCounts() {
    this.totalCoins = this.level.coins.length;
    this.totalBottles = this.level.bottles.length;
    this.totalEnemies = this.level.enemies.length;
  }

  /**
   * Synchronizes health bar with character energy.
   */
  initializeHealthBar() {
    this.healthBar.setPercentage(this.character.energy);
  }

  /**
   * Loads end screen images for win/lose.
   */
  loadEndScreenImages() {
    this.youWonImage.src = "img/You%20won,%20you%20lost/You%20won%20A.png";
    this.youLostImage.src = "img/You%20won,%20you%20lost/You%20lost.png";
    this.restartButtonImg.src =
      "img/9_intro_outro_screens/start/startscreen_2.png";
    this.mainMenuButtonImg.src =
      "img/9_intro_outro_screens/start/startscreen_1.png";
  }

  /**
   * Sets the world reference in character and enemies.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
  }

  /**
   * Mutes or unmutes all game sounds.
   * @param {boolean} muted - Whether to mute the sounds.
   */
  setSoundMuted(muted) {
    this.soundMuted = muted;
    this.audio.setSoundMuted(muted);
  }

  /**
   * Plays the intro sound if browser allows auto-play.
   */
  playIntroSound() {
    this.audio.playIntroSound();
  }

  /**
   * Starts the game, begins game loop and sound.
   */
  startGame() {
    this.initializeGameState();
    this.audio.stopIntroSound();
    this.audio.playStartSounds();
    this.run();
  }

  /**
   * Initializes game state variables.
   */
  initializeGameState() {
    this.gameStarted = true;
    this.chickensCanMove = true;
  }

  /**
   * Starts the main game loop.
   */
  run() {
    this.gameLoopIntervalId = setInterval(() => {
      this.performGameLoop();
    }, 100);
  }

  /**
   * Performs one iteration of game loop.
   */
  performGameLoop() {
    if (this.isPaused || this.gameIsOver) return;
    this.collision.checkCollisions();
    this.checkThrowObjects();
    this.checkGameStatus();
  }

  /**
   * Starts spawning chickens at intervals.
   */
  startChickenSpawning() {
    this.chickenSpawnInterval = setInterval(() => {
      this.spawnChicken();
    }, 3000);
  }

  /**
   * Spawns a random chicken in the level.
   */
  spawnChicken() {
    if (this.shouldSpawnChicken()) {
      const chicken = this.createRandomChicken();
      this.addChickenToLevel(chicken);
    }
  }

  /**
   * Checks if chicken should spawn.
   * @returns {boolean} True if should spawn.
   */
  shouldSpawnChicken() {
    return (
      !this.gameIsOver &&
      this.gameStarted &&
      this.level.enemies.length < this.totalEnemies
    );
  }

  /**
   * Creates a random chicken type.
   * @returns {Chicken|ChickenSmall} The chicken.
   */
  createRandomChicken() {
    const isSmall = Math.random() < 0.5;
    return isSmall ? new ChickenSmall() : new Chicken();
  }

  /**
   * Adds chicken to the level enemies.
   * @param {Chicken|ChickenSmall} chicken - The chicken.
   */
  addChickenToLevel(chicken) {
    chicken.world = this;
    this.level.enemies.push(chicken);
    this.totalEnemies++;
  }

  /**
   * Checks if character can throw bottle.
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
  }

  /**
   * Checks if character can throw bottle.
   * @returns {boolean} True if can throw.
   */
  canThrowBottle() {
    const now = Date.now();
    const cooldownPassed = now - this.lastThrowTime > 500;
    return (
      (this.keyboard.D || this.keyboard.S) &&
      this.bottlesCollectedCount > 0 &&
      cooldownPassed
    );
  }

  /**
   * Creates and throws a bottle.
   */
  throwBottle() {
    const direction = this.character.otherDirection;
    const offsetX = direction ? -10 : 100;
    const bottle = new ThrowableObject(
      this.character.x + offsetX,
      this.character.y + 100,
      direction,
    );
    this.throwableObjects.push(bottle);
    this.bottlesCollectedCount--;
    this.lastThrowTime = Date.now();
    this.updateBottleBar();
  }

  /**
   * Updates bottle bar percentage.
   */
  updateBottleBar() {
    this.bottleBar.setPercentage(
      (this.bottlesCollectedCount / this.totalBottles) * 100,
    );
  }

  /**
   * Checks game status for win/lose conditions.
   */
  checkGameStatus() {
    this.checkEndbossDefeat();
    this.checkPlayerDeath();
    this.checkBottleDepletion();
  }

  /**
   * Checks if endboss is defeated (win condition).
   */
  checkEndbossDefeat() {
    const endboss = this.findEndboss();
    if (this.isEndbossDefeated(endboss) && !this.endbossDefeated) {
      this.endbossDefeated = true;
      endboss.die();
      setTimeout(() => {
        this.triggerWinCondition();
      }, 2000);
    }
  }

  /**
   * Finds the endboss in the level.
   * @returns {Endboss|undefined} The endboss.
   */
  findEndboss() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }

  /**
   * Checks if endboss is defeated.
   * @param {Endboss|undefined} endboss - The endboss.
   * @returns {boolean} True if defeated.
   */
  isEndbossDefeated(endboss) {
    return endboss && endboss.energy <= 0;
  }

  /**
   * Triggers win condition and ends game.
   */
  triggerWinCondition() {
    this.gameWon = true;
    if (!this.soundMuted) {
      this.winnerSound.play().catch(() => {});
    }
    this.showEndScreen(this.youWonImage);
  }

  /**
   * Checks if character is dead (lose condition).
   */
  checkPlayerDeath() {
    if (this.character.isDead()) {
      this.triggerGameOver();
    }
  }

  /**
   * Checks if character runs out of bottles before endboss dies.
   */
  checkBottleDepletion() {
    if (this.isBottleDepleted()) {
      this.triggerGameOver();
    }
  }

  /**
   * Checks if bottles are depleted and endboss alive.
   * @returns {boolean} True if depleted.
   */
  isBottleDepleted() {
    const endboss = this.findEndboss();
    return (
      this.bottlesCollectedCount === 0 &&
      this.level.bottles.length === 0 &&
      endboss &&
      endboss.energy > 0 &&
      this.renderer.isEndbossVisible()
    );
  }

  /**
   * Triggers game over and ends game.
   */
  triggerGameOver() {
    this.gameLost = true;
    this.audio.playGameOverSounds();
    this.showEndScreen(this.youLostImage);
  }

  /**
   * Ends the game and stops all intervals.
   */
  endGame() {
    this.gameIsOver = true;
    this.chickensCanMove = false;
    clearInterval(this.gameLoopIntervalId);
    clearInterval(this.chickenSpawnInterval);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.audio.stopGameMusic();
  }

  /**
   * Shows the end screen (win or lose).
   * @param {HTMLImageElement} image - The end screen image.
   */
  showEndScreen(image) {
    setTimeout(() => {
      this.renderer.drawEndScreen(image);
      this.endGame();
    }, 1000);
  }

  /**
   * Main draw method, renders the game world.
   */
  draw() {
    this.renderer.draw();
    if (this.isPaused && this.gameStarted) {
      this.renderer.drawPauseScreen();
    }
    if (!this.gameIsOver) {
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
  }

  /**
   * Toggles game pause state.
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    this.audio.handlePauseMusic();
    if (this.isPaused) {
      this.pauseCharacterAndEnemies();
    } else {
      this.resumeCharacterAndEnemies();
    }
  }

  /**
   * Pauses character and enemy animations.
   */
  pauseCharacterAndEnemies() {
    this.character.pauseAnimation();
    this.level.enemies.forEach((enemy) => {
      if (enemy.pauseAnimation) enemy.pauseAnimation();
    });
  }

  /**
   * Resumes character and enemy animations.
   */
  resumeCharacterAndEnemies() {
    this.character.resumeAnimation();
    this.level.enemies.forEach((enemy) => {
      if (enemy.resumeAnimation) enemy.resumeAnimation();
    });
  }
}
