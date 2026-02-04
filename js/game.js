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
 * Sets up the start screen and its event listeners.
 */
function setupStartScreen() {
  attachStartGameButton();
  attachShowControlsButton();
}

/**
 * Attaches click event to start game button.
 */
function attachStartGameButton() {
  const startGameBtn = document.getElementById("start-game-btn");
  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
      hideStartScreen();
      startGameDesktop();
    });
  }
}

/**
 * Attaches click event to show controls button.
 */
function attachShowControlsButton() {
  const showControlsBtn = document.getElementById("show-controls-btn");
  if (showControlsBtn) {
    showControlsBtn.addEventListener("click", toggleControlsOverlay);
  }
}

/**
 * Hides the start screen with a fade-out animation.
 */
function hideStartScreen() {
  const startScreen = document.getElementById("start-screen");
  if (startScreen) {
    startScreen.classList.add("hidden");
  }
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
 * Shows the help button during gameplay.
 */
function showHelpButton() {
  const helpBtn = document.getElementById("help-btn");
  if (helpBtn) {
    helpBtn.classList.add("visible");
  }
}

/**
 * Sets up the controls overlay and keyboard shortcuts.
 */
function setupControlsOverlay() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "h" || e.key === "H") {
      toggleControlsOverlay();
    }
    if (e.key === "Escape") {
      closeControlsOverlay();
    }
  });
}

/**
 * Toggles the controls overlay visibility.
 */
function toggleControlsOverlay() {
  const overlay = document.getElementById("controls-overlay");
  if (overlay) {
    overlay.classList.toggle("active");
  }
}

/**
 * Closes the controls overlay.
 */
function closeControlsOverlay() {
  const overlay = document.getElementById("controls-overlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
}

/**
 * Applies the saved sound settings from localStorage to the game.
 */
function applySavedSoundSettings() {
  if (soundMuted) {
    world.setSoundMuted(true);
    updateSoundButton(true);
  }
}

/**
 * Updates the sound button UI based on muted state.
 * @param {boolean} muted - Whether sound is muted
 */
function updateSoundButton(muted) {
  const soundBtn = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");
  applySoundButtonStyle(soundBtn, soundIcon, muted);
}

/**
 * Applies styling to the sound button based on muted state.
 * @param {HTMLElement} btn - The sound button element
 * @param {HTMLElement} icon - The sound icon element
 * @param {boolean} muted - Whether sound is muted
 */
function applySoundButtonStyle(btn, icon, muted) {
  if (muted) {
    btn.classList.add("muted");
    icon.innerHTML = getMuteIcon();
  } else {
    btn.classList.remove("muted");
    icon.innerHTML = getSoundIcon();
  }
}

/**
 * Displays the impressum modal.
 */
function showImpressum() {
  document.getElementById("impressum-modal").style.display = "block";
}

/**
 * Closes the impressum modal.
 */
function closeImpressum() {
  document.getElementById("impressum-modal").style.display = "none";
}

/**
 * Toggles fullscreen mode for the canvas container.
 */
function toggleFullscreen() {
  let container = document.getElementById("canvas-container");
  if (!document.fullscreenElement) {
    enterFullscreen(container);
  } else {
    document.exitFullscreen();
  }
}

/**
 * Enters fullscreen mode for the given container.
 * @param {HTMLElement} container - The container element to make fullscreen
 */
function enterFullscreen(container) {
  container.requestFullscreen().catch(() => {
    // Ignore fullscreen errors
  });
}

/**
 * Toggles sound on/off and saves the setting to localStorage.
 */
function toggleSound() {
  soundMuted = !soundMuted;
  localStorage.setItem("soundMuted", soundMuted);
  updateSoundIcons();
  if (world) {
    world.setSoundMuted(soundMuted);
  }
}

/**
 * Updates the sound icon based on current muted state.
 */
function updateSoundIcons() {
  const soundBtn = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");
  applySoundButtonStyle(soundBtn, soundIcon, soundMuted);
}

/**
 * Returns the SVG path for the mute icon.
 * @returns {string} SVG path string for muted icon
 */
function getMuteIcon() {
  return '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
}

/**
 * Returns the SVG path for the sound icon.
 * @returns {string} SVG path string for sound icon
 */
function getSoundIcon() {
  return '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
}

/**
 * Starts the game on mobile devices and shows mobile controls.
 */
function startGameMobile() {
  if (!world) {
    return;
  }
  if (world.gameStarted) {
    return;
  }
  world.startGame();
  toggleMobileUI();
}

/**
 * Toggles mobile UI elements, showing controls.
 */
function toggleMobileUI() {
  const controls = document.getElementById("mobile-controls");
  if (controls) {
    controls.classList.add("visible");
  }
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

/**
 * Handles movement key events and updates keyboard state.
 * @param {KeyboardEvent} event - The keyboard event
 * @param {boolean} isPressed - Whether the key is pressed or released
 */
function handleMovementKeys(event, isPressed) {
  const key = KEY_MAPPING[event.keyCode];
  if (key) {
    keyboard[key] = isPressed;
  }
}

/**
 * Handles action keys like fullscreen, sound toggle, and game start.
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleActionKeys(event) {
  if (event.keyCode == 70) {
    toggleFullscreen();
  }
  if (event.keyCode == 77) {
    toggleSound();
  }
}

/**
 * Handles special keys like ESC and P for pause functionality.
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleSpecialKeys(event) {
  if (event.keyCode == 27 || event.keyCode == 80) {
    togglePauseIfPossible(event);
  }
}

/**
 * Toggles game pause if the world exists.
 * @param {KeyboardEvent} event - The keyboard event
 */
function togglePauseIfPossible(event) {
  if (world) world.togglePause();
  event.preventDefault();
}

/**
 * Starts the game from keyboard input and hides the mobile start button.
 */
function startGameFromKeyboard() {
  world.startGame();
  toggleMobileUI();
}

document.addEventListener("keyup", (event) => {
  handleMovementKeys(event, false);
});

/**
 * Initializes mobile touch controls for the game.
 */
function initMobileControls() {
  preventDefaultTouchBehavior();
  attachMobileButtonHandlers();
}

/**
 * Prevents default touch behavior on mobile control buttons.
 */
function preventDefaultTouchBehavior() {
  document.querySelectorAll(".mobile-btn").forEach((btn) => {
    btn.addEventListener("touchstart", (e) => e.preventDefault());
  });
}

/**
 * Attaches event handlers to all mobile control buttons.
 */
function attachMobileButtonHandlers() {
  attachButtonEvents("btn-left", "LEFT");
  attachButtonEvents("btn-right", "RIGHT");
  attachButtonEvents("btn-jump", "SPACE");
  attachButtonEvents("btn-throw", "S");
}

/**
 * Attaches touch events to a specific button.
 * @param {string} buttonId - The ID of the button element
 * @param {string} keyName - The keyboard key name to simulate
 */
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
  canvas.addEventListener("touchstart", handleCanvasTouchStart);
});

