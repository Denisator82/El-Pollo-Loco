/**
 * Declares the global variables used in the game.
 */
let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager(); // Initialisiere AudioManager global
let fullscreen = false;

/**
 * Initializes the page without starting the game automatically.
 */
function initPage() {
    updateAudioIcon();
}

/**
 * Sets up a new game world.
 */
function newGame() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard, audioManager); // Übergebe die AudioManager-Instanz
    world.loadSounds(); // <--- HIER die loadSounds()-Methode der World-Instanz aufrufen
    passWorldToLevel();
}

function passWorldToLevel() {
    if (level1 && world) {
        level1.enemies.forEach(enemy => {
            if (enemy instanceof Chicken) {
                enemy.world = world;
            } else if (enemy instanceof ChickenMini) {
                enemy.world = world;
            } else if (enemy instanceof Endboss) {
                enemy.world = world;
            }
        });
        world.character.world = world;
    }
}

/**
 * Starts the game by hiding the start screen and initializing the game.
 */
function startGame() {
    // console.log("startGame wurde aufgerufen!");
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("canvasContent").classList.remove("hidden");
    newGame();
    world.audioManager.playBackgroundMusic(); // Verwende world.audioManager
}

/**
 * Displays the game over screen.
 */
function gameLose() {
    document.getElementById("gameLose").classList.add("show");
    if (world && world.audioManager) {
        world.audioManager.playSound('lose');
    }
    stopGame(); // Rufe stopGame() auf, wenn das Spiel verloren ist
}

/**
 * Displays the win screen and handles game win logic.
 */
function gameWin() {
    console.log('LOG: gameWin() called.'); // Log
    document.getElementById("gameWin").classList.add("show");

    world.gameOver = true; // Setze das Game Over Flag

    stopGame(); // <-- Rufe die korrigierte stopGame() auf

    // Spiele den Win Sound NACHDEM die Musik gestoppt wurde
    if (world && world.audioManager) {
        world.audioManager.playSound('win');
    }

    // *** HIER MUSS DER BOSS AUS DER LISTE ENTFERNT WERDEN ***
    // Finde die Zeile, die den Boss mit splice aus world.level.enemies oder world.level.endboss entfernt.
    // Verschiebe DIESE ZEILE hierher, NACHDEM stopGame() aufgerufen wurde.
    // Wähle die korrekte Liste (enemies oder level.endboss) basierend auf wo der Boss gespeichert ist
    if (world && world.level) {
         // Beispiel für enemies Liste:
         const endbossIndex = world.level.enemies.findIndex(enemy => enemy instanceof Endboss);
         if (endbossIndex > -1) {
              console.log('LOG: Removing endboss from enemies list in gameWin().'); // Log
              world.level.enemies.splice(endbossIndex, 1); // <-- VERSCHIEBE DEINE SPLICE ZEILE HIERHER
         }
         // Beispiel für level.endboss Liste (falls Boss dort drin ist):
         /*
         const endbossIndex = world.level.endboss.findIndex(boss => boss instanceof Endboss);
         if (endbossIndex > -1) {
              console.log('LOG: Removing endboss from level.endboss list in gameWin().'); // Log
              world.level.endboss.splice(endbossIndex, 1); // <-- VERSCHIEBE DEINE SPLICE ZEILE HIERHER
         }
         */
    } else {
         console.warn('LOG: World or level not available for endboss removal in gameWin.'); // Warnung
    }

    // Optional: Timeout für Aufräumarbeiten nach Ende der Todes-Animation (falls nötig)
}

/**
 * Stops all game intervals and handles final cleanup.
 */
