/**
 * Represents the health status bar for the end boss in the game.
 * Inherits from {@link DrawableObject}.
 * Displays the remaining health (0–100%) and supports toggling visibility.
 */
class StatusBarEndboss extends DrawableObject {
    /**
     * Image paths representing different health levels of the end boss.
     * @type {string[]}
     */
    IMAGES_HEALTH = [
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
    ];

    /**
     * Current health percentage (0–100).
     * @type {number}
     */
    percentage = 100;

    /**
     * Controls visibility of the status bar on the canvas.
     * @type {boolean}
     */
    visible = false;

    /**
     * Creates a new StatusBarEndboss instance.
     * Loads images, sets position and size, and initializes health to 100%.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 500;
        this.y = 45;
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    /**
     * Updates the health percentage and selects the corresponding status bar image.
     * The value is clamped between 0 and 100.
     *
     * @param {number} health - The raw health value (e.g., 80).
     */
    setPercentage(health) {
        const maxHealth = 100;
        this.percentage = Math.max(0, Math.min((health / maxHealth) * 100, 100));
        const path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to an index in the image array.
     *
     * @returns {number} - Index of the image that corresponds to the current health.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }

    /**
     * Draws the status bar on the canvas if it's marked as visible.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
     */
    draw(ctx) {
        if (this.visible) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
