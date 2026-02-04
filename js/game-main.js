let canvas;
let world;
let keyboard = new Keyboard();

// Load sound setting from localStorage
let soundMuted = localStorage.getItem("soundMuted") === "true";

/**
 * Initializes the game by setting up the canvas, level, world, and applying sound settings.
 */
function init() {
  canvas = document.getElementById("canvas");
  initLevel();
  createNewWorld();
  applySavedSoundSettings();
  world.playIntroSound();
  setupStartScreen();
  setupControlsOverlay();
}

/**
 * Starts the game on desktop devices.
 */
function startGameDesktop() {
  if (!world || world.gameStarted) {
    return;
  }
  world.startGame();
  showHelpButton();
}

/**
 * Creates a new world instance and sets up event listeners.
 */
function createNewWorld() {
  world = new World(canvas, keyboard);
  setupEventListeners();
}

/**
 * Sets up all event listeners for game interaction.
 */
function setupEventListeners() {
  setupKeyboardListeners();
  setupCanvasListeners();
  initMobileControls();
}

/**
 * Sets up keyboard event listeners.
 */
function setupKeyboardListeners() {
  document.addEventListener("keydown", (event) => {
    handleMovementKeys(event, true);
    handleActionKeys(event);
    handleSpecialKeys(event);
  });
  document.addEventListener("keyup", (event) => {
    handleMovementKeys(event, false);
  });
}

/**
 * Sets up canvas click and touch listeners.
 */
function setupCanvasListeners() {
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("touchstart", handleCanvasTouchStart);
}
