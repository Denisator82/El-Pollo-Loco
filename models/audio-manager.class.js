class AudioManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.backgroundMusic = null;
        this.defaultVolume = 0.5; // Standardlautstärke (50%)
    }

    addSound(name, src, volume = this.defaultVolume) {
        const sound = new Audio(src);
        sound.volume = volume; // Setze die Lautstärke für den Sound
        this.sounds[name] = sound;
    }

    setBackgroundMusic(src, volume = this.defaultVolume) {
        this.backgroundMusic = new Audio(src);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = volume; // Setze die Lautstärke der Hintergrundmusik
    }

    playSound(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].play();
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic && !this.isMuted) {
            this.backgroundMusic.play();
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
            if (this.backgroundMusic) {
                this.backgroundMusic.play();
            }
        }
    }
}

// // 🎬 Beispielnutzung im Spiel
// const audioManager = new AudioManager();
// audioManager.addSound("jump", "audio/jump.mp3", 0.7); // 70% Lautstärke für den Sprung-Sound
// audioManager.addSound("chickenDead", "audio/chickenDead_sound.mp3", 0.5); // 50% Lautstärke für den Tod-Sound
// audioManager.addSound("lose", "audio/lose_sound02.mp3", 0.8); // 80% Lautstärke für den Verlust-Sound
// audioManager.addSound("walking", "audio/walking_sound.mp3", 0.6); // 60% Lautstärke für das Gehen

// audioManager.setBackgroundMusic("audio/game_music.mp3", 0.1); // 30% Lautstärke für die Hintergrundmusik

window.toggleSound = () => audioManager.toggleMute();
