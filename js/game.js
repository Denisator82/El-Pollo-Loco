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

/**
 * Initializes the game by setting up the canvas and creating a new world instance.
 * Retrieves the canvas element from the DOM and initializes the world with the canvas and keyboard input.
 * Initializes the first level of the game.
 */
function init() {
    canvas = document.getElementById('canvas');
    initLevel(); // Initialisiert das erste Level 
    world = new World(canvas, keyboard);
}

/**
 * Function to start the game.
 * Hides the start screen and initializes the game.
 */
function startGame() {
    document.querySelector('.start-screen').style.display = 'none';
    init();
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
