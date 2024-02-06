let gameStarted = false;
const FRAME_RATE = 60;
const GRAVITY = 0.4;
const TAPE_SPEED = -3;
const BOOST = -1;
const SPAWN_WAIT = 3;

class Fly {
  constructor () {
    this.x = 100;
    this.y = 300;
    this.sprite = new Array(2);
    this.vel = 0;
    this.accel = GRAVITY;
    this.alive = true;
    this.score = 0;
    this.curFrame = 0;
  }
  
  animate() {
    if (frameCount % 15 == 0) {
      this.curFrame++;
    }
  }
  
  draw() {
    image(this.sprite[this.curFrame % 2], this.x, this.y, 50, 50)  
  }
  
  physics() {
    this.vel += this.accel;
    this.y += this.vel;
  }
}

class FlyTape {
  constructor (sprite, x, y, id) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.id = id;
    this.flyPassed = false;
  }
  
  move() {
    this.x += TAPE_SPEED;
  }
  
  draw() {
    imageMode(CENTER)
    image(this.sprite, this.x, this.y)
  }
  
  checkCollide() {
    if (fly.x == this.x) {
      if ((fly.y >= this.y + 100) || (fly.y <= this.y - 100)) {
        fly.alive = false;
      }
    }
    if (!this.flyPassed && this.x <= fly.x) {
      this.flyPassed = true;
      fly.score++;
    }
  }
}

class Background {
  constructor(sprite) {
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
  }
  move() {
    this.x += -1.5;
    if (this.x <= -600) {
      this.x += 600
    }
  }
  draw(){
    imageMode(CORNER)
    image(this.sprite, this.x, this.y, 600, 600)
    image(this.sprite, this.x + 600, this.y, 600, 600)
    fill('#ffffff88')
    rect(0,0,600,600)
  }
}

let bg = new Background();
let tapes = [];
let id = 1;
let fly = new Fly();
let gameOverImg;
let tapeSprite;
let title;

function preload() {
  title = loadImage('flappyflytitle.png')
  fly.sprite[0] = loadImage('flappyFly1.png')
  fly.sprite[1] = loadImage('flappyFly2.png')
  
  tapeSprite = loadImage('flytape.png')
  tapes.push(new FlyTape(tapeSprite, 640, 300, id++))
  bg.sprite = loadImage('flappyfly-bg.png')
  gameOverImg = loadImage('flappyfly-gameover.png')
}

function setup() { 
  createCanvas(600, 600);
  frameRate(FRAME_RATE)
}

function printScore(dead) {
  let score = 'Score: ' + fly.score;
  fill(255)
  textSize(32)
  textAlign(RIGHT)
  stroke(0)
  strokeWeight(4)
  if (dead) {
    textAlign(CENTER)
    textSize(55)
    fill(0)
    noStroke()
    text(score, 300, 500)
  } else {
    text(score, 590, 32)
  }
}

function draw() {
  background(255);
  bg.draw()
  bg.move()

  if (gameStarted) {
    if (keyIsDown(32) || mouseIsPressed) {
      if (fly.vel >= 0) {
        fly.vel = 0;
      }
      fly.vel += BOOST;
    }
  
    if (frameCount % (SPAWN_WAIT * FRAME_RATE) == 0) {
      tapes.push(new FlyTape(tapeSprite, 640, Math.floor(Math.random()*350)+125, id++))
    }
  
    for (let tape of tapes) {
      tape.move();
      tape.draw();
      tape.checkCollide();
    }
    if (tapes.length > 0 && tapes[0].x <= -40) {
        tapes.shift();
    }
  
    fly.animate();
    fly.physics();
    fly.draw();
  
    printScore();
  
    if (fly.y >= 620) {
      fly.alive = false;
    }

    if (!fly.alive) { //check for game over
      noLoop();
      imageMode(CORNER)
      image(gameOverImg, 0,0,600,600)
      printScore(true)
    }
    
  } else { //if game hasn't started yet
    imageMode(CENTER)
    image(title, 300,300,400,400)
    if (mouseIsPressed) {
      gameStarted = true;
    }
  }
}



