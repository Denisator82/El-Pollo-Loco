/**
 * Represents the bottle status bar in the game UI.
 * Displays how many bottles have been collected (0–100%).
 * Inherits from {@link DrawableObject}.
 */
class StatusBarBottle extends DrawableObject {
    /**
     * Image paths for different fill levels of the bottle status bar.
     * @type {string[]}
     */
    IMAGES = [
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
    ];

    /**
     * The current percentage (0–100) shown on the status bar.
     * @type {number}
     */
    percentage = 0;

    /**
     * Creates a new StatusBarBottle instance.
     * Loads all images, sets position and size, and initializes the percentage to 0.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 90;
        this.width = 200;
        this.height = 50;
        this.setPercentage(0);
    }

    /**
     * Updates the displayed image based on the current percentage.
     * Value is clamped between 0 and 100.
     * 
     * @param {number} percentage - The new percentage to set.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100));
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current percentage to the corresponding image index.
     * 
     * @returns {number} - The index for the appropriate status image.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 1) return 1;
        return 0;
    }
}
