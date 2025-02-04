/**
 * Represents a drawable object in the game.
 * Contains properties for the image, image cache, current image index, 
 * position (x, y), dimensions (height, width), and offset for collision detection.
 */
class DrawableObject {
    img; // The image of the object
    imageCache = []; // Cache for loaded images
    currentImage = 0; // Index of the current image
    x = 120; // Initial x-coordinate
    y = 280; // Initial y-coordinate
    height = 150; // Height of the object
    width = 100; // Width of the object
    offset = { top: 0, right: 0, bottom: 0, left: 0 }; // Offset for collision detection

    /**
     * Loads an image from the specified path and assigns it to the object's img property.
     * 
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path; 
    }

    /**
     * Draws the object's image on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the bounding box and offset bounding box of the object for debugging purposes.
     * If the object is an instance of Character, Chicken, ChickenMini, Coin, Bottle, or Endboss,
     * it draws the original bounding box in blue and the offset bounding box in red.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof ChickenMini || this instanceof Coin || this instanceof Bottle || this instanceof Endboss) {
            // Draw the original bounding box in blue
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            // Draw the offset bounding box in red
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.left - this.offset.right,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }

    /**
     * Loads an array of images and stores them in the image cache.
     * 
     * @param {Array} arr - An array of image paths to be loaded (e.g., ['img/image1.png', 'img/image2.png', ...]).
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}