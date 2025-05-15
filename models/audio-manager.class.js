/**
 * Manages all audio playback for the game, including sound effects and background music.
 */
class AudioManager {
  constructor() {
    /**
     * Stores all sound effects by name.
     * @type {Object<string, HTMLAudioElement>}
     */
    this.sounds = {};

    /** Indicates whether all sounds are muted. */
    this.isMuted = false;

    /** Background music audio element. */
    this.backgroundMusic = null;

    /** Indicates whether background music is currently playing. */
    this.backgroundMusicPlaying = false;

    /** Indicates whether the endboss fight music is currently playing. */
    this.endbossFightStarted = false;

    /** Default volume level for all sounds. */
    this.defaultVolume = 0.5;
  }

  /**
   * Adds a sound effect to the manager.
   * @param {string} name - Name to reference the sound.
   * @param {string} src - Path to the audio file.
   * @param {number} [volume=this.defaultVolume] - Volume level.
   */
  addSound(name, src, volume = this.defaultVolume) {
    const sound = new Audio(src);
    sound.volume = volume;
    this.sounds[name] = sound;
  }

  /**
   * Sets the background music.
   * @param {string} src - Path to the background music file.
   * @param {number} [volume=this.defaultVolume] - Volume level.
   */
  setBackgroundMusic(src, volume = this.defaultVolume) {
    this.backgroundMusic = new Audio(src);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = volume;
  }

  /**
   * Plays a sound effect by name.
   * @param {string} name - Name of the sound to play.
   */
  playSound(name) {
    if (this.isMuted) return;
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((e) => console.warn(`Error playing sound ${name}:`, e));
    }
  }

  /**
   * Plays the background music if conditions allow.
   */
  playBackgroundMusic() {
    if (
      this.backgroundMusic &&
      !this.isMuted &&
      !this.endbossFightStarted &&
      this.backgroundMusic.paused
    ) {
      this.backgroundMusic
        .play()
        .catch((e) => console.warn("Error playing background music:", e));
      this.backgroundMusicPlaying = true;
    }
  }

  /**
   * Pauses the background music.
   */
  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusicPlaying = false;
    }
  }

  /**
   * Plays the endboss fight music and pauses background music.
   */
  playEndbossMusic() {
    const bossMusic = this.sounds["endbossMusic"];
    if (!this.isMuted && bossMusic) {
      this.pauseBackgroundMusic();
      bossMusic.currentTime = 0;
      bossMusic.loop = true;
      bossMusic
        .play()
        .catch((e) => console.warn("Error playing endboss music:", e));
      this.endbossFightStarted = true;
    }
  }

  /**
   * Pauses the endboss fight music.
   */
  pauseEndbossMusic() {
    const bossMusic = this.sounds["endbossMusic"];
    if (bossMusic) {
      bossMusic.pause();
      this.endbossFightStarted = false;
    }
  }

  /**
   * Plays the victory sound effect.
   */
  playWinSound() {
    const winSound = this.sounds["win"];
    if (!this.isMuted && winSound) {
      winSound.currentTime = 0;
      winSound.play().catch((e) => console.warn("Error playing win sound:", e));
    }
  }

  /**
   * Plays the lose sound effect.
   */
  playLoseSound() {
    const loseSound = this.sounds["lose"];
    if (!this.isMuted && loseSound) {
      loseSound.currentTime = 0;
      loseSound
        .play()
        .catch((e) => console.warn("Error playing lose sound:", e));
    }
  }

  /**
   * Toggles mute state and pauses/resumes sounds accordingly.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      Object.values(this.sounds).forEach((sound) => sound.pause());
      this.backgroundMusic?.pause();
    } else {
      if (this.endbossFightStarted) {
        this.sounds["endbossMusic"]
          ?.play()
          .catch((e) => console.warn("Error resuming endboss music:", e));
      } else if (this.backgroundMusicPlaying && this.backgroundMusic?.paused) {
        this.backgroundMusic
          .play()
          .catch((e) => console.warn("Error resuming background music:", e));
      }
    }
  }

  /**
   * Stops all sounds and resets their playback time.
   */
  stopAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
    this.backgroundMusicPlaying = false;
    this.endbossFightStarted = false;
  }

  /**
   * Preloads all sounds and calls the callback when all are ready.
   * @param {Function} [callback] - Function to call after loading completes.
   */
  loadSounds(callback) {
    let soundsToLoad =
      Object.keys(this.sounds).length + (this.backgroundMusic ? 1 : 0);
    if (soundsToLoad === 0) {
      callback?.();
      return;
    }

    let loaded = 0;
    const checkLoaded = () => {
      if (++loaded === soundsToLoad) callback?.();
    };

    const register = (audio) => {
      audio.addEventListener("canplaythrough", checkLoaded, { once: true });
      audio.addEventListener(
        "error",
        (e) => {
          console.error("Error loading audio:", audio.src, e);
          checkLoaded();
        },
        { once: true }
      );
      audio.load();
    };

    Object.values(this.sounds).forEach(register);
    if (this.backgroundMusic) register(this.backgroundMusic);
  }
}
