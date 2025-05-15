/**
 * Represents the state of keyboard keys used in the game.
 * Each property corresponds to a specific key and is set to `true` when pressed, `false` when released.
 */
class Keyboard {
    /**
     * Left arrow key or A.
     * @type {boolean}
     */
    LEFT = false;

    /**
     * Right arrow key or D.
     * @type {boolean}
     */
    RIGHT = false;

    /**
     * Up arrow key or W.
     * @type {boolean}
     */
    UP = false;

    /**
     * Down arrow key or S.
     * @type {boolean}
     */
    DOWN = false;

    /**
     * Space key – used for jumping.
     * @type {boolean}
     */
    SPACE = false;

    /**
     * Shift key – used for throwing bottles.
     * @type {boolean}
     */
    SHIFT = false;
}
