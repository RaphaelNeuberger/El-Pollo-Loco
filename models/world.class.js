class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthBar = new HealthBar();
  coinBar = new CoinBar();
  bottleBar = new BottleBar();
  endbossBar = new EndbossBar();
  throwableObjects = [];
  collectedCoins = 0;
  collectedBottles = 0;
  totalCoins = 0;
  totalBottles = 0;
  gameWon = false;
  gameLost = false;
  gameStarted = false;
  chickensCanMove = false;
  isPaused = false;
  endbossSoundPlayed = false;
  youWonImage = new Image();
  youLostImage = new Image();
  startScreenImage = new Image();
  introSound = new Audio("audio/game-intro-345507.mp3");
  gameStartSound = new Audio("audio/game-start-6104.mp3");
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
    this.totalCoins = this.level.coins.length;
    this.totalBottles = this.level.bottles.length;
    this.youWonImage.src = "img/You won, you lost/You won A.png";
    this.youLostImage.src = "img/You won, you lost/You lost.png";
    this.startScreenImage.src =
      "img/9_intro_outro_screens/start/startscreen_1.png";
    this.introSound.loop = true;
    this.introSound.volume = 0.3;
    this.gameMusicLoop.loop = true;
    this.gameMusicLoop.volume = 0.4;
    // Sound will only play after user interaction (ENTER)
    this.draw();
    this.setWorld();
    // run() will only be called when game starts
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
    // Set volume of all audio objects to 0 or back
    const volume = muted ? 0 : 1;
    this.introSound.volume = muted ? 0 : 0.3;
    this.gameMusicLoop.volume = muted ? 0 : 0.4;
    this.gameStartSound.volume = volume;
    this.bottleCollectSound.volume = volume;
    this.coinCollectSound.volume = volume;
    this.endbossWarningSound.volume = volume;
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
    this.introSound.pause();
    this.introSound.currentTime = 0;
    this.gameStartSound.play();
    // Start game music after short delay (so start sound is audible)
    setTimeout(() => {
      this.gameMusicLoop.play();
    }, 500);
    // Chickens stay still until character moves
    this.run();
    this.startChickenSpawning();
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.removeOldBottles();
      this.checkGameStatus();
    }, 200);
  }

  startChickenSpawning() {
    // Spawne alle 3 Sekunden ein neues Chicken
    this.chickenSpawnInterval = setInterval(() => {
      if (!this.gameWon && !this.gameLost && this.gameStarted) {
        this.spawnChicken();
        // Entferne tote Chickens aus Array (Performance)
        this.level.enemies = this.level.enemies.filter(
          (e) => !e.isDead || e instanceof Endboss,
        );
      }
    }, 3000);
  }

  spawnChicken() {
    // Count current chickens (without endboss)
    let chickenCount = this.level.enemies.filter(
      (e) => (e instanceof Chicken || e instanceof ChickenSmall) && !e.isDead,
    ).length;

    // Maximum number of chickens at the same time: 8
    if (chickenCount < 8) {
      // 50% chance for normal or small chicken
      let newChicken = Math.random() > 0.5 ? new Chicken() : new ChickenSmall();

      // Spawn chicken at random position before endboss (x < 2000)
      newChicken.x = this.character.x + 400 + Math.random() * 800;
      if (newChicken.x > 2000) {
        newChicken.x = Math.random() * 1500;
      }

      newChicken.world = this;
      this.level.enemies.push(newChicken);
    }
  }

  checkThrowObjects() {
    if (this.keyboard.S && this.collectedBottles > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      let percentage = (this.collectedBottles / this.totalBottles) * 100;
      this.bottleBar.setPercentage(percentage);
      this.keyboard.S = false; // Prevent multiple throws
    }
  }

  checkCollisions() {
    // Enemy collisions with jump-kill mechanic
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        // Check if character jumps on chicken (from above)
        if (
          (enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
          !enemy.isDead &&
          this.character.speedY < 0
        ) {
          // Character jumps on chicken - kill it whenever character is falling
          enemy.kill();
          this.character.speedY = 18; // Stronger bounce
          // Play different sounds for chicken and small chicken
          if (enemy instanceof ChickenSmall) {
            this.jumpKillSound.currentTime = 0;
            this.jumpKillSound.play();
          } else {
            this.chickenKillSound.currentTime = 0;
            this.chickenKillSound.play();
          }
        } else if (
          !(
            (enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
            enemy.isDead
          )
        ) {
          // Normal collision (damage) - for all enemies including endboss
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
          // Play sound when small chicken touches character
          if (enemy instanceof ChickenSmall) {
            this.smallChickenHitSound.currentTime = 0;
            this.smallChickenHitSound.play();
          }
        }
      }
    });

    // Coin collisions
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        let percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.coinBar.setPercentage(percentage);
        this.coinCollectSound.currentTime = 0;
        this.coinCollectSound.play();
      }
    });

    // Flaschen-Kollisionen
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(index, 1);
        this.collectedBottles++;
        let percentage = (this.collectedBottles / this.totalBottles) * 100;
        this.bottleBar.setPercentage(percentage);
        this.bottleCollectSound.currentTime = 0;
        this.bottleCollectSound.play();
      }
    });

    // Geworfene Flaschen vs Endboss
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
          this.throwableObjects.splice(bottleIndex, 1);
          enemy.hit();
          this.endbossBar.setPercentage(enemy.energy);
          this.endbossHitSound.currentTime = 0;
          this.endbossHitSound.play();
        }
      });
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Start Screen anzeigen wenn Spiel noch nicht gestartet
    if (!this.gameStarted) {
      this.drawStartScreen();
    } else if (this.isPaused) {
      // Pause Screen anzeigen
      this.drawPauseScreen();
    } else {
      // Normales Spiel zeichnen
      this.ctx.translate(this.camera_x, 0);

      this.addObjectsToMap(this.level.backgroundObjects);

      this.ctx.translate(-this.camera_x, 0); //back
      // // space for fix Objects
      this.addToMap(this.healthBar);
      this.addToMap(this.coinBar);
      this.addToMap(this.bottleBar);
      // Endboss Bar nur anzeigen wenn Endboss im sichtbaren Bereich
      if (this.isEndbossVisible()) {
        this.addToMap(this.endbossBar);
        // Spiele Warnsound einmalig ab wenn Endboss zum ersten Mal sichtbar ist
        if (!this.endbossSoundPlayed) {
          this.endbossWarningSound.play();
          this.endbossSoundPlayed = true;
        }
      }
      this.ctx.translate(this.camera_x, 0); //Forward

      this.addToMap(this.character);
      this.addObjectsToMap(this.level.clouds);
      this.addObjectsToMap(this.level.enemies);
      this.addObjectsToMap(this.level.coins);
      this.addObjectsToMap(this.level.bottles);
      this.addObjectsToMap(this.throwableObjects);

      this.ctx.translate(-this.camera_x, 0);

      // Zeige Win/Lose Screen
      if (this.gameWon) {
        this.drawEndScreen(this.youWonImage);
      } else if (this.gameLost) {
        this.drawEndScreen(this.youLostImage);
      }
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
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
    // Entferne Flaschen die:
    // - Den Boden erreicht haben (y >= 380)
    // - Zu alt sind (> 3 Sekunden)
    // - Zu weit geflogen sind (x > 3000)
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      let age = Date.now() - bottle.creationTime;
      let isOnGround = bottle.y >= 380;
      let isTooOld = age > 3000;
      let isTooFar = bottle.x > 3000;

      return !isOnGround && !isTooOld && !isTooFar;
    });
  }

  checkGameStatus() {
    // Check if endboss was defeated
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead && !this.gameWon) {
      this.gameWon = true;
      this.gameMusicLoop.pause();
      this.endbossWarningSound.pause();
      this.winnerSound.play();
    }

    // Check if player has died
    if (this.character.energy <= 0 && !this.gameLost) {
      this.gameLost = true;
      this.gameMusicLoop.pause();
      this.gameOverSound1.play();
      this.gameOverSound2.play();
    }

    // Check if no bottles are available (neither collectable nor in inventory)
    if (
      this.collectedBottles === 0 &&
      this.level.bottles.length === 0 &&
      !this.gameLost &&
      !this.gameWon
    ) {
      this.gameLost = true;
      this.gameMusicLoop.pause();
      this.gameOverSound1.play();
      this.gameOverSound2.play();
    }
  }

  drawEndScreen(image) {
    // Zeichne das End-Screen Bild zentriert
    let x = (this.canvas.width - 720) / 2;
    let y = (this.canvas.height - 480) / 2;
    this.ctx.drawImage(image, x, y, 720, 480);

    // Zeichne Restart-Button
    this.ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
    this.ctx.fillRect(
      this.canvas.width / 2 - 100,
      this.canvas.height - 100,
      200,
      50,
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "NEUSTART",
      this.canvas.width / 2,
      this.canvas.height - 70,
    );
  }

  drawStartScreen() {
    // Draw start screen over entire canvas
    this.ctx.drawImage(
      this.startScreenImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );

    // Show "Press ENTER to start" text only on desktop (not on touch devices)
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
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

  drawPauseScreen() {
    // Dark overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // "PAUSED" text
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 60px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "PAUSIERT",
      this.canvas.width / 2,
      this.canvas.height / 2 - 20,
    );

    // "Press ESC or P to continue" text
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

    if (this.isPaused) {
      // Pausiere Musik
      this.gameMusicLoop.pause();
    } else {
      // Setze Musik fort
      if (!this.soundMuted) {
        this.gameMusicLoop.play();
      }
    }
  }

  isEndbossVisible() {
    // Find the endboss in the level
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss) {
      // Check if endboss is in visible area (camera position)
      // Visible area: -camera_x to -camera_x + canvas.width
      let endbossRightEdge = endboss.x + endboss.width;
      let endbossLeftEdge = endboss.x;
      let cameraLeftEdge = -this.camera_x;
      let cameraRightEdge = -this.camera_x + this.canvas.width;

      return (
        endbossRightEdge > cameraLeftEdge && endbossLeftEdge < cameraRightEdge
      );
    }
    return false;
  }
}
