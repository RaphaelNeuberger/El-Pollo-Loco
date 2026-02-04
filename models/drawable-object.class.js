/**
 * Base class for all drawable game objects.
 * Handles image loading, caching, and rendering on canvas.
 * @class
 */
class DrawableObject {
  /** @type {HTMLImageElement} */
  img;
  /** @type {Object.<string, HTMLImageElement>} */
  imageCache = {};
  /** @type {number} */
  currentImage = 0;
  /** @type {number} */
  x = 120;
  /** @type {number} */
  y = 280;
  /** @type {number} */
  height = 150;
  /** @type {number} */
  width = 100;
  /** @type {Object} Collision offset for precise hitboxes */
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * Loads a single image from the specified path.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image(); //this.img = document.getElementByID('image') <img id="image" src>
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a debug frame around the object (for collision debugging).
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof ChickenSmall ||
      this instanceof Endboss ||
      this instanceof ThrowableObject ||
      this instanceof Coin ||
      this instanceof Bottle
    ) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();

      // Draw actual collision box with offset
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom,
      );
      ctx.stroke();
    }
  }

  /**
   * Preloads multiple images and stores them in cache.
   * Used for sprite animations.
   * @param {string[]} arr - Array of image paths to preload
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      img.style = "transform: scaleX(-1)";
      this.imageCache[path] = img;
    });
  }
}
