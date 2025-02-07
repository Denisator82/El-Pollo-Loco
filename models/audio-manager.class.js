class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.isMuted = false;
    }

    /**
     * Lädt und speichert einen Sound.
     * @param {string} name - Der Name des Sounds.
     * @param {string} src - Die Datei-URL des Sounds.
     */
    addSound(name, src) {
        this.sounds[name] = new Audio(src);
    }

    /**
     * Lädt und speichert die Hintergrundmusik.
     */
    setBackgroundMusic() {
        this.music = new Audio("audio/game_music.mp3");
        this.music.loop = true;
    }

    /**
     * Spielt einen Sound mit optionaler Lautstärke.
     * @param {string} name - Der Name des Sounds.
     * @param {number} volume - Lautstärke (Standard: 1.0).
     */
    playSound(name, volume = 1.0) {
        if (!this.isMuted && this.sounds[name]) {
            let sound = this.sounds[name].cloneNode();
            sound.volume = volume;
            sound.play();
        }
    }

    /**
     * Startet die Hintergrundmusik mit optionaler Lautstärke.
     * @param {number} volume - Lautstärke (Standard: 1.0).
     */
    playMusic(volume = 1.0) {
        if (this.music && !this.isMuted) {
            this.music.volume = volume;
            this.music.play();
        }
    }

    /**
     * Stoppt die Hintergrundmusik.
     */
    stopMusic() {
        if (this.music) {
            this.music.pause();
        }
    }

    /**
     * Schaltet den Sound an oder aus.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.music) this.music.muted = this.isMuted;
        this.updateSoundButton();
    }

    /**
     * Aktualisiert das Sound-Icon im UI.
     */
    updateSoundButton() {
        const soundButton = document.getElementById("soundToggle");
        soundButton.src = this.isMuted ? "./img/icons/mute.png" : "./img/icons/sound.png";
    }
}

// 🎬 Beispielnutzung im Spiel
const audioManager = new AudioManager();
audioManager.addSound("jump", "audio/jump.mp3");
audioManager.setBackgroundMusic("audio/game_music.mp3");

window.toggleSound = () => audioManager.toggleMute();
