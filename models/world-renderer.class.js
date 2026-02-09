/**
 * Rendering module for the World class.
 * Handles all canvas drawing and rendering operations.
 * @class
 */
class WorldRenderer {
  /**
   * Sets up renderer properties for world instance.
   * @param {World} world - The world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Main draw method, renders the appropriate screen.
   */
  draw() {
    this.renderCurrentScreen();
  }

  /**
   * Renders the appropriate screen based on game state.
   */
  renderCurrentScreen() {
    if (this.world.gameStarted && !this.world.gameIsOver) {
      this.renderGameWorld();
    }
  }

  /**
   * Renders the complete game world.
   */
  renderGameWorld() {
    this.clearCanvas();
    this.renderBackground();
    this.renderStatusBars();
    this.renderEndbossBar();
    this.renderGameObjects();
  }

  /**
   * Clears the canvas for new frame.
   */
  clearCanvas() {
    this.world.ctx.clearRect(
      0,
      0,
      this.world.canvas.width,
      this.world.canvas.height,
    );
  }

  /**
   * Renders background objects and clouds.
   */
  renderBackground() {
    this.world.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToMap(this.world.level.backgroundObjects);
    this.addObjectsToMap(this.world.level.clouds);
  }

  /**
   * Renders status bars (health, coin, bottle).
   */
  renderStatusBars() {
    this.world.ctx.translate(-this.world.camera_x, 0);
    this.addToMap(this.world.healthBar);
    this.addToMap(this.world.coinBar);
    this.addToMap(this.world.bottleBar);
    this.world.ctx.translate(this.world.camera_x, 0);
  }

  /**
   * Renders endboss health bar if visible.
   */
  renderEndbossBar() {
    if (this.isEndbossVisible()) {
      this.world.ctx.translate(-this.world.camera_x, 0);
      this.addToMap(this.world.endbossBar);
      this.world.ctx.translate(this.world.camera_x, 0);
      this.world.audio.playEndbossWarningSound();
    }
  }

  /**
   * Renders all game objects (enemies, items, then character in front).
   */
  renderGameObjects() {
    this.addObjectsToMap(this.world.level.enemies);
    this.addObjectsToMap(this.world.level.coins);
    this.addObjectsToMap(this.world.level.bottles);
    this.addObjectsToMap(this.world.throwableObjects);
    this.addToMap(this.world.character);
    this.world.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Checks if endboss is visible on screen.
   * @returns {boolean} - True if endboss is visible.
   */
  isEndbossVisible() {
    const endboss = this.world.level.enemies.find((e) => e instanceof Endboss);
    if (!endboss) return false;
    return this.isEnemyInCamera(endboss);
  }

  /**
   * Checks if enemy is within camera view.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} - True if in camera.
   */
  isEnemyInCamera(enemy) {
    return (
      enemy.x + enemy.width > -this.world.camera_x &&
      enemy.x < -this.world.camera_x + this.world.canvas.width
    );
  }

  /**
   * Adds multiple objects to the map.
   * @param {DrawableObject[]} objects - Array of objects to add.
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  /**
   * Adds a single object to the map.
   * @param {DrawableObject} mo - The object to add.
   */
  addToMap(mo) {
    this.handleImageFlipping(mo);
    this.drawObject(mo);
    this.restoreImageFlipping(mo);
  }

  /**
   * Flips image horizontally if needed.
   * @param {DrawableObject} mo - The object.
   */
  handleImageFlipping(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
  }

  /**
   * Flips the canvas context for mirrored drawing.
   * @param {DrawableObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.world.ctx.save();
    this.world.ctx.translate(mo.width, 0);
    this.world.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Draws the object on canvas.
   * @param {DrawableObject} mo - The object to draw.
   */
  drawObject(mo) {
    mo.draw(this.world.ctx);
  }

  /**
   * Restores image flipping if applied.
   * @param {DrawableObject} mo - The object.
   */
  restoreImageFlipping(mo) {
    if (mo.otherDirection) {
      this.restoreFlip(mo);
    }
  }

  /**
   * Restores the canvas context after flipping.
   * @param {DrawableObject} mo - The object to restore.
   */
  restoreFlip(mo) {
    mo.x = mo.x * -1;
    this.world.ctx.restore();
  }

  /**
   * Renders the game over or win screen.
   * @param {HTMLImageElement} image - The end screen image.
   */
  drawEndScreen(image) {
    const w = this.world.canvas.width;
    const h = this.world.canvas.height;
    this.world.ctx.clearRect(0, 0, w, h);
    this.world.ctx.drawImage(image, 0, 0, w, h);
    this.drawRestartButton();
    this.drawMainMenuButton();
  }

  /**
   * Draws the restart button on end screen.
   */
  drawRestartButton() {
    const x = this.world.restartButtonX;
    const y = this.world.restartButtonY;
    this.drawButton(x, y, 150, 60, "NEUSTART", "bold 24px Arial");
  }

  /**
   * Draws the main menu button on end screen.
   */
  drawMainMenuButton() {
    const x = this.world.mainMenuButtonX;
    const y = this.world.mainMenuButtonY;
    this.drawButton(x, y, 150, 60, "HAUPTMENÜ", "bold 20px Arial");
  }

  /**
   * Draws a styled button on the canvas.
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} w - Width
   * @param {number} h - Height
   * @param {string} text - Button label
   * @param {string} font - Font style
   */
  drawButton(x, y, w, h, text, font) {
    const ctx = this.world.ctx;
    this.drawButtonBackground(ctx, x, y, w, h);
    this.drawButtonText(ctx, x, y, w, h, text, font);
  }

  /**
   * Draws button background and border.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} w - Width
   * @param {number} h - Height
   */
  drawButtonBackground(ctx, x, y, w, h) {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
  }

  /**
   * Draws centered text on a button.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} w - Width
   * @param {number} h - Height
   * @param {string} text - Button label
   * @param {string} font - Font style
   */
  drawButtonText(ctx, x, y, w, h, text, font) {
    ctx.fillStyle = "#000";
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + w / 2, y + h / 2);
  }

  /**
   * Draws the pause screen overlay.
   */
  drawPauseScreen() {
    this.world.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.world.ctx.fillRect(
      0,
      0,
      this.world.canvas.width,
      this.world.canvas.height,
    );
    this.drawPauseText();
  }

  /**
   * Draws the pause text in center of screen.
   */
  drawPauseText() {
    this.world.ctx.fillStyle = "white";
    this.world.ctx.font = "48px Zabars";
    this.world.ctx.textAlign = "center";
    this.world.ctx.fillText(
      "PAUSED",
      this.world.canvas.width / 2,
      this.world.canvas.height / 2,
    );
  }
}
