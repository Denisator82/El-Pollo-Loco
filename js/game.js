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
    // Nach der Erstellung der World-Instanz, übergebe sie an die Level-Objekte
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
            // Füge hier weitere Gegner-Typen hinzu, falls du welche hast
        });
        world.character.world = world; // Stelle sicher, dass auch der Charakter die World-Instanz hat
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
        audioIcon.src = 'img/img/10_extras/volume-mute-fill.svg'; // Icon für stumm
        audioIcon.alt = 'Ton an';
    } else {
        audioIcon.src = 'img/img/10_extras/volume-up-fill.svg'; // Icon für Ton an
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


/**
 * Listens for keydown events and updates the keyboard state accordingly.
 * Sets the corresponding keyboard property to true when the key is pressed.
 * 
 * @param {KeyboardEvent} e - The keyboard event.
 */
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39 || e.keyCode == 68) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37 || e.keyCode == 65) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 38 || e.keyCode == 87) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40 || e.keyCode == 83) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (e.keyCode == 16) {
        keyboard.SHIFT = true;
    }
});

/**
 * Listens for keyup events and updates the keyboard state accordingly.
 * Resets the corresponding keyboard property to false when the key is released.
 * 
 * @param {KeyboardEvent} e - The keyboard event.
 */
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39 || e.keyCode == 68) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37 || e.keyCode == 65) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 38 || e.keyCode == 87) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40 || e.keyCode == 83) {
        keyboard.DOWN = false;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (e.keyCode == 16) {
        keyboard.SHIFT = false;
    }
});

// /**
//  * initialize mobile press events
//  * 
//  */
function initMobile() {
    mobileKeyPressEvents();
    mobileKeyReleaseEvents();
}

// /**
//  * Sets the key to true after pressing them (mobile)
//  */
function mobileKeyPressEvents() {
    const leftButton = document.getElementById('left_button');
    leftButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    const rightButton = document.getElementById('right_button');
    rightButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    const jump = document.getElementById('jump_button');
    jump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });
    const throwBottle = document.getElementById('throw_button');
    throwBottle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SHIFT = true;
    });
}

// /**
//  * Sets the key to false after releasing them (mobile)
//  */
function mobileKeyReleaseEvents() {
    const leftButton = document.getElementById('left_button');
    leftButton.addEventListener('touchend', () => {
        keyboard.LEFT = false;
    });
    const rightButton = document.getElementById('right_button');
    rightButton.addEventListener('touchend', () => {
        keyboard.RIGHT = false;
    });
    const jump = document.getElementById('jump_button');
    jump.addEventListener('touchend', (e) => {
        keyboard.SPACE = false;
    });
    const throwBottle = document.getElementById('throw_button');
    throwBottle.addEventListener('touchend', (e) => {
        keyboard.SHIFT = false;
    });
}