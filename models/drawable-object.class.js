/**
 * Base class for all drawable game objects.
 * Handles image loading, caching, and rendering on canvas.
 * @class
 */
class DrawableObject {
  /** @type {HTMLImageElement} Current image to display */
  img;
  /** @type {Object.<string, HTMLImageElement>} Cache for preloaded images */
  imageCache = {};
  /** @type {number} Index for animation frames */
  currentImage = 0;
  /** @type {number} X-position on canvas */
  x = 120;
  /** @type {number} Y-position on canvas */
  y = 280;
  /** @type {number} Height of the object */
  height = 150;
  /** @type {number} Width of the object */
  width = 100;

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
  drawFrame(ctx) {}

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
