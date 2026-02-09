/**
 * Input handling module for keyboard and mobile controls.
 */

/**
 * Sets up keyboard event listeners.
 * @param {string|string[]} keys - Movement keys or action keys
 * @param {boolean} isPressed - Whether key is pressed or released
 */
function handleMovementKeys(event, isPressed) {
  if (event.key === "ArrowRight" || event.key === "d")
    keyboard.RIGHT = isPressed;
  if (event.key === "ArrowLeft" || event.key === "a") keyboard.LEFT = isPressed;
  if (event.key === " ") keyboard.SPACE = isPressed;
  if (
    event.key === "d" ||
    event.key === "D" ||
    event.key === "s" ||
    event.key === "S"
  )
    keyboard.D = isPressed;
}

/**
 * Handles action keys like fullscreen, sound toggle, and game start.
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleActionKeys(event) {
  if (event.key === "f" || event.key === "F") {
    toggleFullscreen();
  }
}

/**
 * Handles special keys like pause and start.
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleSpecialKeys(event) {
  togglePauseIfPossible(event);
  startGameFromKeyboard();
}

/**
 * Toggles pause if game has started and is not over.
 * @param {KeyboardEvent} event - The keyboard event
 */
function togglePauseIfPossible(event) {
  if (
    event.key === "Escape" &&
    world &&
    world.gameStarted &&
    !world.gameIsOver
  ) {
    world.togglePause();
  }
}

/**
 * Starts game from keyboard (Enter key).
 */
function startGameFromKeyboard() {
  if (event.key === "Enter") {
    const startScreen = document.getElementById("start-screen");
    if (startScreen && !startScreen.classList.contains("hidden")) {
      hideStartScreen();
      startGameDesktop();
    }
  }
}

/**
 * Initializes mobile touch controls.
 */
function initMobileControls() {
  preventDefaultTouchBehavior();
  attachMobileButtonHandlers();
}

/**
 * Prevents default touch behavior on buttons.
 */
function preventDefaultTouchBehavior() {
  document.querySelectorAll(".mobile-btn").forEach((btn) => {
    btn.addEventListener("touchstart", (e) => e.preventDefault());
  });
}

/**
 * Attaches touch handlers to mobile control buttons.
 */
function attachMobileButtonHandlers() {
  attachButtonEvents("btn-left", "LEFT");
  attachButtonEvents("btn-right", "RIGHT");
  attachButtonEvents("btn-jump", "SPACE");
  attachButtonEvents("btn-throw", "D");
}

/**
 * Attaches touch events to a specific button.
 * @param {string} buttonId - The button's ID
 * @param {string} keyName - The keyboard key name to simulate
 */
function attachButtonEvents(buttonId, keyName) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  addTouchEvent(button, "touchstart", keyName, true);
  addTouchEvent(button, "touchend", keyName, false);
  addTouchEvent(button, "touchcancel", keyName, false);
}

/**
 * Adds a touch event listener to a button.
 * @param {HTMLElement} btn - The button element
 * @param {string} event - The event type
 * @param {string} keyName - The key to simulate
 * @param {boolean} value - The key state value
 */
function addTouchEvent(btn, event, keyName, value) {
  btn.addEventListener(event, (e) => {
    e.preventDefault();
    keyboard[keyName] = value;
  });
}

/**
 * Handles canvas click events for button interactions.
 * @param {MouseEvent} e - The mouse event
 */
function handleCanvasClick(e) {
  if (!isGameOver()) return;
  checkRestartButtonClick(e);
}

/**
 * Checks if game is over.
 * @returns {boolean} True if game is over
 */
function isGameOver() {
  return world && (world.gameWon || world.gameLost);
}

/**
 * Handles touch start events on canvas.
 * @param {TouchEvent} e - The touch event
 */
function handleCanvasTouchStart(e) {
  if (!isGameOver()) return;
  e.preventDefault();
  processTouchEvent(e);
}

/**
 * Processes touch event and creates mock mouse event.
 * @param {TouchEvent} e - The touch event
 */
function processTouchEvent(e) {
  const touch = e.touches[0];
  const mockEvent = createMockEvent(touch);
  checkRestartButtonClick(mockEvent);
}

/**
 * Creates a mock mouse event from touch.
 * @param {Touch} touch - The touch object
 * @returns {Object} Mock event object
 */
function createMockEvent(touch) {
  return {
    clientX: touch.clientX,
    clientY: touch.clientY,
    preventDefault: () => {},
  };
}

/**
 * Checks if restart button was clicked.
 * @param {MouseEvent|Object} e - The event object
 */
function checkRestartButtonClick(e) {
  const canvas = document.getElementById("canvas");
  const coords = getCanvasCoordinates(e, canvas);
  processButtonClick(canvas, coords);
}

/**
 * Gets canvas-relative coordinates from event.
 * @param {MouseEvent|Object} e - The event object
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @returns {Object} Object with x and y coordinates
 */
function getCanvasCoordinates(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
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
 * Checks if restart button was clicked and restarts game.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} coords - Object with x and y coordinates
 */
function checkRestartClick(canvas, coords) {
  if (isInsideRestartButton(canvas, coords.x, coords.y)) {
    restartGame();
  }
}

/**
 * Checks if main menu button was clicked and returns to menu.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} coords - Object with x and y coordinates
 */
function checkMainMenuClick(canvas, coords) {
  if (isInsideMainMenuButton(canvas, coords.x, coords.y)) {
    returnToMainMenu();
  }
}

/**
 * Checks if coordinates are inside the restart button area.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} True if inside restart button area
 */
function isInsideRestartButton(canvas, x, y) {
  const btnX = 150;
  const btnY = 320;
  const btnWidth = 150;
  const btnHeight = 60;
  return (
    x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight
  );
}

/**
 * Checks if coordinates are inside the main menu button area.
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} True if inside main menu button area
 */
function isInsideMainMenuButton(canvas, x, y) {
  const btnX = 420;
  const btnY = 320;
  const btnWidth = 150;
  const btnHeight = 60;
  return (
    x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight
  );
}
