let mic;
let iniciado = false;

let vol = 0;
let smoothVol = 0;

let energia = 0;
let explosion = false;
let tempoExplosao = 0;

let splashes = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");
  noLoop();
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

  // 🔒 REDUÇÃO DE SENSIBILIDADE (ESSENCIAL)
  if (vol < 0.03) vol = 0;

  smoothVol = lerp(smoothVol, vol, 0.05);

  let base = min(width, height);
  let maxSize = base * 0.6;

  // 🎯 NORMALIZAÇÃO MAIS EXIGENTE
  let intensidade = map(smoothVol, 0.03, 0.15, 0, 1);
  intensidade = constrain(intensidade, 0, 1);

  // 🎯 ENERGIA MAIS LENTA (IMPORTANTE)
  if (intensidade > 0.4) {
    energia += intensidade * 0.03; // bem mais lento
  } else {
    energia -= 0.02;
  }

  energia = constrain(energia, 0, 1);

  // 🎯 TAMANHO BASEADO NA ENERGIA
  let size = map(energia, 0, 1, 50, maxSize);

  let cor = lerpColor(color(200, 220, 255), color(255, 0, 0), energia);

  if (!explosion) {
    fill(cor);
    ellipse(width / 2, height / 2, size, size);

    // 💥 EXPLOSÃO CONTROLADA
    if (energia > 0.97 && intensidade > 0.5) {
      explodir();
    }
  }

  // ===== BARRA DE CARREGAMENTO =====
  let barWidth = width * 0.6;
  let barHeight = 20;

  fill(80);
  rect(width / 2 - barWidth / 2, height * 0.85, barWidth, barHeight, 10);

  fill(0, 200, 255);
  rect(
    width / 2 - barWidth / 2,
    height * 0.85,
    barWidth * energia,
    barHeight,
    10
  );

  // ===== AVISO =====
  if (energia > 0.85 && !explosion) {
    fill(255, 80, 80);
    textAlign(CENTER);
    textSize(24);
    text("⚠️ Quase explodindo!", width / 2, height * 0.2);
  }

  // ===== GOSMA =====
  for (let s of splashes) {
    s.update();
    s.show();
  }

  // ===== RESET =====
  if (explosion) {
    tempoExplosao++;

    if (tempoExplosao > 60) {
      resetar();
    }
  }
}

function explodir() {
  explosion = true;
  tempoExplosao = 0;

  for (let i = 0; i < 80; i++) {
    splashes.push(new Splash(width / 2, height / 2));
  }
}

function resetar() {
  explosion = false;
  energia = 0;
  splashes = [];
}

class Splash {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-7, 7);
    this.vy = random(-7, 7);
    this.size = random(10, 35);
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(0, 255, 100, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}
