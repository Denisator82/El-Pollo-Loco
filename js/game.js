/**
 * Declares the global variables used in the game.
 */
let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let fullscreen = false;

/**
 * Initializes the page without starting the game automatically.
 */
function initPage() {
    console.log("Seite geladen, aber Spiel startet erst nach Klick auf 'START'");
}

/**
 * Sets up a new game world.
 */
function newGame() {
    canvas = document.getElementById('canvas');
    initLevel(); 
    world = new World(canvas, keyboard);
}

/**
 * Starts the game by hiding the start screen and initializing the game.
 */
function startGame() {
    console.log("startGame wurde aufgerufen!");
    
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("canvasContent").classList.remove("hidden"); // Canvas-Container anzeigen
    
    newGame();
}


/**
 * Displays the game over screen.
 */
function gameLose() {
    document.getElementById("gameLose").classList.add("show");
    world.lose_sound.play();
}

/**
 * Displays the win screen.
 */
function gameWin() {
    document.getElementById("gameWin").classList.add("show");
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
