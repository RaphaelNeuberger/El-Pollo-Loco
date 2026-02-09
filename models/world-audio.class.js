/**
 * Audio management module for the World class.
 * Handles all sound effects, music, and volume control.
 * @class
 */
class WorldAudio {
  /**
   * Sets up audio module with all sound objects.
   * @param {World} world - The world instance
   */
  constructor(world) {
    this.world = world;
    this.introSound = new Audio("audio/game-intro-345507.mp3");
    this.gameStartSound = new Audio("audio/game-start-6104.mp3");
    this.bottleCollectSound = new Audio(
      "audio/fantasy-game-sword-cut-sound-effect-get-more-on-my-patreon-339824.mp3",
    );
    this.coinCollectSound = new Audio("audio/game-bonus-02-294436.mp3");
    this.gameMusicLoop = new Audio("audio/game-music-loop-6-144641.mp3");
    this.endbossWarningSound = new Audio("audio/wrong-place-129242.mp3");
    this.winnerSound = new Audio("audio/winner-game-sound-404167.mp3");
    this.gameOverSound1 = new Audio("audio/game-over-160612.mp3");
    this.gameOverSound2 = new Audio("audio/game-over-38511.mp3");
    this.jumpKillSound = new Audio("audio/retro-game-shot-152052.mp3");
    this.chickenKillSound = new Audio(
      "audio/muffled-sound-of-falling-game-character-131797.mp3",
    );
    this.smallChickenHitSound = new Audio(
      "audio/game-character-scream-131144.mp3",
    );
    this.endbossHitSound = new Audio(
      "audio/rpg-sword-attack-combo-34-388950.mp3",
    );
  }

  /**
   * Configures audio settings like loop and volume.
   */
  setupAudioSettings() {
    this.introSound.loop = true;
    this.introSound.volume = 0.3;
    this.gameMusicLoop.loop = true;
    this.gameMusicLoop.volume = 0.4;
  }

  /**
   * Plays the intro sound.
   */
  playIntroSound() {
    this.introSound.play().catch(() => {});
  }

  /**
   * Mutes or unmutes all game sounds.
   * @param {boolean} muted - Whether to mute.
   */
  setSoundMuted(muted) {
    this.setMainSoundVolumes(muted);
    this.setEffectSoundVolumes(muted);
  }

  /**
   * Sets volumes for background music.
   * @param {boolean} muted - Whether to mute.
   */
  setMainSoundVolumes(muted) {
    this.introSound.volume = muted ? 0 : 0.3;
    this.gameMusicLoop.volume = muted ? 0 : 0.4;
  }

  /**
   * Sets volumes for sound effects.
   * @param {boolean} muted - Whether to mute.
   */
  setEffectSoundVolumes(muted) {
    const volume = muted ? 0 : 1;
    this.setCollectSoundVolumes(volume);
    this.setDeathAndCombatSoundVolumes(volume);
  }

  /**
   * Sets volumes for collection sounds.
   * @param {number} volume - The volume level.
   */
  setCollectSoundVolumes(volume) {
    this.gameStartSound.volume = volume;
    this.bottleCollectSound.volume = volume;
    this.coinCollectSound.volume = volume;
    this.endbossWarningSound.volume = volume;
  }

  /**
   * Sets volumes for combat sounds.
   * @param {number} volume - The volume level.
   */
  setDeathAndCombatSoundVolumes(volume) {
    this.setWinLoseSoundVolumes(volume);
    this.setCombatSoundVolumes(volume);
  }

  /**
   * Sets volumes for win/lose sounds.
   * @param {number} volume - The volume level.
   */
  setWinLoseSoundVolumes(volume) {
    this.winnerSound.volume = volume;
    this.gameOverSound1.volume = volume;
    this.gameOverSound2.volume = volume;
  }

  /**
   * Sets volumes for combat sounds.
   * @param {number} volume - The volume level.
   */
  setCombatSoundVolumes(volume) {
    this.jumpKillSound.volume = volume;
    this.chickenKillSound.volume = volume;
    this.smallChickenHitSound.volume = volume;
    this.endbossHitSound.volume = volume;
  }

  /**
   * Stops intro sound and resets playback.
   */
  stopIntroSound() {
    this.introSound.pause();
    this.introSound.currentTime = 0;
  }

  /**
   * Plays game start sound and background music.
   */
  playStartSounds() {
    this.gameStartSound.play().catch(() => {});
    setTimeout(() => {
      this.gameMusicLoop.play().catch(() => {});
    }, 500);
  }

  /**
   * Plays small chicken kill sound.
   */
  playSmallChickenKillSound() {
    this.jumpKillSound.currentTime = 0;
    this.jumpKillSound.play().catch(() => {});
  }

  /**
   * Plays normal chicken kill sound.
   */
  playNormalChickenKillSound() {
    this.chickenKillSound.currentTime = 0;
    this.chickenKillSound.play().catch(() => {});
  }

  /**
   * Plays sound when enemy hits character.
   * @param {MovableObject} enemy - The enemy
   */
  playEnemyHitSound(enemy) {
    this.smallChickenHitSound.currentTime = 0;
    this.smallChickenHitSound.play().catch(() => {});
  }

  /**
   * Plays coin collection sound.
   */
  playCoinSound() {
    this.coinCollectSound.currentTime = 0;
    this.coinCollectSound.play().catch(() => {});
  }

  /**
   * Plays bottle collection sound.
   */
  playBottleSound() {
    this.bottleCollectSound.currentTime = 0;
    this.bottleCollectSound.play().catch(() => {});
  }

  /**
   * Plays endboss hit sound.
   */
  playEndbossHitSound() {
    this.endbossHitSound.currentTime = 0;
    this.endbossHitSound.play().catch(() => {});
  }

  /**
   * Plays endboss warning sound once.
   */
  playEndbossWarningSound() {
    if (!this.world.endbossSoundPlayed) {
      this.endbossWarningSound.volume = 0.2;
      this.endbossWarningSound.play().catch(() => {});
      this.world.endbossSoundPlayed = true;
    }
  }

  /**
   * Stops game music and warning sounds.
   */
  stopGameMusic() {
    this.gameMusicLoop.pause();
    this.endbossWarningSound.pause();
  }

  /**
   * Plays game over sound effects.
   */
  playGameOverSounds() {
    this.gameOverSound1.play().catch(() => {});
    this.gameOverSound2.play().catch(() => {});
  }

  /**
   * Handles pausing or resuming game music.
   */
  handlePauseMusic() {
    if (this.world.isPaused) {
      this.gameMusicLoop.pause();
    } else {
      if (!this.world.soundMuted) {
        this.gameMusicLoop.play().catch(() => {});
      }
    }
  }
}
