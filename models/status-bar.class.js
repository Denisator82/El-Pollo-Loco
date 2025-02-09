/**
 * Represents the status bar for health in the game.
 * Inherits from DrawableObject and includes properties for images and health percentage.
 */
class StatusBar extends DrawableObject {

    // Images for the health status bar based on percentage
    IMAGES_HEALTH = [
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png', // 0
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png' // 5
    ];

    percentage = 100; // Initial health percentage of the status bar

    /**
     * Initializes the StatusBar class.
     * Loads the images for the health status bar, sets the initial position and dimensions,
     * and sets the initial health percentage.
     */
    constructor() {
        super(); // Call the parent class constructor
        this.loadImages(this.IMAGES_HEALTH); // Load all images for the health status bar
        this.x = 40; // Set the initial x-coordinate of the status bar
        this.y = 0; // Set the initial y-coordinate of the status bar
        this.width = 200; // Set the width of the status bar
        this.height = 50; // Set the height of the status bar
        this.setPercentage(100); // Set the initial health percentage to 100
    }

    /**
     * Sets the health percentage of the status bar and updates the displayed image.
     * @param {number} percentage - The new health percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage; // Update the health percentage
        let path = this.IMAGES_HEALTH[this.resolveImageIndex()]; // Get the path of the image based on the percentage
        this.img = this.imageCache[path]; // Set the image based on the resolved path
    }

    /**
     * Resolves the image index based on the current health percentage.
     * @returns {number} - The index of the image corresponding to the health percentage.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
