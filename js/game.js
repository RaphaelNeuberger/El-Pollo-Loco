let canvas;
let world;
let keyboard = new Keyboard();

// Load sound setting from localStorage
let soundMuted = localStorage.getItem("soundMuted") === "true";

function init() {
  canvas = document.getElementById("canvas");
  initLevel();
  createNewWorld();
  console.log("My Character is", world.character);
  applySavedSoundSettings();
  world.playIntroSound();
}

function applySavedSoundSettings() {
  if (soundMuted) {
    world.setSoundMuted(true);
    updateSoundButton(true);
  }
}

function updateSoundButton(muted) {
  const soundBtn = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");
  applySoundButtonStyle(soundBtn, soundIcon, muted);
}

function applySoundButtonStyle(btn, icon, muted) {
  if (muted) {
    btn.classList.add("muted");
    icon.innerHTML = getMuteIcon();
  } else {
    btn.classList.remove("muted");
    icon.innerHTML = getSoundIcon();
  }
}

function showImpressum() {
  document.getElementById("impressum-modal").style.display = "block";
}

function closeImpressum() {
  document.getElementById("impressum-modal").style.display = "none";
}

function toggleFullscreen() {
  let container = document.getElementById("canvas-container");
  if (!document.fullscreenElement) {
    enterFullscreen(container);
  } else {
    document.exitFullscreen();
  }
}

function enterFullscreen(container) {
  container.requestFullscreen().catch((err) => {
    console.log("Fullscreen error:", err);
  });
}

function toggleSound() {
  soundMuted = !soundMuted;
  localStorage.setItem("soundMuted", soundMuted);
  updateSoundIcons();
  if (world) {
    world.setSoundMuted(soundMuted);
  }
}

function updateSoundIcons() {
  const soundBtn = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");
  applySoundButtonStyle(soundBtn, soundIcon, soundMuted);
}

function getMuteIcon() {
  return '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
}

function getSoundIcon() {
  return '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
}

function startGameMobile() {
  if (world && !world.gameStarted) {
    world.startGame();
    toggleMobileUI();
  }
}

function toggleMobileUI() {
  document.getElementById("mobile-start-btn").classList.add("hidden");
  document.getElementById("mobile-controls").classList.add("visible");
}

document.addEventListener("keydown", (event) => {
  handleMovementKeys(event, true);
  handleActionKeys(event);
  handleSpecialKeys(event);
});

const KEY_MAPPING = {
  39: "RIGHT",
  37: "LEFT",
  38: "UP",
  40: "DOWN",
  32: "SPACE",
  68: "D",
  83: "S",
  13: "ENTER",
};

function handleMovementKeys(event, isPressed) {
  if (KEY_MAPPING[event.keyCode]) {
    keyboard[KEY_MAPPING[event.keyCode]] = isPressed;
  }
}

function handleActionKeys(event) {
  if (event.keyCode == 70) toggleFullscreen();
  if (event.keyCode == 77) toggleSound();
  if (event.keyCode == 13 && world && !world.gameStarted) {
    startGameFromKeyboard();
  }
}

function handleSpecialKeys(event) {
  if (event.keyCode == 27 || event.keyCode == 80) {
    togglePauseIfPossible(event);
  }
}

function togglePauseIfPossible(event) {
  if (world) world.togglePause();
  event.preventDefault();
}

function startGameFromKeyboard() {
  world.startGame();
  hideMobileStartButton();
}

document.addEventListener("keyup", (event) => {
  handleMovementKeys(event, false);
});

function initMobileControls() {
  preventDefaultTouchBehavior();
  attachMobileButtonHandlers();
}

function preventDefaultTouchBehavior() {
  document.querySelectorAll(".mobile-btn").forEach((btn) => {
    btn.addEventListener("touchstart", (e) => e.preventDefault());
  });
}

function attachMobileButtonHandlers() {
  attachButtonEvents("btn-left", "LEFT");
  attachButtonEvents("btn-right", "RIGHT");
  attachButtonEvents("btn-jump", "SPACE");
  attachButtonEvents("btn-throw", "S");
}

function attachButtonEvents(buttonId, keyName) {
  const btn = document.getElementById(buttonId);
  btn.addEventListener("touchstart", () => (keyboard[keyName] = true));
  btn.addEventListener("touchend", () => (keyboard[keyName] = false));
  btn.addEventListener("touchcancel", () => (keyboard[keyName] = false));
}

// Initialize mobile controls after DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileControls);
} else {
  initMobileControls();
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  canvas.addEventListener("click", handleCanvasClick);
});

function handleCanvasClick(e) {
  if (world && (world.gameWon || world.gameLost)) {
    checkRestartButtonClick(e);
  }
}

function checkRestartButtonClick(e) {
  const canvas = document.getElementById("canvas");
  const coords = getCanvasCoordinates(e, canvas);
  handleButtonClick(canvas, coords);
}

function getCanvasCoordinates(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function handleButtonClick(canvas, coords) {
  if (isInsideRestartButton(canvas, coords.x, coords.y)) {
    restartGame();
  } else if (isInsideMainMenuButton(canvas, coords.x, coords.y)) {
    returnToMainMenu();
  }
}

function restartGame() {
  initLevel();
  createNewWorld();
  hideMobileStartButton();
}

function createNewWorld() {
  world = new World(canvas, keyboard);
  world.setSoundMuted(soundMuted);
  world.startGame();
}

function hideMobileStartButton() {
  const mobileStartBtn = document.getElementById("mobile-start-btn");
  if (mobileStartBtn) {
    mobileStartBtn.classList.add("hidden");
  }
}

function isInsideRestartButton(canvas, x, y) {
  const btnX = canvas.width / 2 - 100;
  const btnY = canvas.height - 100;
  return x >= btnX && x <= btnX + 200 && y >= btnY && y <= btnY + 50;
}

function isInsideMainMenuButton(canvas, x, y) {
  const btnX = canvas.width / 2 - 100;
  const btnY = canvas.height - 170;
  return x >= btnX && x <= btnX + 200 && y >= btnY && y <= btnY + 50;
}

function returnToMainMenu() {
  location.reload();
}
