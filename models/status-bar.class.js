/**
 * Represents the health status bar for the main character.
 * Inherits from {@link DrawableObject}.
 * Displays the current energy/health as a percentage (0–100%).
 */
class StatusBar extends DrawableObject {
  /**
   * Image paths representing different health levels of the character.
   * @type {string[]}
   */
  IMAGES_HEALTH = [
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Current health percentage (0–100).
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new StatusBar instance for the player character.
   * Loads images, sets position and size, and initializes to 100%.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_HEALTH);
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Updates the health percentage and sets the corresponding image.
   *
   * @param {number} percentage - New health value (0–100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_HEALTH[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current health percentage.
   *
   * @returns {number} - Index of the image that matches the current health level.
   */
  resolveImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }
}
