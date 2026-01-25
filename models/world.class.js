/**
 * Main game engine that manages all game objects and rendering.
 * Handles game loop, collisions, audio, and game states.
 * @class
 */
class World {
  /** @type {Character} The playable character */
  character = new Character();
  /** @type {Level} Current game level */
  level = level1;
  /** @type {HTMLCanvasElement} Canvas element */
  canvas;
  /** @type {CanvasRenderingContext2D} Canvas rendering context */
  ctx;
  /** @type {Keyboard} Keyboard input handler */
  keyboard;
  /** @type {number} Camera X-offset for scrolling */
  camera_x = 0;
  /** @type {HealthBar} Character health display */
  healthBar = new HealthBar();
  /** @type {CoinBar} Collected coins display */
  coinBar = new CoinBar();
  /** @type {BottleBar} Collected bottles display */
  bottleBar = new BottleBar();
  /** @type {EndbossBar} Endboss health display */
  endbossBar = new EndbossBar();
  /** @type {ThrowableObject[]} Array of thrown bottles */
  throwableObjects = [];
  /** @type {number} Number of coins collected */
  collectedCoins = 0;
  /** @type {number} Number of bottles collected */
  collectedBottles = 0;
  /** @type {number} Total coins in level */
  totalCoins = 0;
  /** @type {number} Total bottles in level */
  totalBottles = 0;
  /** @type {boolean} Win condition flag */
  gameWon = false;
  /** @type {boolean} Lose condition flag */
  gameLost = false;
  /** @type {boolean} Game started flag */
  gameStarted = false;
  /** @type {boolean} Chickens movement enabled */
  chickensCanMove = false;
  /** @type {boolean} Game paused state */
  isPaused = false;
  /** @type {boolean} Endboss warning played */
  endbossSoundPlayed = false;
  /** @type {Image} Win screen image */
  youWonImage = new Image();
  /** @type {Image} Game over image */
  youLostImage = new Image();
  /** @type {Image} Start screen image */
  startScreenImage = new Image();
  /** @type {Audio} Intro music */
  introSound = new Audio("audio/game-intro-345507.mp3");
  /** @type {Audio} Game start sound */
  gameStartSound = new Audio("audio/game-start-6104.mp3");
  /** @type {Audio} Bottle collect sound */
  bottleCollectSound = new Audio(
    "audio/fantasy-game-sword-cut-sound-effect-get-more-on-my-patreon-339824.mp3",
  );
  coinCollectSound = new Audio("audio/game-bonus-02-294436.mp3");
  gameMusicLoop = new Audio("audio/game-music-loop-6-144641.mp3");
  endbossWarningSound = new Audio("audio/wrong-place-129242.mp3");
  winnerSound = new Audio("audio/winner-game-sound-404167.mp3");
  gameOverSound1 = new Audio("audio/game-over-160612.mp3");
  gameOverSound2 = new Audio("audio/game-over-38511.mp3");
  jumpKillSound = new Audio("audio/retro-game-shot-152052.mp3");
  chickenKillSound = new Audio(
    "audio/muffled-sound-of-falling-game-character-131797.mp3",
  );
  smallChickenHitSound = new Audio("audio/game-character-scream-131144.mp3");
  endbossHitSound = new Audio("audio/rpg-sword-attack-combo-34-388950.mp3");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.initializeCounts();
    this.loadEndScreenImages();
    this.setupAudioSettings();
    this.draw();
    this.setWorld();
  }

  initializeCounts() {
    this.totalCoins = this.level.coins.length;
    this.totalBottles = this.level.bottles.length;
  }

  loadEndScreenImages() {
    this.youWonImage.src = "img/You won, you lost/You won A.png";
    this.youLostImage.src = "img/You won, you lost/You lost.png";
    this.startScreenImage.src =
      "img/9_intro_outro_screens/start/startscreen_1.png";
  }

  setupAudioSettings() {
    this.introSound.loop = true;
    this.introSound.volume = 0.3;
    this.gameMusicLoop.loop = true;
    this.gameMusicLoop.volume = 0.4;
  }

  setWorld() {
    this.character.world = this;
    // Set world reference for all enemies
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  playIntroSound() {
    // Try to play sound (only if user has interacted)
    this.introSound.play().catch(() => {
      // Ignore error if browser blocks auto-play
      console.log("Audio will only play after user interaction");
    });
  }

  setSoundMuted(muted) {
    this.setMainSoundVolumes(muted);
    this.setEffectSoundVolumes(muted);
  }

  setMainSoundVolumes(muted) {
    this.introSound.volume = muted ? 0 : 0.3;
    this.gameMusicLoop.volume = muted ? 0 : 0.4;
  }

  setEffectSoundVolumes(muted) {
    const volume = muted ? 0 : 1;
    this.setCollectSoundVolumes(volume);
    this.setDeathAndCombatSoundVolumes(volume);
  }

  setCollectSoundVolumes(volume) {
    this.gameStartSound.volume = volume;
    this.bottleCollectSound.volume = volume;
    this.coinCollectSound.volume = volume;
    this.endbossWarningSound.volume = volume;
  }

  setDeathAndCombatSoundVolumes(volume) {
    this.winnerSound.volume = volume;
    this.gameOverSound1.volume = volume;
    this.gameOverSound2.volume = volume;
    this.jumpKillSound.volume = volume;
    this.chickenKillSound.volume = volume;
    this.smallChickenHitSound.volume = volume;
    this.endbossHitSound.volume = volume;
  }

  startGame() {
    this.gameStarted = true;
    this.stopIntroSound();
    this.playStartSounds();
    this.run();
    this.startChickenSpawning();
  }

  stopIntroSound() {
    this.introSound.pause();
    this.introSound.currentTime = 0;
  }

  playStartSounds() {
    this.gameStartSound.play();
    setTimeout(() => {
      this.gameMusicLoop.play();
    }, 500);
  }

  run() {
    setInterval(() => {
      this.performGameLoop();
    }, 200);
  }

  performGameLoop() {
    this.checkCollisions();
    this.checkThrowObjects();
    this.removeOldBottles();
    this.checkGameStatus();
  }

  startChickenSpawning() {
    this.chickenSpawnInterval = setInterval(() => {
      if (this.canSpawnChicken()) {
        this.spawnChicken();
        this.removeDeadChickens();
      }
    }, 3000);
  }

  canSpawnChicken() {
    return !this.gameWon && !this.gameLost && this.gameStarted;
  }

  removeDeadChickens() {
    this.level.enemies = this.level.enemies.filter(
      (e) => !e.isDead || e instanceof Endboss,
    );
  }

  spawnChicken() {
    let chickenCount = this.countActiveChickens();
    if (chickenCount < 8) {
      this.createAndAddChicken();
    }
  }

  countActiveChickens() {
    return this.level.enemies.filter(
      (e) => (e instanceof Chicken || e instanceof ChickenSmall) && !e.isDead,
    ).length;
  }

  createAndAddChicken() {
    let newChicken = this.createRandomChicken();
    this.setChickenPosition(newChicken);
    this.addChickenToLevel(newChicken);
  }

  addChickenToLevel(chicken) {
    chicken.world = this;
    this.level.enemies.push(chicken);
  }

  createRandomChicken() {
    return Math.random() > 0.5 ? new Chicken() : new ChickenSmall();
  }

  setChickenPosition(chicken) {
    chicken.x = this.character.x + 400 + Math.random() * 800;
    if (chicken.x > 2000) {
      chicken.x = Math.random() * 1500;
    }
  }

  checkThrowObjects() {
    if (this.keyboard.S && this.collectedBottles > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
        this.character.otherDirection,
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      let percentage = (this.collectedBottles / this.totalBottles) * 100;
      this.bottleBar.setPercentage(percentage);
      this.keyboard.S = false; // Prevent multiple throws
    }
  }

  checkCollisions() {
    this.checkAllCollisionTypes();
  }

  checkAllCollisionTypes() {
    this.checkEnemyCollisions();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableObjectCollisions();
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.isEnemyColliding(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  isEnemyColliding(enemy) {
    return this.character.isColliding(enemy);
  }

  handleEnemyCollision(enemy) {
    if (this.isJumpKill(enemy)) {
      this.handleJumpKill(enemy);
    } else {
      this.handleNonJumpCollision(enemy);
    }
  }

  handleNonJumpCollision(enemy) {
    if (!this.isDeadChicken(enemy)) {
      this.handleNormalCollision(enemy);
    }
  }

  isJumpKill(enemy) {
    return (
      this.isChickenType(enemy) &&
      !enemy.isDead &&
      this.isCharacterFallingFromAbove()
    );
  }

  isChickenType(enemy) {
    return enemy instanceof Chicken || enemy instanceof ChickenSmall;
  }

  isCharacterFallingFromAbove() {
    return this.character.isAboveGround() && this.character.speedY < 0;
  }

  isDeadChicken(enemy) {
    return (
      (enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
      enemy.isDead
    );
  }

  handleJumpKill(enemy) {
    if (!enemy.isDead) {
      enemy.kill();
      this.character.speedY = 18;
      this.playJumpKillSound(enemy);
    }
  }

  playJumpKillSound(enemy) {
    if (enemy instanceof ChickenSmall) {
      this.jumpKillSound.currentTime = 0;
      this.jumpKillSound.play();
    } else {
      this.chickenKillSound.currentTime = 0;
      this.chickenKillSound.play();
    }
  }

  handleNormalCollision(enemy) {
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
    if (enemy instanceof ChickenSmall) {
      this.smallChickenHitSound.currentTime = 0;
      this.smallChickenHitSound.play();
    }
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  collectCoin(index) {
    this.level.coins.splice(index, 1);
    this.collectedCoins++;
    this.updateCoinBar();
    this.playCoinSound();
  }

  updateCoinBar() {
    let percentage = (this.collectedCoins / this.totalCoins) * 100;
    this.coinBar.setPercentage(percentage);
  }

  playCoinSound() {
    this.coinCollectSound.currentTime = 0;
    this.coinCollectSound.play();
  }

  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.collectBottle(index);
      }
    });
  }

  collectBottle(index) {
    this.level.bottles.splice(index, 1);
    this.collectedBottles++;
    this.updateBottleBar();
    this.playBottleSound();
  }

  updateBottleBar() {
    let percentage = (this.collectedBottles / this.totalBottles) * 100;
    this.bottleBar.setPercentage(percentage);
  }

  playBottleSound() {
    this.bottleCollectSound.currentTime = 0;
    this.bottleCollectSound.play();
  }

  checkThrowableObjectCollisions() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.checkBottleHitEndboss(bottle, bottleIndex);
    });
  }

  checkBottleHitEndboss(bottle, bottleIndex) {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
        this.hitEndboss(bottleIndex, enemy);
      }
    });
  }

  hitEndboss(bottleIndex, enemy) {
    let bottle = this.throwableObjects[bottleIndex];
    bottle.splash();
    setTimeout(() => {
      this.throwableObjects.splice(bottleIndex, 1);
    }, 200);
    this.damageEndboss(enemy);
  }

  damageEndboss(endboss) {
    endboss.hit();
    this.endbossBar.setPercentage(endboss.energy);
    this.endbossHitSound.currentTime = 0;
    this.endbossHitSound.play();
  }

  draw() {
    this.renderCurrentScreen();
    requestAnimationFrame(() => this.draw());
  }

  renderCurrentScreen() {
    if (!this.gameStarted) {
      this.drawStartScreen();
    } else if (this.isPaused) {
      this.drawPauseScreen();
    } else {
      this.renderGameWorld();
    }
  }

  renderGameWorld() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderBackground();
    this.renderStatusBars();
    this.renderMainGameContent();
    this.renderEndScreens();
  }

  renderBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  renderMainGameContent() {
    this.ctx.translate(this.camera_x, 0);
    this.renderGameObjects();
    this.ctx.translate(-this.camera_x, 0);
  }

  renderStatusBars() {
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.renderEndbossBar();
  }

  renderEndbossBar() {
    if (this.isEndbossVisible()) {
      this.addToMap(this.endbossBar);
      this.playEndbossWarningSound();
    }
  }

  playEndbossWarningSound() {
    if (!this.endbossSoundPlayed) {
      this.endbossWarningSound.play();
      this.endbossSoundPlayed = true;
    }
  }

  renderGameObjects() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
  }

  renderEndScreens() {
    if (this.gameWon) {
      this.drawEndScreen(this.youWonImage);
    } else if (this.gameLost) {
      this.drawEndScreen(this.youLostImage);
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  removeOldBottles() {
    this.throwableObjects = this.throwableObjects.filter(
      (bottle) => !this.shouldRemoveBottle(bottle),
    );
  }

  shouldRemoveBottle(bottle) {
    let age = Date.now() - bottle.creationTime;
    return bottle.y >= 380 || age > 3000 || bottle.x > 3000;
  }

  checkGameStatus() {
    this.checkEndbossDefeat();
    this.checkPlayerDeath();
    this.checkBottleDepletion();
  }

  checkEndbossDefeat() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead && !this.gameWon) {
      this.gameWon = true;
      this.stopGameMusic();
      this.winnerSound.play();
    }
  }

  stopGameMusic() {
    this.gameMusicLoop.pause();
    this.endbossWarningSound.pause();
  }

  checkPlayerDeath() {
    if (this.character.energy <= 0 && !this.gameLost) {
      this.gameLost = true;
      this.gameMusicLoop.pause();
      this.playGameOverSounds();
    }
  }

  playGameOverSounds() {
    this.gameOverSound1.play();
    this.gameOverSound2.play();
  }

  checkBottleDepletion() {
    if (this.noBottlesAvailable() && !this.gameLost && !this.gameWon) {
      this.gameLost = true;
      this.gameMusicLoop.pause();
      this.playGameOverSounds();
    }
  }

  noBottlesAvailable() {
    return this.collectedBottles === 0 && this.level.bottles.length === 0;
  }

  drawEndScreen(image) {
    this.drawCenteredImage(image);
    this.drawRestartButton();
    this.drawMainMenuButton();
  }

  drawCenteredImage(image) {
    let x = (this.canvas.width - 720) / 2;
    let y = (this.canvas.height - 480) / 2;
    this.ctx.drawImage(image, x, y, 720, 480);
  }

  drawRestartButton() {
    this.drawButtonRect();
    this.drawButtonText();
  }

  drawButtonRect() {
    this.ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
    this.ctx.fillRect(
      this.canvas.width / 2 - 100,
      this.canvas.height - 100,
      200,
      50,
    );
  }

  drawButtonText() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "NEUSTART",
      this.canvas.width / 2,
      this.canvas.height - 70,
    );
  }

  drawMainMenuButton() {
    this.drawMainMenuRect();
    this.drawMainMenuText();
  }

  drawMainMenuRect() {
    this.ctx.fillStyle = "rgba(50, 150, 255, 0.9)";
    this.ctx.fillRect(
      this.canvas.width / 2 - 100,
      this.canvas.height - 170,
      200,
      50,
    );
  }

  drawMainMenuText() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "HAUPTMENÜ",
      this.canvas.width / 2,
      this.canvas.height - 140,
    );
  }

  drawStartScreen() {
    this.drawFullScreenImage(this.startScreenImage);
    this.drawStartText();
  }

  drawFullScreenImage(image) {
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
  }

  drawStartText() {
    if (!this.isTouchDevice()) {
      this.ctx.fillStyle = "white";
      this.ctx.font = "30px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Drücke ENTER zum Starten",
        this.canvas.width / 2,
        this.canvas.height - 50,
      );
    }
  }

  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  drawPauseScreen() {
    this.drawDarkOverlay();
    this.drawPauseText();
    this.drawContinueText();
  }

  drawDarkOverlay() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPauseText() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 60px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "PAUSIERT",
      this.canvas.width / 2,
      this.canvas.height / 2 - 20,
    );
  }

  drawContinueText() {
    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Drücke ESC oder P zum Fortfahren",
      this.canvas.width / 2,
      this.canvas.height / 2 + 40,
    );
  }

  togglePause() {
    if (!this.gameStarted || this.gameWon || this.gameLost) return;
    this.isPaused = !this.isPaused;
    this.handlePauseMusic();
  }

  handlePauseMusic() {
    if (this.isPaused) {
      this.gameMusicLoop.pause();
    } else {
      if (!this.soundMuted) {
        this.gameMusicLoop.play();
      }
    }
  }

  isEndbossVisible() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss) {
      return this.isEnemyInCamera(endboss);
    }
    return false;
  }

  isEnemyInCamera(enemy) {
    let endbossRightEdge = enemy.x + enemy.width;
    let endbossLeftEdge = enemy.x;
    let cameraLeftEdge = -this.camera_x;
    let cameraRightEdge = -this.camera_x + this.canvas.width;
    return (
      endbossRightEdge > cameraLeftEdge && endbossLeftEdge < cameraRightEdge
    );
  }
}
