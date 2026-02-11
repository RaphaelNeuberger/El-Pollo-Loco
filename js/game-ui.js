/**
 * UI management module for game controls and overlays.
 */

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
  const impressum = document.querySelector(".impressum");
  if (impressum) {
    impressum.classList.add("hidden");
  }
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
    overlay.classList.toggle("show");
    toggleGameButtons(overlay.classList.contains("show"));
  }
}

/**
 * Closes the controls overlay.
 */
function closeControlsOverlay() {
  const overlay = document.getElementById("controls-overlay");
  if (overlay) {
    overlay.classList.remove("show");
    toggleGameButtons(false);
  }
}

/**
 * Shows or hides sound and fullscreen buttons based on overlay visibility.
 * @param {boolean} hidden - Whether the buttons should be hidden
 */
function toggleGameButtons(hidden) {
  const soundBtn = document.getElementById("sound-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (soundBtn) soundBtn.style.display = hidden ? "none" : "";
  if (fullscreenBtn) fullscreenBtn.style.display = hidden ? "none" : "";
}

/**
 * Shows the impressum modal.
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
  const container = document.getElementById("canvas-container");
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
 * Applies saved sound settings from localStorage.
 */
function applySavedSoundSettings() {
  if (world) {
    world.setSoundMuted(soundMuted);
    updateSoundButton(soundMuted);
  }
}

/**
 * Updates the sound button to show muted or unmuted state.
 * @param {boolean} muted - Whether sound is muted
 */
function updateSoundButton(muted) {
  const btn = document.getElementById("sound-btn");
  const icon = btn ? btn.querySelector("svg path") : null;
  if (btn && icon) {
    applySoundButtonStyle(btn, icon, muted);
  }
}

/**
 * Applies styling to sound button based on mute state.
 * @param {HTMLElement} btn - The button element
 * @param {SVGElement} icon - The icon SVG element
 * @param {boolean} muted - Whether sound is muted
 */
function applySoundButtonStyle(btn, icon, muted) {
  if (muted) {
    btn.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    icon.setAttribute("d", getMuteIcon());
  } else {
    btn.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    icon.setAttribute("d", getSoundIcon());
  }
}

/**
 * Toggles sound on/off and saves to localStorage.
 */
function toggleSound() {
  soundMuted = !soundMuted;
  localStorage.setItem("soundMuted", soundMuted);
  if (world) {
    world.setSoundMuted(soundMuted);
  }
  updateSoundIcons();
  document.getElementById("sound-btn").blur();
}

/**
 * Updates all sound icons in the UI.
 */
function updateSoundIcons() {
  updateSoundButton(soundMuted);
}

/**
 * Returns SVG path for mute icon.
 * @returns {string} SVG path data
 */
function getMuteIcon() {
  return "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z";
}

/**
 * Returns SVG path for sound icon.
 * @returns {string} SVG path data
 */
function getSoundIcon() {
  return "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";
}

/**
 * Starts the game on mobile by hiding start button and showing controls.
 */
function startGameMobile() {
  const mobileStartBtn = document.getElementById("mobile-start-btn");
  if (mobileStartBtn) {
    mobileStartBtn.style.display = "none";
  }
  toggleMobileUI();
  if (world && !world.gameStarted) {
    world.startGame();
  }
}

/**
 * Shows or hides mobile controls.
 */
function toggleMobileUI() {
  const controls = document.getElementById("mobile-controls");
  if (controls) {
    controls.classList.add("visible");
  }
}

/**
 * Restarts the game by reloading the page.
 */
function restartGame() {
  startNewGame();
}

/**
 * Starts a new game instance.
 */
function startNewGame() {
  world = null;
  initLevel();
  createNewWorld();
  applySavedSoundSettings();
  world.startGame();
}

/**
 * Returns to the main menu by reloading the page.
 */
function returnToMainMenu() {
  const startScreen = document.getElementById("start-screen");
  if (startScreen) {
    startScreen.classList.remove("hidden");
  }
  const impressum = document.querySelector(".impressum");
  if (impressum) {
    impressum.classList.remove("hidden");
  }
  const helpBtn = document.getElementById("help-btn");
  if (helpBtn) {
    helpBtn.classList.remove("visible");
  }
  const controls = document.getElementById("mobile-controls");
  if (controls) {
    controls.classList.remove("visible");
  }
  world = null;
  initLevel();
  createNewWorld();
  applySavedSoundSettings();
  world.playIntroSound();
}
