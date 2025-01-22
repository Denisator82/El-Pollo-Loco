class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];
    clouds = [
        new Cloud()
    ];
    backgroundObjects = [
        new BackgroundObject('img/img_pollo_locco/img/5_background/layers/air.png',0 , 80),
        new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 0, 80),
        new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 0, 80),
        new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 0, 80)
    ];
    ctx;
    canvas;
    keyboard;

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard; 
        this.draw();
        this.setWorld();
    }

    setWorld(){
        this.character.world = this; // es wird nur "this" übergeben damit man die aktuelle Instanz der Welt hat
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        
        //Draw() wird immer wieder eingefügt 
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
}