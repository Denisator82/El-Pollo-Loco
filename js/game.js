/**
 * Global canvas element used to render the game.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The main world instance controlling the game.
 * @type {World}
 */
let world;

/**
 * The keyboard input handler.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * The audio manager instance for handling sound.
 * @type {AudioManager}
 */
let audioManager = new AudioManager();

/** Indicates whether the game is in fullscreen mode. */
let fullscreen = false;

/** Tracks keys currently pressed to avoid repeated actions. */
let keyPressed = {};

/** Indicates whether the game has already started. */
let gameAlreadyStarted = false;

/** Indicates whether the game is currently paused. */
let gamePaused = false;

/**
 * Initializes the basic page state, such as audio mute state and UI icons.
 */
function initPage() {
  loadMuteState();
  updateAudioIcon();
}

/**
 * Loads the audio mute state from localStorage.
 */
function loadMuteState() {
  const storedMute = localStorage.getItem("isMuted") === "true";
  audioManager.isMuted = storedMute;
}

/**
 * Saves the current audio mute state to localStorage.
 */
function saveMuteState() {
  localStorage.setItem("isMuted", audioManager.isMuted.toString());
}

/**
 * Starts a new game instance, initializes canvas and world, and loads sounds.
 */
function newGame() {
  canvas = document.getElementById("canvas");
  initLevel();
  world = new World(canvas, keyboard, audioManager);
  world.loadSounds();
  passWorldToLevel();
  canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  if (world?.audioManager) {
    world.audioManager.pauseBackgroundMusic();
    setTimeout(() => {
      world.audioManager.playBackgroundMusic();
    }, 100);
  }
}

/**
 * Passes the current world instance to all enemies and the character.
 */
function passWorldToLevel() {
  if (level1 && world) {
    level1.enemies.forEach((enemy) => {
      if (
        enemy instanceof Chicken ||
        enemy instanceof ChickenMini ||
        enemy instanceof Endboss
      ) {
        enemy.world = world;
      }
    });
    world.character.world = world;
  }
}

/**
 * Starts the game if it hasn't already started and hides the start screen.
 */
function startGame() {
  if (gameAlreadyStarted) return;

  gameAlreadyStarted = true;
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("canvasContent").classList.remove("hidden");
  newGame();
  world.audioManager.playBackgroundMusic();
}

/**
 * Triggers the game over (lose) screen and stops all sounds.
 */
function gameLose() {
  if (!world) return;
  world.gameOver = true;
  stopGame();
  world.audioManager?.stopAllSounds?.();
  world.audioManager?.playSound?.("lose");
  document.getElementById("loseImageContainer")?.classList.add("show");
}

/**
 * Triggers the game over (win) screen and stops all sounds.
 */
function gameWin() {
  if (!world) return;
  world.gameOver = true;
  stopGame();
  world.audioManager?.stopAllSounds?.();
  world.audioManager?.playWinSound?.();
  document.getElementById("winImageContainer")?.classList.add("show");
}

/**
 * Stops all running game intervals.
 */
function stopGame() {
  if (!world) return;
  world.stopAllIntervals?.();
}

/**
 * Restarts the game by resetting states and reinitializing game objects.
 */
function restartGame() {
  if (world?.stopAllIntervals) world.stopAllIntervals();
  world = null;

  ["SPACE", "SHIFT", "RIGHT", "LEFT", "UP", "DOWN"].forEach((k) => {
    justPressed[k] = false;
    keyState[k] = false;
    keyboard[k] = false;
  });

  document.activeElement.blur();

  const canvas = document.getElementById("canvas");
  canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

  document.getElementById("startScreen")?.classList.add("hidden");
  document.getElementById("winImageContainer")?.classList.remove("show");
  document.getElementById("loseImageContainer")?.classList.remove("show");
  document.getElementById("canvasContent")?.classList.remove("hidden");

  newGame();
  gameAlreadyStarted = false;
}

/**
 * Pauses the game and background music.
 */
function pauseGame() {
  if (world && !world.gameOver) {
    world.stopAllIntervals?.();
    world.audioManager?.pauseBackgroundMusic?.();
    gamePaused = true;
  }
}

/**
 * Resumes the game and background music if previously paused.
 */
function resumeGame() {
  if (world && !world.gameOver && gamePaused) {
    world.resumeAllIntervals?.();
    world.audioManager?.playBackgroundMusic?.();
    gamePaused = false;
  }
}

/**
 * Toggles game mute state and updates localStorage + icon.
 */
function toggleMute() {
  const manager = world?.audioManager || audioManager;
  if (manager) {
    manager.toggleMute();
    localStorage.setItem("isMuted", manager.isMuted.toString());
    updateAudioIcon();
  }
}

/**
 * Updates the audio icon in the UI based on mute state.
 */