/**
 * Handles click events on the canvas, checking for button clicks in end screen.
 * @param {MouseEvent} e - The mouse event
 */
function handleCanvasClick(e) {
  if (isGameOver()) {
    checkRestartButtonClick(e);
  }
}

/**
 * Checks if game is over (won or lost).
 * @returns {boolean} True if game is over
 */
function isGameOver() {
  return world && (world.gameWon || world.gameLost);
}

/**
 * Handles touch events on the canvas, checking for button clicks in end screen.
 * @param {TouchEvent} e - The touch event
 */
function handleCanvasTouchStart(e) {
  if (isGameOver()) {
    e.preventDefault();
    processTouchEvent(e);
  }
}

/**
 * Processes touch event and converts to mock click event.
 * @param {TouchEvent} e - The touch event
 */
function processTouchEvent(e) {
  if (e.touches.length > 0) {
    const mockEvent = createMockEvent(e.touches[0]);
    checkRestartButtonClick(mockEvent);
  }
}

/**
 * Creates a mock click event from touch.
 * @param {Touch} touch - The touch object
 * @returns {Object} Mock event with clientX and clientY
 */
function createMockEvent(touch) {
  return {
    clientX: touch.clientX,
    clientY: touch.clientY,
  };
}

/**
 * Checks if the click was on a restart or main menu button.
 * @param {MouseEvent} e - The mouse event
 */
function checkRestartButtonClick(e) {
  const canvas = document.getElementById("canvas");
  const coords = getCanvasCoordinates(e, canvas);
  processButtonClick(canvas, coords);
}

/**
 * Converts mouse event coordinates to canvas-relative coordinates.
 * @param {MouseEvent} e - The mouse event
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @returns {Object} Object with x and y coordinates
 */
function getCanvasCoordinates(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  return { x, y };
}

/**
 * Processes button clicks based on canvas coordinates.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} coords - Object with x and y coordinates
 */
function processButtonClick(canvas, coords) {
  checkRestartClick(canvas, coords);
  checkMainMenuClick(canvas, coords);
}

/**
 * Checks and handles restart button click.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} coords - Object with x and y coordinates
 */
function checkRestartClick(canvas, coords) {
  if (isInsideRestartButton(canvas, coords.x, coords.y)) {
    restartGame();
  }
}

/**
 * Checks and handles main menu button click.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} coords - Object with x and y coordinates
 */
function checkMainMenuClick(canvas, coords) {
  if (isInsideMainMenuButton(canvas, coords.x, coords.y)) {
    returnToMainMenu();
  }
}

/**
 * Restarts the game by reinitializing the level and creating a new world.
 */
function restartGame() {
  initLevel();
  createNewWorld();
  startNewGame();
}

/**
 * Starts new game and shows UI elements.
 */
function startNewGame() {
  world.startGame();
  toggleMobileUI();
  showHelpButton();
  hideStartScreen();
}

/**
 * Creates a new game world instance and starts the game.
 */
function createNewWorld() {
  world = new World(canvas, keyboard);
  world.setSoundMuted(soundMuted);
}

/**
 * Checks if coordinates are inside the restart button area.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} True if inside restart button area
 */
function isInsideRestartButton(canvas, x, y) {
  const btnX = canvas.width / 2 - 100;
  const btnY = canvas.height - 100;
  return x >= btnX && x <= btnX + 200 && y >= btnY && y <= btnY + 50;
}

/**
 * Checks if coordinates are inside the main menu button area.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} True if inside main menu button area
 */
function isInsideMainMenuButton(canvas, x, y) {
  const btnX = canvas.width / 2 - 100;
  const btnY = canvas.height - 170;
  return x >= btnX && x <= btnX + 200 && y >= btnY && y <= btnY + 50;
}

/**
 * Returns to the main menu by reloading the page.
 */
function returnToMainMenu() {
  const startScreen = document.getElementById("start-screen");
  if (startScreen) {
    startScreen.classList.remove("hidden");
  }
  const helpBtn = document.getElementById("help-btn");
  if (helpBtn) {
    helpBtn.classList.remove("visible");
  }
  location.reload();
}
