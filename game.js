const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const DOT_SIZE = 20;
const FOOD_COLOR = "#f7ca18";
const MAX_SPEED = 30;

class Snake {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");

    this.game_start = document.getElementById("game_start");
    this.wall_setting = document.getElementById("wall_setting");
    this.currentScore = document.getElementById("currentScore");
    this.restart_game = document.getElementById("restart_game");
    this.game_over_screen = document.querySelector(".game__over");

    this.game_over = false;
    this.gameTimer;
    this.snake_dir = KEY_RIGHT;
    this.snake_next_dir;
    this.food = { x: 0, y: 0 };
    this.score = 0;
    this.wall = false;

    this.snake_speed = 200;
    this.snake;    
    this.game_start.addEventListener("click", this.startGame.bind(this));
    this.wall_setting.addEventListener("change", this.wallSetting.bind(this));
    this.restart_game.addEventListener("click", this.restartGame.bind(this));
  }

  wallSetting(e) {
    this.wall = e.target.checked;
    this.canvas.classList.toggle("canvas_border");
  }

  init() {
    this.snake = [];

    for (var i = 4; i >= 0; i--) {
      this.snake.push({
        x: i,
        y: Math.floor(this.canvas.height / DOT_SIZE / 2)
      });
    }

    this.addFood();

    this.setBackground("#fff", "#eee");

    for (var i = 0; i < this.snake.length; i++) {
      this.draw(this.snake[i].x, this.snake[i].y);
    }

    this.draw(this.food.x, this.food.y, FOOD_COLOR);
  }

  setBackground(color1, color2) {
    let context = this.context;
    let canvas = this.canvas;

    context.fillStyle = color1;
    context.strokeStyle = color2;

    context.fillRect(0, 0, canvas.height, canvas.width);

    for (var x = 0.5; x < canvas.width; x += DOT_SIZE) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }
    for (var y = 0.5; y < canvas.height; y += DOT_SIZE) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }

    context.stroke();
  }

  startGame() {
    this.canvas.focus();

    this.snake_next_dir = KEY_RIGHT;
    this.score = 0;
    this.altScore(this.score);

    this.gameLoop();

    this.canvas.onkeydown = evt => {
      let key = evt.keyCode;
      this.changeDir(key);
    };

    document.querySelector(".game__intro").classList.add("game__intro_hidden");
  }

  altScore(score_val) {
    this.currentScore.innerHTML = score_val;
  }

  gameOver() {
    this.game_over = true;
    clearTimeout(this.gameTimer);
    this.game_over_screen.classList.add("game__over_show");
  }

  restartGame() {
    this.game_over = false;
    this.game_over_screen.classList.remove("game__over_show");
    this.init();
    this.startGame();
  }

  draw(x, y, color = "#000") {
    this.context.fillStyle = color;
    this.context.fillRect(x * DOT_SIZE, y * DOT_SIZE, DOT_SIZE, DOT_SIZE);
  }
  changeDir(key) {
    if (key === KEY_UP && this.snake_dir != KEY_DOWN) {
      this.snake_next_dir = KEY_UP;
      return;
    }
    if (key === KEY_RIGHT && this.snake_dir != KEY_LEFT) {
      this.snake_next_dir = KEY_RIGHT;    
      return;
    }

    if (key === KEY_DOWN && this.snake_dir != KEY_UP) {
      this.snake_next_dir = KEY_DOWN;
      return;
    }
    
    if (key === KEY_LEFT && this.snake_dir != KEY_RIGHT) {
      this.snake_next_dir = KEY_LEFT;
      return;
    }

    }
    // if (key === KEY_UP && this.snake_dir != KEY_DOWN) {
    //   this.snake_next_dir = KEY_UP;
    // } else {
    //   if (key === KEY_RIGHT && this.snake_dir != KEY_LEFT) {
    //     this.snake_next_dir = KEY_RIGHT;
    //   } else {
    //     if (key === KEY_DOWN && this.snake_dir != KEY_UP) {
    //       this.snake_next_dir = KEY_DOWN;
    //     } else {
    //       if (key === KEY_LEFT && this.snake_dir != KEY_RIGHT) {
    //         this.snake_next_dir = KEY_LEFT;
    //       }
    //     }
    //   }
    // }
  

  addFood() {
    this.food.x = Math.floor(
      Math.random() * (this.canvas.width / DOT_SIZE - 1)
    );
    this.food.y = Math.floor(
      Math.random() * (this.canvas.height / DOT_SIZE - 1)
    );

    for (var i = 0; i < this.snake.length; i++) {
      if (
        this.checkBlock(
          this.food.x,
          this.food.y,
          this.snake[i].x,
          this.snake[i].y
        )
      ) {
        this.addFood();
      }
    }
  }

  checkBlock(x, y, _x, _y) {
    return x == _x && y == _y ? true : false;
  }

  checkWall() {
    let snake = this.snake;
    if (
      snake[0].x < 0 ||
      snake[0].x == this.canvas.width / DOT_SIZE ||
      snake[0].y == this.canvas.height / DOT_SIZE ||
      snake[0].y < 0
    ) {
      this.gameOver();
    }
  }

  goThroughWall() {
    let snake = this.snake;
    let canvas = this.canvas;
    for (var i = 0, x = snake.length; i < x; i++) {
      if (snake[i].x < 0) {
        snake[i].x = snake[i].x + canvas.width / DOT_SIZE;
      }
      if (snake[i].x == canvas.width / DOT_SIZE) {
        snake[i].x = snake[i].x - canvas.width / DOT_SIZE;
      }
      if (snake[i].y < 0) {
        snake[i].y = snake[i].y + canvas.height / DOT_SIZE;
      }
      if (snake[i].y == canvas.height / DOT_SIZE) {
        snake[i].y = snake[i].y - canvas.height / DOT_SIZE;
      }
    }
  }

  moveSnake() {
    let _x = this.snake[0].x;
    let _y = this.snake[0].y;

    this.snake_dir = this.snake_next_dir;

    switch (this.snake_dir) {
      case KEY_UP:
        _y--;
        break;
      case KEY_RIGHT:
        _x++;
        break;
      case KEY_DOWN:
        _y++;
        break;
      case KEY_LEFT:
        _x--;
        break;
    }

    this.snake.pop();
    this.snake.unshift({ x: _x, y: _y });
  }

  checkCollision() {
    let snake = this.snake;
    for (var i = 1; i < snake.length; i++) {
      if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
        this.gameOver();
      }
    }
  }

  eatFood() {
    let snake = this.snake;
    let food = this.food;

    if (this.checkBlock(snake[0].x, snake[0].y, food.x, food.y)) {
      snake[snake.length] = { x: snake[0].x, y: snake[0].y };
      this.score += 1;
      this.altScore(this.score);
      this.addFood();
      this.draw(food.x, food.y, FOOD_COLOR);

      if (this.snake_speed >= MAX_SPEED) {
        this.snake_speed--;
      }
    }
  }

  gameLoop() {
    if (this.game_over) return;

    let snake = this.snake;
    let context = this.context;
    this.moveSnake();

    if (this.wall) {
      // Wall on
      this.checkWall();
    } else {
      // Wall off
      this.goThroughWall();
    }

    // check collision
    this.checkCollision();

    // eat food
    this.eatFood();

    context.beginPath();
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    this.setBackground("#fff", "#eee");

    for (var i = 0; i < this.snake.length; i++) {
      this.draw(snake[i].x, snake[i].y);
    }

    this.draw(this.food.x, this.food.y, FOOD_COLOR);

    this.gameTimer = setTimeout(this.gameLoop.bind(this), this.snake_speed);
  }
}

let game = new Snake();
game.init();
