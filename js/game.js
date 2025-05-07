/**
 * Declares the global variables used in the game.
 */
let canvas;
let world;
let keyboard = new Keyboard();
let fullscreen = false;

/**
 * Initializes the page without starting the game automatically.
 */
function initPage() {
    console.log("Seite geladen, aber Spiel startet erst nach Klick auf 'START'");
    updateAudioIcon();
}

/**
 * Sets up a new game world.
 */
function newGame() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
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
    console.log("startGame wurde aufgerufen!");
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("canvasContent").classList.remove("hidden");
    newGame();
}

/**
 * Displays the game over screen.
 */
function gameLose() {
    document.getElementById("gameLose").classList.add("show");
    if (world && world.audioManager) {
        world.audioManager.playSound('lose');
    }
}

/**
 * Displays the win screen.
 */
function gameWin() {
    document.getElementById("gameWin").classList.add("show");
    if (world && world.audioManager) {
        world.audioManager.playSound('win');
    }
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
        world.audioManager.toggleMute();
        updateAudioIcon(); // Aktualisiere das Audio-Icon
    }
}

/**
 * Updates the audio icon based on the mute state.
 */
function updateAudioIcon() {
    const audioIcon = document.getElementById('audio');
    if (world && world.audioManager && world.audioManager.isMuted) {
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