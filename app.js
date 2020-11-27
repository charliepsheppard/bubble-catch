const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 600;

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

const canvasPosition = getPosition(canvas);

// addEventListener('mousemove', (event) => {
//     mouse.x = event.clientX;
//     console.log(mouse.x)
//     mouse.y = event.clientY;
// })

canvas.addEventListener('mousemove', setMouseMove, false)

function setMouseMove(event) {
    mouse.x = event.clientX - canvasPosition.x;
    mouse.y = event.clientY - canvasPosition.y;
}

function getPosition(el) {
    let xPosition = 0;
    let yPosition = 0;

    while (el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }

    return {
        x: xPosition,
        y: yPosition
    };
}

canvas.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

class Bubble {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.draw()
    }
}

let player;

const init = () => {
    player = new Bubble(200, 100, 50, 'dodgerblue');
    player.draw();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.x = mouse.x;
    player.y = mouse.y;
    player.update();

    requestAnimationFrame(animate);

}

init();
animate();