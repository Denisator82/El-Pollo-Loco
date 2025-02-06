class AudioManager {
    constructor(src, loop = false, volume = 1.0) {
        this.audio = new Audio(src);
        this.audio.loop = loop;
        this.audio.volume = volume;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    mute() {
        this.audio.muted = true;
    }

    unmute() {
        this.audio.muted = false;
    }
}

// Hintergrundmusik mit Loop
const backgroundMusic = new Sound('audio/background.mp3', true, 0.5);

// Angriffssound (einmal abspielen)
const attackSound = new Sound('audio/attack.mp3');

// Musik starten
backgroundMusic.play();

// Soundeffekt beim Angriff
attackSound.play();

// Musik pausieren
backgroundMusic.pause();

// Musik stoppen
backgroundMusic.stop();

// Lautstärke ändern
backgroundMusic.setVolume(0.3);


const walking_sound = new Audio('audio/walking_sound.mp3'); // Sound for walking
const jumping_sound = new Audio('audio/jumping_sound.mp3'); // Sound for jumping


// Sound-Klasse importieren
import { Sound } from './models/Sound.js';

// Sounds definieren
const alertSound = new Sound('audio/boss_alert.mp3');
const walkSound = new Sound('audio/boss_walk.mp3', true, 0.7); // Dauerschleife, leiser

// Beim ersten Kontakt mit dem Endboss
if (!this.hadFirstContact && world.character.x > 1425) {
    this.hadFirstContact = true;
    alertSound.play(); // Alarm-Sound abspielen
    setTimeout(() => {
        this.i = 15; // Nach dem Alarm in den nächsten Status wechseln
        walkSound.play(); // Lauf-Sound starten
    }, 2000); // 2 Sekunden warten
}

// // Anderes Beispiel:
// //🎼 models/AudioManager.js – Alles in einer Klasse
// class AudioManager {
//     constructor() {
//         this.sounds = {};
//         this.music = {};
//         this.globalVolume = 1.0; // Gesamtlautstärke für alles
//         this.muted = false;
//     }

//     /**
//      * Lädt einen Sound-Effekt.
//      * @param {string} name - Der Name des Sounds (z. B. 'jump', 'hit')
//      * @param {string} src - Der Pfad zur Audio-Datei
//      */
//     loadSound(name, src) {
//         this.sounds[name] = new Audio(src);
//     }

//     /**
//      * Lädt Hintergrundmusik.
//      * @param {string} name - Der Name der Musik (z. B. 'theme', 'boss')
//      * @param {string} src - Der Pfad zur Audio-Datei
//      * @param {boolean} loop - Ob die Musik in Dauerschleife spielt
//      */
//     loadMusic(name, src, loop = true) {
//         this.music[name] = new Audio(src);
//         this.music[name].loop = loop;
//     }

//     /**
//      * Spielt einen Sound-Effekt ab.
//      * @param {string} name - Name des Sounds
//      * @param {number} volume - Lautstärke (optional)
//      */
//     playSound(name, volume = 1.0) {
//         if (this.sounds[name] && !this.muted) {
//             let sound = this.sounds[name].cloneNode(); // Klont Sound für mehrfaches Abspielen
//             sound.volume = volume * this.globalVolume;
//             sound.play();
//         }
//     }

//     /**
//      * Startet Hintergrundmusik.
//      * @param {string} name - Name der Musik
//      * @param {number} volume - Lautstärke (optional)
//      */
//     playMusic(name, volume = 1.0) {
//         if (this.music[name] && !this.muted) {
//             this.stopAllMusic(); // Andere Musik stoppen, falls gewünscht
//             this.music[name].volume = volume * this.globalVolume;
//             this.music[name].play();
//         }
//     }

//     /**
//      * Stoppt alle laufende Musik.
//      */
//     stopAllMusic() {
//         Object.values(this.music).forEach(m => m.pause());
//     }

//     /**
//      * Setzt die Lautstärke für alles.
//      * @param {number} volume - Wert zwischen 0 und 1
//      */
//     setGlobalVolume(volume) {
//         this.globalVolume = volume;
//         Object.values(this.music).forEach(m => (m.volume = volume));
//     }

//     /**
//      * Mute/Unmute alle Sounds & Musik.
//      */
//     toggleMute() {
//         this.muted = !this.muted;
//         Object.values(this.music).forEach(m => (m.muted = this.muted));
//     }
// }

// 🚀 Einbindung in dein Spiel
// 🎬 AudioManager erstellen und Sounds/Musik laden
// const audioManager = new AudioManager();

// // Sound-Effekte laden
// audioManager.loadSound('jump', 'audio/jump.mp3');
// audioManager.loadSound('hit', 'audio/hit.mp3');

// // Musik laden
// audioManager.loadMusic('theme', 'audio/theme.mp3');
// audioManager.loadMusic('boss', 'audio/boss_fight.mp3');

//Neue Version
// 🎬 Nutzung der neuen Lautstärkeregelung
// Setze Lautstärke für Soundeffekte und Musik
// const audioManager = new AudioManager();

// // Setze Lautstärke für Soundeffekte auf 50%
// audioManager.setSoundVolume(0.5);

// // Setze Lautstärke für Musik auf 70%
// audioManager.setMusicVolume(0.7);

// Spiele Soundeffekte und Musik mit verschiedenen Lautstärken ab
// audioManager.playSound('jump', 0.8);  // Soundeffekt mit 80% Lautstärke
// audioManager.playMusic('theme', 1.0); // Musik mit 100% Lautstärke
