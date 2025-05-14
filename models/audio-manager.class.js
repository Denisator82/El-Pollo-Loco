/**
 * Manages all audio playback for the game, including sound effects and background music.
 */
class AudioManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.backgroundMusic = null;
    this.backgroundMusicPlaying = false;
    this.endbossFightStarted = false;
    this.defaultVolume = 0.5;
  }

  addSound(name, src, volume = this.defaultVolume) {
    const sound = new Audio(src);
    sound.volume = volume;
    this.sounds[name] = sound;
  }

  setBackgroundMusic(src, volume = this.defaultVolume) {
    this.backgroundMusic = new Audio(src);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = volume;
  }

  playSound(name) {
    if (this.isMuted) return;
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn(`Error playing sound ${name}:`, e));
    }
  }

  playBackgroundMusic() {
    if (
      this.backgroundMusic &&
      !this.isMuted &&
      !this.endbossFightStarted &&
      this.backgroundMusic.paused
    ) {
      this.backgroundMusic.play().catch(e => console.warn("Error playing background music:", e));
      this.backgroundMusicPlaying = true;
    }
  }

  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusicPlaying = false;
    }
  }

  playEndbossMusic() {
    const bossMusic = this.sounds['endbossMusic'];
    if (!this.isMuted && bossMusic) {
      this.pauseBackgroundMusic();
      bossMusic.currentTime = 0;
      bossMusic.loop = true;
      bossMusic.play().catch(e => console.warn("Error playing endboss music:", e));
      this.endbossFightStarted = true;
    }
  }

  pauseEndbossMusic() {
    const bossMusic = this.sounds['endbossMusic'];
    if (bossMusic) {
      bossMusic.pause();
      this.endbossFightStarted = false;
    }
  }

  playWinSound() {
    const winSound = this.sounds['win'];
    if (!this.isMuted && winSound) {
      winSound.currentTime = 0;
      winSound.play().catch(e => console.warn("Error playing win sound:", e));
    }
  }

  playLoseSound() {
    const loseSound = this.sounds['lose'];
    if (!this.isMuted && loseSound) {
      loseSound.currentTime = 0;
      loseSound.play().catch(e => console.warn("Error playing lose sound:", e));
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      Object.values(this.sounds).forEach(sound => sound.pause());
      this.backgroundMusic?.pause();
    } else {
      if (this.endbossFightStarted) {
        this.sounds['endbossMusic']?.play().catch(e => console.warn("Error resuming endboss music:", e));
      } else if (this.backgroundMusicPlaying && this.backgroundMusic?.paused) {
        this.backgroundMusic.play().catch(e => console.warn("Error resuming background music:", e));
      }
    }
  }

  stopAllSounds() {
    Object.values(this.sounds).forEach(sound => {
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

  loadSounds(callback) {
    let soundsToLoad = Object.keys(this.sounds).length + (this.backgroundMusic ? 1 : 0);
    if (soundsToLoad === 0) {
      callback?.();
      return;
    }

    let loaded = 0;
    const checkLoaded = () => {
      if (++loaded === soundsToLoad) callback?.();
    };

    const register = audio => {
      audio.addEventListener('canplaythrough', checkLoaded, { once: true });
      audio.addEventListener('error', e => {
        console.error("Error loading audio:", audio.src, e);
        checkLoaded();
      }, { once: true });
      audio.load();
    };

    Object.values(this.sounds).forEach(register);
    if (this.backgroundMusic) register(this.backgroundMusic);
  }
}
