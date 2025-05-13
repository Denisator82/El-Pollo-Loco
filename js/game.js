let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let fullscreen = false;
let keyPressed = {}; // Verhindert Dauerfeuer

function initPage() {
    updateAudioIcon();
}

function newGame() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard, audioManager);
    world.loadSounds();
    passWorldToLevel();
}

function passWorldToLevel() {
    if (level1 && world) {
        level1.enemies.forEach(enemy => {
            if (enemy instanceof Chicken || enemy instanceof ChickenMini || enemy instanceof Endboss) {
                enemy.world = world;
            }
        });
        world.character.world = world;
    }
}

function startGame() {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("canvasContent").classList.remove("hidden");
    newGame();
    world.audioManager.playBackgroundMusic();
}

function gameLose() {
    document.getElementById("gameLose").classList.add("show");
    world?.audioManager?.playSound?.('lose');
    stopGame();
}

function gameWin() {
    console.log("LOG: gameWin() called.");
    if (!world) return;

    world.gameOver = true;
    stopGame();

    const winScreen = document.getElementById("gameWin");
    winScreen?.classList.add("show");
    world.audioManager?.playSound?.("win");
}

function stopGame() {
    console.log('LOG: --- Start stopGame (game.js) ---');

    if (!world) {
        console.warn('LOG: World object not available in stopGame.');
        return;
    }

    world.character?.stopCharacterIntervals?.();

    if (Array.isArray(world.enemies)) {
        world.enemies.forEach(enemy => {
            enemy?.stopChickenIntervals?.();
            enemy?.stopChickenMiniIntervals?.();
        });
    }

    if (Array.isArray(world.level?.endboss)) {
        world.level.endboss.forEach(boss => boss?.stopEndbossIntervals?.());
    } else {
        console.warn("LOG: world.level.endboss is not an array or does not exist.");
    }

    world.throwableObjects?.forEach(obj => obj?.stopThrowableObjectIntervals?.());
    world.stopWorldIntervals?.();
    world.audioManager?.pauseEndbossMusic?.();
    world.audioManager?.pauseBackgroundMusic?.();

    console.log('LOG: --- End stopGame (game.js) ---');
}

function restartGame() {
    document.getElementById("gameWin").classList.remove("show");
    document.getElementById("gameLose").classList.remove("show");
    document.getElementById("startScreen").classList.remove("hidden");
    newGame();
}

function toggleMute() {
    if (world && world.audioManager) {
        audioManager.toggleMute();
        updateAudioIcon();
    }
}

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

function toggleFullscreen() {
    const mainSection = document.getElementById('mainSection');
    if (!fullscreen) {
        mainSection.requestFullscreen?.();
        fullscreen = true;
    } else {
        document.exitFullscreen?.();
        fullscreen = false;
    }
}

function showHelpPage() {
    alert('Hilfeseite wird angezeigt (Funktionalität noch nicht implementiert)');
}

const KEY_MAP = {
    39: 'RIGHT', 68: 'RIGHT',
    37: 'LEFT', 65: 'LEFT',
    38: 'UP', 87: 'UP',
    40: 'DOWN', 83: 'DOWN',
    32: 'SPACE',
    16: 'SHIFT'
};

window.addEventListener("keydown", (e) => {
    const key = KEY_MAP[e.keyCode];
    if (key && !keyPressed[key]) {
        keyboard[key] = true;
        keyPressed[key] = true;
    }
});

window.addEventListener("keyup", (e) => {
    const key = KEY_MAP[e.keyCode];
    if (key) {
        keyboard[key] = false;
        keyPressed[key] = false;
    }
});

function initMobile() {
    setupMobileButtonEvents();
}

function setupMobileButtonEvents() {
    const buttons = [
        { id: 'left_button', key: 'LEFT' },
        { id: 'right_button', key: 'RIGHT' },
        { id: 'jump_button', key: 'SPACE' },
        { id: 'throw_button', key: 'SHIFT' }
    ];

    buttons.forEach(({ id, key }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                keyboard[key] = true;
            }, { passive: false });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                keyboard[key] = false;
            }, { passive: false });
        }
    });
}
