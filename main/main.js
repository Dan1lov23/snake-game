const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = 'RIGHT';
let food = generateFood();
let gameInterval;

document.getElementById('highScore').innerText = 'Рекорд: ' + highScore;

document.addEventListener('keydown', changeDirection);
document.getElementById('startButton').addEventListener('click', startGame);

function generateFood() {
    let newFood;
    let occupied = true;

    while (occupied) {
        occupied = false;
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };

        // Проверяем, занята ли позиция еды
        if (collision(newFood, snake)) {
            occupied = true; // Если еда на позиции змейки, продолжаем генерировать
        }
    }

    return newFood;
}

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отображение змейки
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Отображение еды
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Проверка на поедание еды
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = generateFood(); // Генерируем новую еду после поедания
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    // Проверка на столкновение с границей или с самой собой
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameInterval);
        alert('Игра окончена! Ваш счет: ' + score);

        // Сохранение рекорда
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerText = 'Рекорд: ' + highScore;
        }
        score = 0; // Сбросить счет
    }

    snake.unshift(newHead);
    document.getElementById('score').innerText = 'Счет: ' + score;
}

function startGame() {
    clearInterval(gameInterval);
    score = 0;
    snake = [{ x: 9 * box, y: 9 * box }];
    direction = 'RIGHT';
    food = generateFood();
    gameInterval = setInterval(draw, parseInt(document.getElementById('difficulty').value));
}