class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    offset = { top: 0, right: 0, bottom: 0, left: 0 }; // Füge die Offset-Eigenschaft hinzu

    //loadImage('img/test.png')
    loadImage(path) {
        this.img = new Image(); //this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path; 
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    // drawFrame(ctx) {
    //     if (this instanceof Character || this instanceof Chicken || this instanceof ChickenMini || this instanceof Coin || this instanceof Bottle || this instanceof Endboss) {
    //         // Zeichne den ursprünglichen Rahmen in blau
    //         ctx.beginPath();
    //         ctx.lineWidth = '5';
    //         ctx.strokeStyle = 'blue';
    //         ctx.rect(this.x, this.y, this.width, this.height);
    //         ctx.stroke();

    //         // Zeichne den Offset-Rahmen in rot
    //         ctx.beginPath();
    //         ctx.lineWidth = '3';
    //         ctx.strokeStyle = 'red';
    //         ctx.rect(
    //             this.x + this.offset.left,
    //             this.y + this.offset.top,
    //             this.width - this.offset.left - this.offset.right,
    //             this.height - this.offset.top - this.offset.bottom
    //         );
    //         ctx.stroke();
    //     }
    // }


    /**
     * 
     * @param {Array} arr - ['img/image1.png','img/image2.png', ...] 
     */
    loadImages(arr){
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


}