/**
 * Audio management module for the World class.
 * Handles all sound effects, music, and volume control.
 * @class
 */
class WorldAudio {
  /**
   * Sets up audio properties for world instance.
   * @param {World} world - The world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Configures audio settings like loop and volume for game sounds.
   */
  setupAudioSettings() {
    this.world.introSound.loop = true;
    this.world.introSound.volume = 0.05;
    this.world.gameMusicLoop.loop = true;
    this.world.gameMusicLoop.volume = 0.07;
  }

  /**
   * Plays the intro sound if browser allows auto-play.
   */
  playIntroSound() {
    if (this.world.soundMuted) return;
    this.world.introSound.play().catch(() => {});
  }

  /**
   * Mutes or unmutes all game sounds.
   * @param {boolean} muted - Whether to mute the sounds.
   */
  setSoundMuted(muted) {
    this.setMainSoundVolumes(muted);
    this.setEffectSoundVolumes(muted);
  }

  /**
   * Sets the volume for main background music.
   * @param {boolean} muted - Whether to mute the sounds.
   */
  setMainSoundVolumes(muted) {
    this.world.introSound.volume = muted ? 0 : 0.05;
    this.world.gameMusicLoop.volume = muted ? 0 : 0.07;
  }

  /**
   * Sets the volume for sound effects.
   * @param {boolean} muted - Whether to mute the sounds.
   */
  setEffectSoundVolumes(muted) {
    const volume = muted ? 0 : 0.1;
    this.setCollectSoundVolumes(volume);
    this.setDeathAndCombatSoundVolumes(volume);
  }

  /**
   * Sets the volume for collection and game event sounds.
   * @param {number} volume - The volume level to set.
   */
  setCollectSoundVolumes(volume) {
    this.world.gameStartSound.volume = volume;
    this.world.bottleCollectSound.volume = volume;
    this.world.coinCollectSound.volume = volume;
    this.world.endbossWarningSound.volume = volume;
  }

  /**
   * Sets the volume for death and combat sounds.
   * @param {number} volume - The volume level to set.
   */
  setDeathAndCombatSoundVolumes(volume) {
    this.setWinLoseSoundVolumes(volume);
    this.setCombatSoundVolumes(volume);
  }

  /**
   * Sets the volume for win/lose sounds.
   * @param {number} volume - The volume level to set.
   */
  setWinLoseSoundVolumes(volume) {
    this.world.winnerSound.volume = volume;
    this.world.gameOverSound1.volume = volume;
    this.world.gameOverSound2.volume = volume;
  }

  /**
   * Sets the volume for combat sounds.
   * @param {number} volume - The volume level to set.
   */
  setCombatSoundVolumes(volume) {
    this.world.jumpKillSound.volume = volume;
    this.world.chickenKillSound.volume = volume;
    this.world.smallChickenHitSound.volume = volume;
    this.world.endbossHitSound.volume = volume;
  }

  /**
   * Stops the intro sound and resets its playback position.
   */
  stopIntroSound() {
    this.world.introSound.pause();
    this.world.introSound.currentTime = 0;
  }

  /**
   * Plays the game start sound and background music.
   */
  playStartSounds() {
    if (this.world.soundMuted) return;
    this.world.gameStartSound.play().catch(() => {});
    setTimeout(() => {
      if (!this.world.soundMuted) {
        this.world.gameMusicLoop.play().catch(() => {});
      }
    }, 500);
  }

  /**
   * Plays small chicken kill sound.
   */
  playSmallChickenKillSound() {
    if (this.world.soundMuted) return;
    this.world.jumpKillSound.currentTime = 0;
    this.world.jumpKillSound.play().catch(() => {});
  }

  /**
   * Plays normal chicken kill sound.
   */
  playNormalChickenKillSound() {
    if (this.world.soundMuted) return;
    this.world.chickenKillSound.currentTime = 0;
    this.world.chickenKillSound.play().catch(() => {});
  }

  /**
   * Plays sound when enemy hits character.
   * @param {MovableObject} enemy - The enemy
   */
  playEnemyHitSound(enemy) {
    if (this.world.soundMuted) return;
    if (enemy instanceof ChickenSmall) {
      this.world.smallChickenHitSound.currentTime = 0;
      this.world.smallChickenHitSound.play().catch(() => {});
    } else if (enemy instanceof Chicken) {
      this.world.smallChickenHitSound.currentTime = 0;
      this.world.smallChickenHitSound.play().catch(() => {});
    } else if (enemy instanceof Endboss) {
      this.world.smallChickenHitSound.currentTime = 0;
      this.world.smallChickenHitSound.play().catch(() => {});
    }
  }

  /**
   * Plays the coin collection sound effect.
   */
  playCoinSound() {
    if (this.world.soundMuted) return;
    this.world.coinCollectSound.currentTime = 0;
    this.world.coinCollectSound.play().catch(() => {});
  }

  /**
   * Plays the bottle collection sound effect.
   */
  playBottleSound() {
    if (this.world.soundMuted) return;
    this.world.bottleCollectSound.currentTime = 0;
    this.world.bottleCollectSound.play().catch(() => {});
  }

  /**
   * Plays endboss hit sound.
   */
  playEndbossHitSound() {
    if (this.world.soundMuted) return;
    this.world.endbossHitSound.currentTime = 0;
    this.world.endbossHitSound.play().catch(() => {});
  }

  /**
   * Plays the endboss warning sound once when first visible.
   */
  playEndbossWarningSound() {
    if (this.world.soundMuted) return;
    if (!this.world.endbossSoundPlayed) {
      this.world.endbossWarningSound.play().catch(() => {});
      this.world.endbossSoundPlayed = true;
    }
  }

  /**
   * Stops all game music and warning sounds.
   */
  stopGameMusic() {
    this.world.gameMusicLoop.pause();
    this.world.endbossWarningSound.pause();
  }

  /**
   * Plays the game over sound effects.
   */
  playGameOverSounds() {
    if (this.world.soundMuted) return;
    this.world.gameOverSound1.play().catch(() => {});
    this.world.gameOverSound2.play().catch(() => {});
  }

  /**
   * Handles pausing or resuming the game music.
   */
  handlePauseMusic() {
    if (this.world.isPaused) {
      this.world.gameMusicLoop.pause();
    } else {
      if (!this.world.soundMuted) {
        this.world.gameMusicLoop.play().catch(() => {});
      }
    }
  }
}
