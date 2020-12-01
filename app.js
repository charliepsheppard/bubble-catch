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

// Utility Functions

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

const getDistance = (x1, y1, x2, y2) => {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

const randomIntegerFromRange = (min, max) => {
    return Math.random() * (max - min * 1) + min;
}

canvas.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

// Objects

class Player {
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
        this.draw();
    }
}
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

    update(bubbles) {
        this.draw()
        // console.log(bubbles.length);

        for (let i = 0; i < bubbles.length; i++) {
            if(this === bubbles[i]) continue;
            if (getDistance(this.x, this.y, bubbles[i].x, bubbles[i].y) - this.radius * 2 < 0) {
                console.log('Has collided');
            }
            // console.log(bubbles[i]);
        }
    }
}

// Implementation 

let player;
let bubbles;

function init() {
    player = new Player(200, 100, 50, 'dodgerblue');
    player.draw();

    bubbles = [];

    for (let i = 0; i < 5; i++) {
        const radius = 20;
        let x = randomIntegerFromRange(radius, canvas.width - radius);
        let y = randomIntegerFromRange(radius, canvas.height - radius);
        const color = 'tomato';

        if(i !== 0) {
            for(let j = 0; j < bubbles.length; j++) {
                if (getDistance(x, y, bubbles[j].x, bubbles[j].y) - radius * 2 < 0) {
                    x = randomIntegerFromRange(radius, canvas.width - radius);
                    y = randomIntegerFromRange(radius, canvas.height - radius);

                    j = -1;
                }
            }
        }

        bubbles.push(new Bubble(x, y, radius, color))
    }
    // console.log(bubbles);
}


// Animation loop

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.x = mouse.x;
    player.y = mouse.y;
    player.update();

    requestAnimationFrame(animate);

    bubbles.forEach(bubble => {
        // console.log(bubbles);
        if (getDistance(player.x, player.y, bubble.x, bubble.y) < player.radius + bubble.radius) {
            bubble.color = 'purple';
        } else {
            bubble.color = 'tomato';
        }
        bubble.update(bubbles);
        // console.log(bubbles.length)
    })

}

init();
animate();