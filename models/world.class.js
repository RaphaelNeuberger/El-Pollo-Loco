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
  youWonImage = new Image();
  youLostImage = new Image();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.totalCoins = this.level.coins.length;
    this.totalBottles = this.level.bottles.length;
    this.youWonImage.src = "img/You won, you lost/You won A.png";
    this.youLostImage.src = "img/You won, you lost/You lost.png";
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    // Setze world-Referenz für alle Enemies
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.removeOldBottles();
      this.checkGameStatus();
    }, 200);
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
      this.keyboard.S = false; // Verhindere Mehrfachwurf
    }
  }

  checkCollisions() {
    // Feindkollisionen mit Jump-Kill Mechanik
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        // Prüfe ob Character auf Chicken springt (von oben)
        if (
          enemy instanceof Chicken &&
          !enemy.isDead &&
          this.character.speedY < 0 &&
          this.character.y + this.character.height - 20 < enemy.y + 20
        ) {
          // Character springt auf Chicken (Character Füße sind über Chicken Kopf)
          enemy.kill();
          this.character.speedY = 15; // Kleiner Bounce
        } else if (!(enemy instanceof Chicken && enemy.isDead)) {
          // Normale Kollision (Schaden)
          this.character.hit();
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });

    // Münz-Kollisionen
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        this.collectedCoins++;
        let percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.coinBar.setPercentage(percentage);
      }
    });

    // Flaschen-Kollisionen
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.level.bottles.splice(index, 1);
        this.collectedBottles++;
        let percentage = (this.collectedBottles / this.totalBottles) * 100;
        this.bottleBar.setPercentage(percentage);
      }
    });

    // Geworfene Flaschen vs Endboss
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss && bottle.isColliding(enemy)) {
          this.throwableObjects.splice(bottleIndex, 1);
          enemy.hit();
          this.endbossBar.setPercentage(enemy.energy);
        }
      });
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
    // Prüfe ob Endboss besiegt wurde
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead) {
      this.gameWon = true;
    }

    // Prüfe ob Spieler gestorben ist
    if (this.character.energy <= 0) {
      this.gameLost = true;
    }
  }

  drawEndScreen(image) {
    // Zeichne das End-Screen Bild zentriert
    let x = (this.canvas.width - 720) / 2;
    let y = (this.canvas.height - 480) / 2;
    this.ctx.drawImage(image, x, y, 720, 480);
  }

  isEndbossVisible() {
    // Finde den Endboss im Level
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss) {
      // Prüfe ob Endboss im sichtbaren Bereich ist (Kamera-Position)
      // Sichtbarer Bereich: -camera_x bis -camera_x + canvas.width
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
