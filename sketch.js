let capivara;
let capivaraX;
let boias = [];
let pedras = [];
let fundo;
let vidas = 3;
let tempo = 60;
let frameContador = 0;
let pedraImg, boiaLaranja, boiaAzul;

function preload() {
  fundo = loadImage("assets/fundo.png");
  capivara = loadImage("assets/capivara.png");
  pedraImg = loadImage("assets/gelo.png");
  boiaLaranja = loadImage("assets/boia_laranja.png");
  boiaAzul = loadImage("assets/boia_azul.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capivaraX = width / 2;
  setInterval(() => {
    tempo--;
  }, 1000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capivaraX = constrain(capivaraX, 0, width);
}

function draw() {
  background(0);

  //Fundo responsivo
  let imgAspect = fundo.width / fundo.height;
  let canvasAspect = width / height;
  let drawWidth,
    drawHeight,
    offsetX = 0,
    offsetY = 0;

  if (canvasAspect > imgAspect) {
    drawWidth = width;
    drawHeight = width / imgAspect;
    offsetY = (height - drawHeight) / 2;
  } else {
    drawHeight = height;
    drawWidth = height * imgAspect;
    offsetX = (width - drawWidth) / 2;
  }

  image(fundo, offsetX, offsetY, drawWidth, drawHeight);

  // Escala mobile
  let escala = height * 0.12; // aumente esse valor
  let itemSize = escala * 0.6;

  // Escala da Capy
  image(capivara, capivaraX - escala / 2, height - escala - 20, escala, escala);

  if (keyIsDown(LEFT_ARROW)) capivaraX -= 5;
  if (keyIsDown(RIGHT_ARROW)) capivaraX += 5;
  capivaraX = constrain(capivaraX, 0, width);

  // Obstacúlos
  frameContador++;
  if (frameContador % 60 === 0) {
    if (random() < 0.6) {
      pedras.push({ x: random(width), y: 0 });
    } else {
      const tipo = random([boiaLaranja, boiaAzul]);
      boias.push({ x: random(width), y: 0, tipo });
    }
  }

  //Pedras
  for (let i = pedras.length - 1; i >= 0; i--) {
    let p = pedras[i];
    image(pedraImg, p.x, p.y, itemSize, itemSize);
    p.y += 5;

    if (dist(p.x, p.y, capivaraX, height - itemSize / 2 - 20) < itemSize) {
      vidas--;
      pedras.splice(i, 1);
    } else if (p.y > height) {
      pedras.splice(i, 1);
    }
  }

  //Boias
  for (let i = boias.length - 1; i >= 0; i--) {
    let b = boias[i];
    image(b.tipo, b.x, b.y, itemSize, itemSize);
    b.y += 5;

    if (dist(b.x, b.y, capivaraX, height - itemSize / 2 - 20) < itemSize) {
      if (b.tipo === boiaLaranja) vidas++;
      if (b.tipo === boiaAzul) tempo += 3;
      boias.splice(i, 1);
    } else if (b.y > height) {
      boias.splice(i, 1);
    }
  }

  fill(255);
  textSize(height * 0.04);
  textAlign(LEFT);
  text(`⏱️ Tempo: ${tempo}`, 20, 40);
  text(`❤️ Vidas: ${vidas}`, 20, 80);

  // Game Over
  if (vidas <= 0 || tempo <= 0) {
    noLoop();
    textSize(height * 0.06);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2);
  }
}

// Drag touchscreen
function touchMoved() {
  capivaraX = constrain(touches[0].x, 0, width);
  return false;
}
