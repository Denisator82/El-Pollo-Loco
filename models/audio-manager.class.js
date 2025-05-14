/**
 * Manages all audio playback for the game, including sound effects and background music.
 * It handles loading sounds, playing them, managing background music states (standard, endboss),
 * and toggling mute for all audio.
 */
class AudioManager {
    /**
     * Initializes the AudioManager with default settings.
     */
    constructor() {
        /** @property {Object.<string, HTMLAudioElement>} sounds - A collection of loaded sound effects, keyed by name. */
        this.sounds = {};
        /** @property {boolean} isMuted - Indicates if all sounds are currently muted. */
        this.isMuted = false;
        /** @property {HTMLAudioElement|null} backgroundMusic - The audio element for the main background music. */
        this.backgroundMusic = null;
        /** @property {boolean} backgroundMusicPlaying - Tracks if the main background music is supposed to be playing. */
        this.backgroundMusicPlaying = false;
        /** @property {boolean} endbossFightStarted - Indicates if the endboss fight music is currently active. */
        this.endbossFightStarted = false; // State for the endboss fight
        /** @property {number} defaultVolume - The default volume level (0.0 to 1.0) for sounds. */
        this.defaultVolume = 0.5;
    }

    /**
     * Adds a new sound effect to the manager.
     * @param {string} name - The name to identify the sound.
     * @param {string} src - The path to the audio file.
     * @param {number} [volume=this.defaultVolume] - The volume for this sound (0.0 to 1.0). Defaults to `this.defaultVolume`.
     */
    addSound(name, src, volume = this.defaultVolume) {
        const sound = new Audio(src);
        sound.volume = volume;
        this.sounds[name] = sound;
    }

    /**
     * Sets the background music for the game.
     * @param {string} src - The path to the background music audio file.
     * @param {number} [volume=this.defaultVolume] - The volume for the background music (0.0 to 1.0). Defaults to `this.defaultVolume`.
     */
    setBackgroundMusic(src, volume = this.defaultVolume) {
        this.backgroundMusic = new Audio(src);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = volume;
    }

    /**
     * Plays a specific sound effect by its name.
     * The sound will restart from the beginning if already playing.
     * @param {string} name - The name of the sound to play.
     */
    playSound(name) {
    if (this.isMuted) return; // Stoppe hier direkt
    const sound = this.sounds[name];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.warn("Error playing sound " + name + ":", e));
    }
}


    playBackgroundMusic() {
        if (
            this.backgroundMusic &&
            !this.isMuted &&
            !this.endbossFightStarted &&
            this.backgroundMusic.paused
        ) {
            this.backgroundMusic.play().catch(e =>
                console.warn("Error playing background music:", e)
            );
            this.backgroundMusicPlaying = true;
        } else {
            console.log("🎵 Hintergrundmusik läuft bereits oder nicht erlaubt.");
        }
    }

    /**
     * Pauses the main background music.
     */
    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusicPlaying = false;
        }
    }

    /**
     * Plays the endboss music.
     * Assumes 'endbossMusic' has been added via `addSound`.
     * It also sets the state to indicate the endboss fight has started, which might affect other music playback.
     */
    playEndbossMusic() {
        if (!this.isMuted && this.sounds['endbossMusic']) {
            this.pauseBackgroundMusic(); // Ensure standard background music is stopped
            this.sounds['endbossMusic'].currentTime = 0;
            this.sounds['endbossMusic'].loop = true; // Endboss music should usually loop
            this.sounds['endbossMusic'].play().catch(e => console.warn("Error playing endboss music:", e)); // Added catch
            this.endbossFightStarted = true; // Set state that endboss fight has started
        }
    }

    /**
     * Pauses the endboss music.
     * Resets the endboss fight state.
     */
    pauseEndbossMusic() {
        if (this.sounds['endbossMusic']) {
            this.sounds['endbossMusic'].pause();
            this.endbossFightStarted = false; // Reset state when endboss music is paused (e.g., after defeating boss)
        }
    }

    /**
     * Plays the win sound effect.
     * Assumes 'win' sound has been added via `addSound`.
     */
    playWinSound() {
        if (!this.isMuted && this.sounds['win']) {
            // Optional: Stop other music
            // this.pauseBackgroundMusic();
            // this.pauseEndbossMusic();
            this.sounds['win'].currentTime = 0;
            this.sounds['win'].play().catch(e => console.warn("Error playing win sound:", e)); // Added catch
        }
    }

    /**
     * Plays the lose sound effect.
     * Assumes 'lose' sound has been added via `addSound`.
     */
    playLoseSound() {
        if (!this.isMuted && this.sounds['lose']) {
            // Optional: Stop other music
            // this.pauseBackgroundMusic();
            // this.pauseEndbossMusic();
            this.sounds['lose'].currentTime = 0;
            this.sounds['lose'].play().catch(e => console.warn("Error playing lose sound:", e)); // Added catch
        }
    }

    /**
     * Toggles the mute state for all sounds and music.
     * If unmuting, it attempts to resume the appropriate background or endboss music.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            for (let sound in this.sounds) {
                this.sounds[sound].pause();
            }
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
        } else {
            // When unmuting, decide which music to resume
            if (this.endbossFightStarted && this.sounds['endbossMusic']) {
                this.sounds['endbossMusic'].play().catch(e => console.warn("Error resuming endboss music:", e));
            } else if (this.backgroundMusicPlaying && this.backgroundMusic) { // Check if background music was supposed to be playing
                this.backgroundMusic.play().catch(e => console.warn("Error resuming background music:", e));
            }
        }
    }

    /**
     * Loads all registered sounds (including background music).
     * Executes a callback function once all sounds are ready to be played.
     * @param {function} [callback] - An optional function to call when all sounds have been loaded.
     */
    loadSounds(callback) {
        let soundsToLoad = Object.keys(this.sounds).length + (this.backgroundMusic ? 1 : 0);
        if (soundsToLoad === 0) { // No sounds to load
            if (callback) callback();
            return;
        }
        let soundsLoaded = 0;

        const checkLoadComplete = () => {
            soundsLoaded++;
            if (soundsLoaded === soundsToLoad && callback) {
                callback();
            }
        };

        const setupSoundLoadEvents = (audioElement) => {
            // 'canplaythrough' indicates the audio can be played to the end without buffering
            audioElement.addEventListener('canplaythrough', checkLoadComplete, { once: true });
            // Handle potential errors during loading
            audioElement.addEventListener('error', (e) => {
                console.error("Error loading audio: " + audioElement.src, e);
                checkLoadComplete(); // Still count it as "loaded" (or failed to load) to not block the callback indefinitely
            }, { once: true });
            audioElement.load(); // Start loading the audio file
        };

        for (const name in this.sounds) {
            setupSoundLoadEvents(this.sounds[name]);
        }

        if (this.backgroundMusic) {
            setupSoundLoadEvents(this.backgroundMusic);
        }
    }
}