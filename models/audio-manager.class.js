class AudioManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.backgroundMusic = null;
        this.backgroundMusicPlaying = false;
        this.endbossFightStarted = false; // Neuer Zustand für den Endboss-Kampf
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
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic && !this.isMuted && !this.endbossFightStarted) { // Nur spielen, wenn der Endbosskampf nicht läuft
            this.backgroundMusic.play();
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
        if (!this.isMuted && this.sounds['endbossMusic']) {
            this.sounds['endbossMusic'].currentTime = 0;
            this.sounds['endbossMusic'].play();
            this.endbossFightStarted = true; // Setze den Zustand, dass der Endbosskampf begonnen hat
        }
    }

    pauseEndbossMusic() {
        if (this.sounds['endbossMusic']) {
            this.sounds['endbossMusic'].pause();
            this.endbossFightStarted = false; // Setze den Zustand zurück, wenn die Endboss-Musik pausiert wird (z.B. nach dem Besiegen)
        }
    }

    playWinSound() {
        if (!this.isMuted && this.sounds['win']) {
            this.sounds['win'].currentTime = 0;
            this.sounds['win'].play();
        }
    }

    playLoseSound() {
        if (!this.isMuted && this.sounds['lose']) {
            this.sounds['lose'].currentTime = 0;
            this.sounds['lose'].play();
        }
    }

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
            if (this.backgroundMusic && this.backgroundMusicPlaying && !this.endbossFightStarted) { // Prüfe beide Zustände
                this.backgroundMusic.play();
            } else if (this.endbossFightStarted && this.sounds['endbossMusic']) {
                this.sounds['endbossMusic'].play(); // Wenn Endbosskampf läuft, spiele dessen Musik wieder ab
            }
        }
    }
}

window.toggleSound = () => audioManager.toggleMute();