function updateAudioIcon() {
  const audioIcon = document.getElementById("audio");
  const manager = world?.audioManager || audioManager;
  if (!audioIcon || !manager) return;

  if (manager.isMuted) {
    audioIcon.src = "img/img/10_extras/volume-mute-fill.svg";
    audioIcon.alt = "Ton an";
  } else {
    audioIcon.src = "img/img/10_extras/volume-up-fill.svg";
    audioIcon.alt = "Ton aus";
  }
}

/**
 * Maps keyboard key codes to internal action names.
 * @type {Object<number, string>}
 */
const KEY_MAP = {
  39: "RIGHT",
  68: "RIGHT",
  37: "LEFT",
  65: "LEFT",
  38: "UP",
  87: "UP",
  40: "DOWN",
  83: "DOWN",
  32: "SPACE",
  16: "SHIFT",
};

/**
 * Tracks current pressed state of keys.
 * @type {Object<string, boolean>}
 */
const keyState = {
  SPACE: false,
  SHIFT: false,
  RIGHT: false,
  LEFT: false,
  UP: false,
  DOWN: false,
};

/**
 * Tracks key presses for one-time actions.
 * @type {Object<string, boolean>}
 */
const justPressed = {
  SPACE: false,
  SHIFT: false,
};

window.addEventListener("keydown", (e) => {
  const key = KEY_MAP[e.keyCode];
  if (!key) return;
  if (!keyState[key]) {
    keyState[key] = true;
    keyboard[key] = true;
    if ((key === "SPACE" || key === "SHIFT") && world && !world.gameOver) {
      justPressed[key] = true;
    }
  }
});

window.addEventListener("keyup", (e) => {
  const key = KEY_MAP[e.keyCode];
  if (!key) return;
  keyState[key] = false;
  keyboard[key] = false;
  if (key === "SPACE" || key === "SHIFT") {
    justPressed[key] = false;
  }
});

/**
 * Initializes mobile controls and sets up event listeners.
 */
function initMobile() {
  setupMobileButtonEvents();
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile) {
    handleOrientationChange();
  } else {
    document.getElementById("leftMobile-container")?.classList.add("hidden");
    document.getElementById("rightMobile-container")?.classList.add("hidden");
    document.getElementById("rotateDevice")?.classList.add("hidden");
  }
}

window.addEventListener("resize", handleOrientationChange);
window.addEventListener("orientationchange", handleOrientationChange);

/**
 * Sets up touch events for mobile control buttons.
 */
function setupMobileButtonEvents() {
  const buttons = [
    { id: "left_button", key: "LEFT" },
    { id: "right_button", key: "RIGHT" },
    { id: "jump_button", key: "SPACE" },
    { id: "throw_button", key: "SHIFT" },
  ];

  buttons.forEach(({ id, key }) => {
    const button = document.getElementById(id);
    if (!button) return;

    button.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keyboard[key] = true;
        if (key === "SPACE" || key === "SHIFT") justPressed[key] = true;
        button.classList.add("active");
      },
      { passive: false }
    );

    button.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keyboard[key] = false;
        if (key === "SPACE" || key === "SHIFT") justPressed[key] = false;
        button.classList.remove("active");
      },
      { passive: false }
    );
  });
}

/**
 * Adjusts UI elements depending on device orientation.
 */
function handleOrientationChange() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const rotateOverlay = document.getElementById("rotateDevice");
  const leftBtns = document.getElementById("leftMobile-container");
  const rightBtns = document.getElementById("rightMobile-container");

  if (isPortrait) {
    rotateOverlay?.classList.remove("hidden");
    leftBtns?.classList.add("hidden");
    rightBtns?.classList.add("hidden");
  } else {
    rotateOverlay?.classList.add("hidden");
    leftBtns?.classList.remove("hidden");
    rightBtns?.classList.remove("hidden");
  }

  ["LEFT", "RIGHT", "SPACE", "SHIFT"].forEach((key) => (keyboard[key] = false));
  ["left_button", "right_button", "jump_button", "throw_button"].forEach(
    (id) => {
      document.getElementById(id)?.classList.remove("active");
    }
  );
}

/**
 * Displays the legal notice (Impressum) and pauses the game.
 */
function showImpressum() {
  document.getElementById("impressum")?.classList.remove("hidden");
  document.getElementById("overlayBlocker")?.classList.add("show");
  pauseGame();
}

/**
 * Hides the legal notice and resumes the game.
 */
function closeImpressum() {
  document.getElementById("impressum")?.classList.add("hidden");
  document.getElementById("overlayBlocker")?.classList.remove("show");
  resumeGame();
}

/**
 * Toggles the help page and pauses/resumes the game accordingly.
 */
function showHelpPage() {
  const helpPage = document.getElementById("help");
  const isVisible = helpPage.classList.toggle("hidden");
  document
    .getElementById("overlayBlocker")
    ?.classList.toggle("show", !helpPage.classList.contains("hidden"));

  if (helpPage.classList.contains("hidden")) {
    resumeGame();
  } else {
    pauseGame();
  }
}
