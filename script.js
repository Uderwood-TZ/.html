const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: Math.floor(Math.random() * (tileCount - 2)) + 1, y: Math.floor(Math.random() * (tileCount - 2)) + 1};
let direction = {x: 0, y: 0};
let score = 0;

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 200);
}

function update() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {x: Math.floor(Math.random() * (tileCount - 2)) + 1, y: Math.floor(Math.random() * (tileCount - 2)) + 1};
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const hue = (Date.now() / 100) % 360;
    snake.forEach((segment, index) => {
        let segmentHue = (hue + index * 10) % 360;
        if (segmentHue >= 330 || segmentHue <= 30) {
            segmentHue = 60 + (segmentHue % 60);
        }
        ctx.fillStyle = `hsl(${segmentHue}, 100%, 50%)`;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    score = 0;
}

let canChangeDirection = true;

window.addEventListener('keydown', e => {
    if (!canChangeDirection) return;
    
    const newDirection = {x: 0, y: 0};
    switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) newDirection.y = -1; break;
        case 'ArrowDown': if (direction.y === 0) newDirection.y = 1; break;
        case 'ArrowLeft': if (direction.x === 0) newDirection.x = -1; break;
        case 'ArrowRight': if (direction.x === 0) newDirection.x = 1; break;
    }
    
    if (newDirection.x !== 0 || newDirection.y !== 0) {
        direction = newDirection;
        canChangeDirection = false;
        setTimeout(() => canChangeDirection = true, 100);
    }
});

gameLoop();