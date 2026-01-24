let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  initLevel(); // Initialisiere level1 bevor World erstellt wird
  world = new World(canvas, keyboard);

  console.log("My Character is", world.character);

  // Versuche Sound direkt zu starten
  world.playIntroSound();
}

function toggleFullscreen() {
  let container = document.getElementById("canvas-container");

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((err) => {
      console.log("Fullscreen error:", err);
    });
  } else {
    document.exitFullscreen();
  }
}

let soundMuted = false;

function toggleSound() {
  soundMuted = !soundMuted;
  let soundBtn = document.getElementById("sound-btn");
  let soundIcon = document.getElementById("sound-icon");

  if (soundMuted) {
    soundBtn.classList.add("muted");
    // Ändere Icon zu Mute-Symbol
    soundIcon.innerHTML =
      '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
  } else {
    soundBtn.classList.remove("muted");
    // Ändere Icon zu Sound-Symbol
    soundIcon.innerHTML =
      '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
  }

  if (world) {
    world.setSoundMuted(soundMuted);
  }
}

function startGameMobile() {
  if (world && !world.gameStarted) {
    world.startGame();
    // Verstecke Start-Button
    document.getElementById("mobile-start-btn").classList.add("hidden");
  }
}

document.addEventListener("keydown", (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38) {
    keyboard.UP = true;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 68) {
    keyboard.D = true;
  }
  if (event.keyCode == 83) {
    keyboard.S = true;
  }
  if (event.keyCode == 70) {
    // F-Taste für Fullscreen
    toggleFullscreen();
  }
  if (event.keyCode == 77) {
    // M-Taste für Sound Mute/Unmute
    toggleSound();
  }
  if (event.keyCode == 13) {
    keyboard.ENTER = true;
    // Starte Spiel wenn noch nicht gestartet
    if (world && !world.gameStarted) {
      world.startGame();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38) {
    keyboard.UP = false;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (event.keyCode == 68) {
    keyboard.D = false;
  }
  if (event.keyCode == 83) {
    keyboard.S = false;
  }
  if (event.keyCode == 13) {
    keyboard.ENTER = false;
  }
});

// Mobile Touch Controls
function initMobileControls() {
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");
  const btnJump = document.getElementById("btn-jump");
  const btnThrow = document.getElementById("btn-throw");

  // Verhindere Standard-Touch-Verhalten
  document.querySelectorAll(".mobile-btn").forEach((btn) => {
    btn.addEventListener("touchstart", (e) => e.preventDefault());
  });

  // Links
  btnLeft.addEventListener("touchstart", () => (keyboard.LEFT = true));
  btnLeft.addEventListener("touchend", () => (keyboard.LEFT = false));
  btnLeft.addEventListener("touchcancel", () => (keyboard.LEFT = false));

  // Rechts
  btnRight.addEventListener("touchstart", () => (keyboard.RIGHT = true));
  btnRight.addEventListener("touchend", () => (keyboard.RIGHT = false));
  btnRight.addEventListener("touchcancel", () => (keyboard.RIGHT = false));

  // Springen
  btnJump.addEventListener("touchstart", () => (keyboard.SPACE = true));
  btnJump.addEventListener("touchend", () => (keyboard.SPACE = false));
  btnJump.addEventListener("touchcancel", () => (keyboard.SPACE = false));

  // Flasche werfen
  btnThrow.addEventListener("touchstart", () => (keyboard.S = true));
  btnThrow.addEventListener("touchend", () => (keyboard.S = false));
  btnThrow.addEventListener("touchcancel", () => (keyboard.S = false));
}

// Initialisiere Mobile Controls nach DOM-Load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileControls);
} else {
  initMobileControls();
}
