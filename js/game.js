let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let fullscreen = false;
let keyPressed = {}; // Prevents rapid-fire actions
let gameAlreadyStarted = false;

function initPage() {
  loadMuteState();
  updateAudioIcon();
}

function loadMuteState() {
  const storedMute = localStorage.getItem("isMuted") === "true";
  audioManager.isMuted = storedMute;
}

function saveMuteState() {
  localStorage.setItem("isMuted", audioManager.isMuted.toString());
}

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

function startGame() {
  if (gameAlreadyStarted) return;

  gameAlreadyStarted = true;
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("canvasContent").classList.remove("hidden");
  newGame();
  world.audioManager.playBackgroundMusic();
}

function gameLose() {
  if (!world) return;
  world.gameOver = true;
  stopGame();
  world.audioManager?.playSound?.("lose");
  document.getElementById("loseImageContainer")?.classList.add("show");
}

function gameWin() {
  if (!world) return;
  world.gameOver = true;
  stopGame();
  world.audioManager?.stopAllSounds?.();
  world.audioManager?.playWinSound?.();
  document.getElementById("winImageContainer")?.classList.add("show");
}

function stopGame() {
  if (!world) return;
  world.stopAllIntervals?.();
}

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

function toggleMute() {
  const manager = world?.audioManager || audioManager;
  if (manager) {
    manager.toggleMute();
    localStorage.setItem('isMuted', manager.isMuted.toString());
    updateAudioIcon();
  }
}

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

function toggleFullscreen() {
  const mainSection = document.getElementById("mainSection");
  if (!fullscreen) {
    mainSection.requestFullscreen?.();
    fullscreen = true;
  } else {
    document.exitFullscreen?.();
    fullscreen = false;
  }
}

function showHelpPage() {
  const helpPage = document.getElementById('help');
  if (helpPage) helpPage.classList.toggle('hidden');
}

const KEY_MAP = {
  39: "RIGHT", 68: "RIGHT",
  37: "LEFT", 65: "LEFT",
  38: "UP", 87: "UP",
  40: "DOWN", 83: "DOWN",
  32: "SPACE", 16: "SHIFT",
};

const keyState = {
  SPACE: false, SHIFT: false,
  RIGHT: false, LEFT: false,
  UP: false, DOWN: false,
};

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

window.addEventListener('resize', handleOrientationChange);
window.addEventListener('orientationchange', handleOrientationChange);

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

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
      if (key === 'SPACE' || key === 'SHIFT') justPressed[key] = true;
      button.classList.add("active");
    }, { passive: false });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
      if (key === 'SPACE' || key === 'SHIFT') justPressed[key] = false;
      button.classList.remove("active");
    }, { passive: false });
  });
}

function handleOrientationChange() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const rotateOverlay = document.getElementById('rotateDevice');
  const leftBtns = document.getElementById('leftMobile-container');
  const rightBtns = document.getElementById('rightMobile-container');

  if (isPortrait) {
    rotateOverlay?.classList.remove('hidden');
    leftBtns?.classList.add('hidden');
    rightBtns?.classList.add('hidden');
  } else {
    rotateOverlay?.classList.add('hidden');
    leftBtns?.classList.remove('hidden');
    rightBtns?.classList.remove('hidden');
  }

  ['LEFT', 'RIGHT', 'SPACE', 'SHIFT'].forEach(key => keyboard[key] = false);
  ['left_button', 'right_button', 'jump_button', 'throw_button'].forEach(id => {
    document.getElementById(id)?.classList.remove('active');
  });
}

function showImpressum() {
  document.getElementById("impressum")?.classList.remove("hidden");
}

function closeImpressum() {
  document.getElementById("impressum")?.classList.add("hidden");
}
