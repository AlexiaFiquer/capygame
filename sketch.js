let capivara;
let capivaraStanding;
let capivaraAtual;
let capivaraX;
let boias = [];
let pedras = [];
let fundo;
let vidas = 3;
let tempo = 30;
let pontos = 0;
let frameContador = 0;
let pedraImg, boiaLaranja, boiaAzul;
let gameOverImg, tryAgainIcon;
let isMobile = false;
let arrastando = false;

function preload() {
  fundo = loadImage("assets/fundo.png");
  capivara = loadImage("assets/capivara.png");
  capivaraStanding = loadImage("assets/capivara-standing.png");
  pedraImg = loadImage("assets/gelo.png");
  boiaLaranja = loadImage("assets/boia_laranja.png");
  boiaAzul = loadImage("assets/boia_azul.png");
  gameOverImg = loadImage("assets/game-over.png");
  tryAgainIcon = loadImage("assets/try-again.svg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capivaraX = width / 2;
  capivaraAtual = capivara;
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  setInterval(() => {
    if (tempo > 0 && vidas > 0) tempo--;
  }, 1000);
  document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capivaraX = constrain(capivaraX, 0, width);
}

function draw() {
  background(255);
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

  let escalaCapivara = height * 0.16;
  let escalaItens = height * 0.12;
  let itemSize = escalaItens * 0.6;
  image(
    capivaraAtual,
    capivaraX - escalaCapivara / 2,
    height - escalaCapivara - 20,
    escalaCapivara,
    escalaCapivara
  );

  if (!isMobile) {
    if (keyIsDown(LEFT_ARROW)) capivaraX -= 5;
    if (keyIsDown(RIGHT_ARROW)) capivaraX += 5;
  }
  capivaraX = constrain(capivaraX, 0, width);

  frameContador++;
  let intervalo = isMobile ? 75 : 60;
  if (frameContador % intervalo === 0) {
    gerarItem();
  }

  let velocidade = isMobile ? 12 : 6;

  for (let i = pedras.length - 1; i >= 0; i--) {
    let p = pedras[i];
    image(pedraImg, p.x, p.y, itemSize, itemSize);
    p.y += velocidade;
    if (dist(p.x, p.y, capivaraX, height - itemSize / 2 - 20) < itemSize) {
      vidas--;
      pedras.splice(i, 1);
    } else if (p.y > height) {
      pedras.splice(i, 1);
    }
  }

  for (let i = boias.length - 1; i >= 0; i--) {
    let b = boias[i];
    image(b.tipo, b.x, b.y, itemSize, itemSize);
    b.y += velocidade;
    if (dist(b.x, b.y, capivaraX, height - itemSize / 2 - 20) < itemSize) {
      if (b.tipo === boiaLaranja || b.tipo === boiaAzul) tempo += 2;
      pontos += 5;
      boias.splice(i, 1);
    } else if (b.y > height) {
      boias.splice(i, 1);
    }
  }

  if (vidas > 0 && tempo > 0) {
    let boxWidth = isMobile ? width * 0.5 : width * 0.25;
    let textSizeVal = height * 0.035;
    let lineHeight = textSizeVal * 1.3;
    let boxHeight = lineHeight * 3 + 20;
    let boxX = 10;
    let boxY = 10;
    fill(255);
    noStroke();
    rect(boxX, boxY, boxWidth, boxHeight, 12);
    fill(0);
    textSize(textSizeVal);
    textAlign(LEFT, TOP);
    text(`⏱️ Tempo: ${tempo}`, boxX + 10, boxY + 10);
    text(`❤️ Vidas: ${vidas}`, boxX + 10, boxY + 10 + lineHeight);
    text(`⭐ Pontos: ${pontos}`, boxX + 10, boxY + 10 + lineHeight * 2);
  }

  if (vidas <= 0 || tempo <= 0) {
    noLoop();

    fill(0, 0, 0, 102);
    rect(0, 0, width, height);

    let centerX = width / 2;
    let centerY = height / 2;

    let imgW = isMobile ? width * 0.98 : width * 0.6;
    let imgH = imgW * (gameOverImg.height / gameOverImg.width);

    if (isMobile && imgH < height * 0.2) {
      imgH = height * 0.2;
      imgW = imgH * (gameOverImg.width / gameOverImg.height);
    }

    image(
      gameOverImg,
      centerX - imgW / 2,
      centerY - imgH / 2 - 160,
      imgW,
      imgH
    );

    textAlign(CENTER, CENTER);
    textSize(isMobile ? height * 0.05 : height * 0.05);
    fill(255);
    stroke(0);
    strokeWeight(2);
    text(`⭐ Pontos: ${pontos}`, centerX, centerY);
    noStroke();

    let iconSize = isMobile ? height * 0.08 : height * 0.08;
    let iconX = centerX - iconSize / 2;
    let iconY = centerY + 70;

    image(tryAgainIcon, iconX, iconY, iconSize, iconSize);

    textSize(isMobile ? height * 0.035 : height * 0.03);
    fill(255);
    stroke(0);
    strokeWeight(1);
    let textY = iconY + iconSize + 25;
    text("Tentar novamente", centerX, textY);
    noStroke();

    tryAgainArea = {
      x: iconX,
      y: iconY,
      w: iconSize,
      h: iconSize + 30,
      centerX: centerX,
      textY: textY,
      textSize: isMobile ? height * 0.035 : height * 0.03,
    };
  }
}

function gerarItem() {
  if (random() < 0.6) {
    pedras.push({ x: random(width), y: 0 });
  } else {
    const tipo = random([boiaLaranja, boiaAzul]);
    boias.push({ x: random(width), y: 0, tipo });
  }
}

function touchMoved() {
  if (touches.length > 0 && isMobile) {
    capivaraX = constrain(touches[0].x, 0, width);
    capivaraAtual = capivaraStanding;
    arrastando = true;
  }
  return false;
}

function mouseDragged() {
  if (!isMobile) {
    capivaraX = constrain(mouseX, 0, width);
    capivaraAtual = capivaraStanding;
    arrastando = true;
  }
  return false;
}

function touchEnded() {
  if (isMobile) {
    capivaraAtual = capivara;
    arrastando = false;
  }
}

function mouseReleased() {
  if (!isMobile) {
    capivaraAtual = capivara;
    arrastando = false;
  }
}

function reiniciarJogo() {
  vidas = 3;
  tempo = 30;
  pontos = 0;
  frameContador = 0;
  pedras = [];
  boias = [];
  loop();
}

function mousePressed() {
  if ((vidas <= 0 || tempo <= 0) && tryAgainArea) {
    let mx = mouseX;
    let my = mouseY;
    let area = tryAgainArea;

    let iconHit =
      mx >= area.x &&
      mx <= area.x + area.w &&
      my >= area.y &&
      my <= area.y + area.w;

    textSize(area.textSize);
    let textWidthApprox = textWidth("Tentar novamente");
    let textHeightApprox = area.textSize;
    let textHit =
      mx >= area.centerX - textWidthApprox / 2 &&
      mx <= area.centerX + textWidthApprox / 2 &&
      my >= area.textY - textHeightApprox / 2 &&
      my <= area.textY + textHeightApprox / 2;

    if (iconHit || textHit) {
      reiniciarJogo();
    }
  }
  return false;
}
