class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    
    constructor(){
        super().loadImage('img/img_pollo_locco/img/5_background/layers/4_clouds/1.png');

        this.x = 220 + Math.random() * 2500;
        this.animate();  
    }

    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}