function stopGame() { // <-- Diese Funktion wird von gameLose()/gameWin() aufgerufen und ersetzt clearAllIntervals()
    console.log('LOG: --- Start stopGame (game.js) ---'); // Log am Anfang

    if (world) { // Prüfe, ob world existiert
        // Stoppe Charakter
        if (world.character && world.character.stopCharacterIntervals) {
            world.character.stopCharacterIntervals();
        }

        // Stoppe ALLE Gegner in der enemies Liste (falls Endboss NICHT dort ist)
        if (Array.isArray(world.enemies)) {
            world.enemies.forEach(enemy => {
                if (enemy && enemy.stopChickenIntervals) enemy.stopChickenIntervals();
                if (enemy && enemy.stopChickenMiniIntervals) enemy.stopChickenMiniIntervals();
                 // Wenn Endboss HIER in enemies IST, füge den instanceof Check hier ein:
                // if (enemy instanceof Endboss && enemy.stopEndbossIntervals) enemy.stopEndbossIntervals();
            });
        }

        // *** Stoppe Endboss(se) in der level.endboss Liste ***
        // <-- DIESE SCHLEIFE MUSS AKTIV SEIN, WENN DEIN BOSS IN level.endboss IST
        if (world.level && Array.isArray(world.level.endboss)) {
            world.level.endboss.forEach(endboss => {
                if (endboss && endboss.stopEndbossIntervals) { // Prüfe auf Endboss Instanz und Methode
                    endboss.stopEndbossIntervals(); // <-- Diese Zeile stoppt den Endboss!
                }
            });
        } else if (world.level && !Array.isArray(world.level.endboss)) {
             console.warn("LOG: world.level.endboss is not an array or does not exist."); // Warnung, falls Liste fehlt
        }


        // Optional: Stoppe andere Listen mit Intervallen (ThrowableObjects, Clouds etc.)
        // Wenn ThrowableObjects eigene Intervalle haben, stoppe sie hier
        if (world.throwableObjects && Array.isArray(world.throwableObjects)) {
             world.throwableObjects.forEach(throwable => {
                 if (throwable && throwable.stopThrowableObjectIntervals) throwable.stopThrowableObjectIntervals();
             });
             // Optional: Leere Liste hier ODER in gameWin/gameLose
             // world.throwableObjects = [];
        }


        // Stoppe Intervalle, die in der World-Klasse laufen (collisionIntervalId, throwIntervalId)
        if (world.stopWorldIntervals) { // Prüfe, ob die Methode existiert
             world.stopWorldIntervals(); // <-- Dein Log kommt
        } else {
             console.warn("LOG: world.stopWorldIntervals method not found."); // Warnung, falls Methode fehlt
        }

        // *** Musik stoppen ***
        if (world.audioManager) { // Prüfe, ob audioManager existiert
             world.audioManager.pauseEndbossMusic(); // <-- Stoppt Endboss-Musik
             world.audioManager.pauseBackgroundMusic(); // Hintergrundmusik stoppen
        } else {
             console.warn('LOG: audioManager not available in stopGame.'); // Warnung
        }

         // *** HIER NICHT DIE OBJEKTE AUS DER LISTE ENTFERNEN ***
         // Das passiert erst NACHDEM stopGame() durchgelaufen ist (in gameWin/gameLose)
    } else {
         console.warn('LOG: World object not available in stopGame.'); // Warnung, falls World fehlt
    }


    console.log('LOG: --- End stopGame (game.js) ---'); // Log am Ende
}

/**
 * Restarts the game and resets the UI.
 */
function restartGame() {
    document.getElementById("gameWin").classList.remove("show");
    document.getElementById("gameLose").classList.remove("show");
    document.getElementById("startScreen").classList.remove("hidden");
    newGame();
}

/**
 * Toggles the mute state of the game's audio.
 */
function toggleMute() {
    if (world && world.audioManager) {
        audioManager.toggleMute();
        updateAudioIcon(); // Aktualisiere das Audio-Icon
    }
}

/**
 * Updates the audio icon based on the mute state.
 */
function updateAudioIcon() {
    const audioIcon = document.getElementById('audio');
    if (audioManager.isMuted) {
        audioIcon.src = 'img/img/10_extras/volume-mute-fill.svg';
        audioIcon.alt = 'Ton an';
    } else {
        audioIcon.src = 'img/img/10_extras/volume-up-fill.svg';
        audioIcon.alt = 'Ton aus';
    }
}

