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

window.toggleSound = () => audioManager.toggleMute();

// // 🎬 Beispielnutzung im Spiel
// const audioManager = new AudioManager();
// audioManager.addSound("jump", "audio/jump.mp3", 0.7); // 70% Lautstärke für den Sprung-Sound
// audioManager.addSound("chickenDead", "audio/chickenDead_sound.mp3", 0.5); // 50% Lautstärke für den Tod-Sound
// audioManager.addSound("lose", "audio/lose_sound02.mp3", 0.8); // 80% Lautstärke für den Verlust-Sound
// audioManager.addSound("walking", "audio/walking_sound.mp3", 0.6); // 60% Lautstärke für das Gehen

// audioManager.setBackgroundMusic("audio/game_music.mp3", 0.1); // 30% Lautstärke für die Hintergrundmusik
