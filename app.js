const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 600;

const mouse = {
    x: 10,
    y: 10
};

const canvasPosition = getPosition(canvas);

let points = 1;

// addEventListener('mousemove', (event) => {
//     mouse.x = event.clientX;
//     console.log(mouse.x)
//     mouse.y = event.clientY;
// })

canvas.addEventListener('mousemove', setMouseMove, false)

canvas.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
})

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

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(bubble, otherBubble) {
    const xVelocityDiff = bubble.velocity.x - otherBubble.velocity.x;
    const yVelocityDiff = bubble.velocity.y - otherBubble.velocity.y;

    const xDist = otherBubble.x - bubble.x;
    const yDist = otherBubble.y - bubble.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherBubble.y - bubble.y, otherBubble.x - bubble.x);

        // Store mass in var for better readability in collision equation
        const m1 = bubble.mass;
        const m2 = otherBubble.mass;

        // Velocity before equation
        const u1 = rotate(bubble.velocity, angle);
        const u2 = rotate(otherBubble.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        bubble.velocity.x = vFinal1.x;
        bubble.velocity.y = vFinal1.y;

        otherBubble.velocity.x = vFinal2.x;
        otherBubble.velocity.y = vFinal2.y;
    }
}

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
        this.velocity = {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5
        }
        this.mass = 1;
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
                resolveCollision(this, bubbles[i]);
            }
            // console.log(bubbles[i]);
        }

        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.velocity.x = - this.velocity.x;
        }

        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.velocity.y = - this.velocity.y;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// Implementation 

let player;
let bubbles = {
    pos: [],
    neg: []
}

function init() {
    player = new Player(200, 100, 20, 'dodgerblue');
    player.draw();


    for (let i = 0; i < 10; i++) {
        const radius = 50;
        let x = randomIntegerFromRange(radius, canvas.width - radius);
        let y = randomIntegerFromRange(radius, canvas.height - radius);

        if(i !== 0) {
            for(let j = 0; j < bubbles.pos.length; j++) {
                if (getDistance(x, y, bubbles.pos[j].x, bubbles.pos[j].y) - radius * 2 < 0) {
                    x = randomIntegerFromRange(radius, canvas.width - radius);
                    y = randomIntegerFromRange(radius, canvas.height - radius);

                    j = -1;
                }
            }

            for (let j = 0; j < bubbles.neg.length; j++) {
                if (getDistance(x, y, bubbles.neg[j].x, bubbles.neg[j].y) - radius * 2 < 0) {
                    x = randomIntegerFromRange(radius, canvas.width - radius);
                    y = randomIntegerFromRange(radius, canvas.height - radius);

                    j = -1;
                }
            }
        }

        bubbles.pos.push(new Bubble(x, y, radius, 'tomato'))
        bubbles.neg.push(new Bubble(x, y, radius, 'black'))
    }
}


// Animation loop

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.x = mouse.x;
    player.y = mouse.y;
    player.update();

    requestAnimationFrame(animate);

    // Game Logic

    bubbles.pos.forEach(bubble => {
        // console.log(bubbles);
        if (getDistance(player.x, player.y, bubble.x, bubble.y) < player.radius + bubble.radius) {
            bubbles.pos.splice(bubbles.pos.indexOf(bubble), 1);
            points = points + 1;
            // console.log(points)
            // console.log(points);
        }
        bubble.update(bubbles.pos);
        // console.log(bubbles.length)
    })

    bubbles.neg.forEach(bubble => {
        if (getDistance(player.x, player.y, bubble.x, bubble.y) < player.radius + bubble.radius) {
            bubbles.neg.splice(bubbles.neg.indexOf(bubble), 1);
            points = points - 1
            // console.log(points)
            // console.log(points);
        }
        bubble.update(bubbles.neg);
    })

    // let canvasContent = document.querySelector('.game-canvas');

    if (points < 8 && points > 0) {
        document.querySelector('.score-current').textContent = `Score: ${points}`;
    } else if(points === 8) {
        // canvasContent.remove();
        document.querySelector('.score-current').textContent = 'YOU WIN!'
        player = undefined;
        // console.log('You win!')
    } else if(points === 0) {
        // canvasContent.remove();
        document.querySelector('.score-current').textContent = 'YOU LOSE!';
        player = undefined;
    }

    console.log(points);

    // bubbles.filter(bubble => {
    //     if (getDistance(player.x, player.y, bubble.x, bubble.y) < player.radius + bubble.radius) {
    //         console.log(bubbles.indexOf(bubble))
            
    //     }
    // })

}

init();
animate();