/**
 * Toggles fullscreen mode.
 */
function toggleFullscreen() {
    const mainSection = document.getElementById('mainSection');
    if (!fullscreen) {
        if (mainSection.requestFullscreen) {
            mainSection.requestFullscreen();
        } else if (mainSection.webkitRequestFullscreen) { /* Safari */
            mainSection.webkitRequestFullscreen();
        } else if (mainSection.msRequestFullscreen) { /* IE11 */
            mainSection.msRequestFullscreen();
        }
        fullscreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        fullscreen = false;
    }
}

/**
 * Shows the help page.
 */
function showHelpPage() {
    // Implementiere hier die Logik, um deine Hilfeseite anzuzeigen
    alert('Hilfeseite wird angezeigt (Funktionalität noch nicht implementiert)');
}

const KEY_MAP = {
    39: 'RIGHT',
    68: 'RIGHT',
    37: 'LEFT',
    65: 'LEFT',
    38: 'UP',
    87: 'UP',
    40: 'DOWN',
    83: 'DOWN',
    32: 'SPACE',
    16: 'SHIFT'
};

/**
 * Listens for 'keydown' events on the window and updates the keyboard state.
 * When a key is pressed, the corresponding property in the 'keyboard' object
 * is set to 'true'.
 *
 * @param {KeyboardEvent} e - The event object containing information about the
 * keyboard event, such as the key that was pressed.
 */
window.addEventListener("keydown", (e) => {
    if (KEY_MAP[e.keyCode]) {
        keyboard[KEY_MAP[e.keyCode]] = true;
    }
});

/**
 * Listens for 'keyup' events on the window and updates the keyboard state.
 * When a key is released, the corresponding property in the 'keyboard' object
 * is set to 'false'.
 *
 * @param {KeyboardEvent} e - The event object containing information about the
 * keyboard event, such as the key that was released.
 */
window.addEventListener("keyup", (e) => {
    if (KEY_MAP[e.keyCode]) {
        keyboard[KEY_MAP[e.keyCode]] = false;
    }
});

/**
 * initialize mobile press events
 *
 */
function initMobile() {
    setupMobileButtonEvents();
}

function setupMobileButtonEvents() {
    const buttons = [
        { id: 'left_button', key: 'LEFT', type: 'touchstart', value: true },
        { id: 'left_button', key: 'LEFT', type: 'touchend', value: false },
        { id: 'right_button', key: 'RIGHT', type: 'touchstart', value: true },
        { id: 'right_button', key: 'RIGHT', type: 'touchend', value: false },
        { id: 'jump_button', key: 'SPACE', type: 'touchstart', value: true },
        { id: 'jump_button', key: 'SPACE', type: 'touchend', value: false },
        { id: 'throw_button', key: 'SHIFT', type: 'touchstart', value: true },
        { id: 'throw_button', key: 'SHIFT', type: 'touchend', value: false }
    ];

    /**
     * Iterates through the button configurations and attaches event listeners
     * to the corresponding DOM elements to handle mobile touch input.
     */
    buttons.forEach(buttonConfig => {
        const button = document.getElementById(buttonConfig.id);
        if (button) {
            /**
             * Adds an event listener to the button for the specified event type
             * ('touchstart' for pressing, 'touchend' for releasing).
             *
             * @param {TouchEvent} e - The event object containing information about
             * the touch event. 'preventDefault()' is called
             * to prevent default touch behaviors.
             */
            button.addEventListener(buttonConfig.type, (e) => {
                e.preventDefault();
                /**
                 * Updates the 'keyboard' object's property (e.g., 'LEFT', 'RIGHT')
                 * with the specified boolean 'value' (true for press, false for release).
                 */
                keyboard[buttonConfig.key] = buttonConfig.value;
            });
        }
    });
}

/**
 * Initializes the mobile touch event listeners by calling the
 * 'setupMobileButtonEvents' function.
 */
function initMobile() {
    setupMobileButtonEvents();
}