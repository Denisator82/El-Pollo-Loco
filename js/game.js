/**
 * Declares the global variables used in the game.
 * 
 * @type {HTMLCanvasElement} canvas - The canvas element for rendering the game.
 * @type {World} world - The instance of the game world.
 * @type {Keyboard} keyboard - The instance of the keyboard input handler.
 */
let canvas;
let world;
let keyboard = new Keyboard();
let isLoading = false;
let isMuted = false;
let fullscreen = false;

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

/**
 * initialize mobile press events
 * 
 */
function initMobile() {
    mobileKeyPressEvents();
    mobileKeyReleaseEvents();
}


/**
 * Function to start the game.
 * Hides the start screen and initializes the game.
 */
function startGame() {//function init()
    document.getElementById("startScreen").classList.add("d-none");
    document.getElementById("loading").classList.remove("d-none");
    if (!isLoading) {
        newGame().then(() => {
            setTimeout(() => {
                isLoading = true;
                showGame();
            }, 3000);
        });
    }
}

/**
 * Sets a new World in the canvas
 */
function newGame() {
    canvas = document.getElementById("canvas");
    return initLevel().then(() => {
        world = new World(canvas, keyboard);
    });
}

/**
 * Removes the loading view and shows the game
 */
function showGame() {
    document.getElementById("loading").classList.add("d-none");
    document.getElementById("canvasContent").classList.remove("d-none");
    document.getElementById("leftMobile-container").classList.remove("d-none");
    document.getElementById("rightMobile-container").classList.remove("d-none");
}

/*
 *shows the lose screen
 */
function gameOverLose() {
    document.getElementById("gameOverLose").classList.remove("d-none");
}

/**
 * shows the win screen
 */
function gameOverWin() {
    document.getElementById("gameOverWin").classList.remove("d-none");
}

/**
 * Restarts the game
 */
function restartGame() {
    document.getElementById('gameOverWin').classList.add("d-none");
    document.getElementById('gameOverLose').classList.add("d-none");
    document.getElementById('loading').classList.remove("d-none");
    document.getElementById('leftMobile-container').classList.add("d-none");
    document.getElementById('rightMobile-container').classList.add("d-none");
    newGame();
    setTimeout(() => {
        document.getElementById('loading').classList.add("d-none");
        document.getElementById('leftMobile-container').classList.remove("d-none");
        document.getElementById('rightMobile-container').classList.remove("d-none");
    }, 1000);
}

/**
 * Sets the key to true after pressing them (mobile)
 */
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

/**
 * Sets the key to false after releasing them (mobile)
 */
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




