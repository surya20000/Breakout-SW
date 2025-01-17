const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let xDirection = -2;
let yDirection = 2;
const destructionSound = new Audio("destroySound.mp3");
const looseSound = new Audio("looseSound.mp3");

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let balls = [{ position: [...ballStart], xDirection: -2, yDirection: 2 }];

let timerId;
let score = 0;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}
addBlocks();

const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);
drawUser();

function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

// Create balls dynamically
function createBalls() {
  balls.forEach((ball, index) => {
    if (!ball.element) {
      const ballElement = document.createElement("div");
      ballElement.classList.add("ball");
      grid.appendChild(ballElement);
      ball.element = ballElement;
    }
    drawBall(ball);
  });
}

function drawBall(ball) {
  ball.element.style.left = ball.position[0] + "px";
  ball.element.style.bottom = ball.position[1] + "px";
}

function moveBalls() {
  balls.forEach((ball) => {
    ball.position[0] += ball.xDirection;
    ball.position[1] += ball.yDirection;
    drawBall(ball);
    checkForCollisions(ball);
  });
}

function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}
document.addEventListener("keydown", moveUser);

function checkForCollisions(ball) {
  for (let i = 0; i < blocks.length; i++) {
    if (
      ball.position[0] > blocks[i].bottomLeft[0] &&
      ball.position[0] < blocks[i].bottomRight[0] &&
      ball.position[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ball.position[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      destructionSound.play();
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      ball.yDirection *= -1;
      score++;
      scoreDisplay.innerHTML = score;

      if (score % 5 === 0) {
        spawnAdditionalBall();
      }

      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "You Win!";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  if (ball.position[0] >= boardWidth - ballDiameter || ball.position[0] <= 0) {
    ball.xDirection *= -1;
  }
  if (ball.position[1] >= boardHeight - ballDiameter) {
    ball.yDirection *= -1;
  }

  if (
    ball.position[0] > currentPosition[0] &&
    ball.position[0] < currentPosition[0] + blockWidth &&
    ball.position[1] > currentPosition[1] &&
    ball.position[1] < currentPosition[1] + blockHeight
  ) {
    ball.yDirection *= -1;
  }

  if (ball.position[1] <= 0) {
    looseSound.play();
    const index = balls.indexOf(ball);
    if (index > -1) balls.splice(index, 1);

    clearInterval(timerId);
    scoreDisplay.innerHTML = "You lose!";
    document.removeEventListener("keydown", moveUser);
  }
}

function spawnAdditionalBall() {
  const newBall = {
    position: [...ballStart],
    xDirection: Math.random() > 0.5 ? 2 : -2,
    yDirection: Math.random() > 0.5 ? 2 : -2,
  };
  balls.push(newBall);
  createBalls();
}

createBalls();
timerId = setInterval(moveBalls, 30);
