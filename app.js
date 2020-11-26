const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 600;

const mouse = {
    x: canvas.width / 2,
    y: canvas.height /2
}

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

class Bubble {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    
}

const init = () => {

}

init();