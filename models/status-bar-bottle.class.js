/**
 * Represents the status bar for bottles in the game.
 * Inherits from DrawableObject and includes properties for images and percentage.
 */
class StatusBarBottle extends DrawableObject {

    // Images for the bottle status bar based on percentage
    IMAGES = [
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png',
    ];

    percentage = 0; // Initial percentage of the status bar

    /**
     * Initializes the StatusBarBottle class.
     * Loads the images for the status bar, sets the initial position and dimensions,
     * and sets the initial percentage.
     */
    constructor() {
        super(); // Call the parent class constructor
        this.loadImages(this.IMAGES); // Load all images for the status bar
        this.x = 40; // Set the initial x-coordinate of the status bar
        this.y = 90; // Set the initial y-coordinate of the status bar
        this.width = 200; // Set the width of the status bar
        this.height = 50; // Set the height of the status bar
        this.setPercentage(0); // Set the initial percentage to 0
    }
    
    /**
     * Sets the percentage of the status bar and updates the displayed image.
     * @param {number} percentage - The new percentage value.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100)); // Limit the value to 0-100%
        let path = this.IMAGES[this.resolveImageIndex()]; // Get the path of the image based on the percentage
        this.img = this.imageCache[path]; // Set the image based on the resolved path
    }
    
    /**
     * Resolves the image index based on the current percentage.
     * @returns {number} - The index of the image corresponding to the percentage.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
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
