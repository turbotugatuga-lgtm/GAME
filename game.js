
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let score = 0;
let highscore = 0;
let gameRunning = false;

const startScreen = document.getElementById('start-screen');
const playBtn = document.getElementById('play-btn');
const hud = document.getElementById('hud');
const scoreText = document.getElementById('score');
const highscoreText = document.getElementById('highscore');

// Player sprite
const playerImg = new Image();
playerImg.src = 'assets/turtle_sprite.png';

let frame = 0;
let player = {
  x: 50,
  y: 300,
  width: 64,
  height: 64,
  vy: 0,
  jumping: false
};

// Controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !player.jumping) {
    player.vy = -12;
    player.jumping = true;
  }
});

let gravity = 0.5;
let obstacles = [];
let coins = [];

function drawPlayer() {
  ctx.drawImage(playerImg, frame * 128, 0, 128, 128, player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  player.y += player.vy;
  player.vy += gravity;
  if (player.y >= 300) {
    player.y = 300;
    player.vy = 0;
    player.jumping = false;
  }
  frame = (frame + 1) % 4;
}

function drawObstacles() {
  ctx.fillStyle = '#0f0';
  obstacles.forEach(ob => {
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });
}

function updateObstacles() {
  obstacles.forEach(ob => ob.x -= 5);
  if (Math.random() < 0.02) {
    obstacles.push({ x: 800, y: 320, width: 40, height: 40 });
  }
  obstacles = obstacles.filter(ob => ob.x > -50);
}

function drawCoins() {
  ctx.fillStyle = 'gold';
  coins.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 10, 0, Math.PI*2);
    ctx.fill();
  });
}

function updateCoins() {
  coins.forEach(c => c.x -= 4);
  if (Math.random() < 0.02) {
    coins.push({ x: 800, y: Math.random() * 200 + 100 });
  }
  coins = coins.filter(c => c.x > -10);
}

function detectCollision() {
  obstacles.forEach(ob => {
    if (player.x < ob.x + ob.width &&
        player.x + player.width > ob.x &&
        player.y < ob.y + ob.height &&
        player.y + player.height > ob.y) {
      endGame();
    }
  });
  coins.forEach((c, i) => {
    if (player.x < c.x + 10 &&
        player.x + player.width > c.x &&
        player.y < c.y + 10 &&
        player.y + player.height > c.y) {
      score += 10;
      coins.splice(i, 1);
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  drawCoins();
  updatePlayer();
  updateObstacles();
  updateCoins();
  detectCollision();
  score++;
  scoreText.textContent = "Score: " + score;
  requestAnimationFrame(gameLoop);
}

function startGame() {
  startScreen.style.display = 'none';
  canvas.style.display = 'block';
  hud.style.display = 'block';
  score = 0;
  obstacles = [];
  coins = [];
  gameRunning = true;
  gameLoop();
}

function endGame() {
  gameRunning = false;
  if (score > highscore) {
    highscore = score;
  }
  highscoreText.textContent = "High Score: " + highscore;
  alert("Game Over! Score: " + score);
  startScreen.style.display = 'flex';
  canvas.style.display = 'none';
  hud.style.display = 'none';
}

playBtn.addEventListener('click', startGame);
