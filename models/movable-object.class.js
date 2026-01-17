class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};

  //loadImage('img/test.png);
  loadImage(path) {
    this.img = new Image(); //this.img = document.getElementByID('image') <img id="image" src>
    this.img.src = path;
  }

  loadImage(arr) {
    let img = new Image();
    img.src = 
  }

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {}
}
