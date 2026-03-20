let mic;
let iniciado = false;

let vol = 0;
let smoothVol = 0;

let explosion = false;
let splashes = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");
  noLoop(); // evita travar antes do clique
}

function startApp() {
  userStartAudio();

  mic = new p5.AudioIn();
  mic.start();

  iniciado = true;
  loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20, 30, 50);

  if (!iniciado) return;

  vol = mic.getLevel();
  smoothVol = lerp(smoothVol, vol, 0.1);

  let base = min(width, height);
  let maxSize = base * 0.5;

  let size = map(smoothVol, 0, 0.08, 50, maxSize);
  let carga = constrain(map(smoothVol, 0, 0.08, 0, 1), 0, 1);

  let cor = lerpColor(color(200, 220, 255), color(255, 0, 0), carga);

  if (!explosion) {
    fill(cor);
    ellipse(width / 2, height / 2, size, size);

    if (carga > 0.4) {
      explodir();
    }
  }

  for (let s of splashes) {
    s.update();
    s.show();
  }
}

function explodir() {
  explosion = true;

  for (let i = 0; i < 60; i++) {
    splashes.push(new Splash(width / 2, height / 2));
  }
}

class Splash {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-6, 6);
    this.vy = random(-6, 6);
    this.size = random(10, 30);
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 4;
  }

  show() {
    noStroke();
    fill(0, 255, 100, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}