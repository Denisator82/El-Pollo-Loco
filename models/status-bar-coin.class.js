/**
 * Represents the coin status bar in the game UI.
 * Displays how many coins have been collected (0–100%).
 * Inherits from {@link DrawableObject}.
 */
class StatusBarCoin extends DrawableObject {
    /**
     * Image paths for different fill levels of the coin status bar.
     * @type {string[]}
     */
    IMAGES = [
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
    ];

    /**
     * The current percentage (0–100) shown on the status bar.
     * @type {number}
     */
    percentage = 0;

    /**
     * Creates a new StatusBarCoin instance.
     * Loads images, sets position and size, and initializes the percentage to 0.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 45;
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