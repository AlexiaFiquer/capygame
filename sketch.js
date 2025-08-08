let capivara;
let capivaraStanding;
let capivaraAtual;
let capivaraX;
let boias = [];
let pedras = [];
let fundo;
let fundoCancun;
let vidas = 3;
let tempo = 50;
let pontos = 0;
let frameContador = 0;
let pedraImg, boiaLaranja, boiaAzul;
let gameOverImg, tryAgainIcon;
let isMobile = false;
let arrastando = false;
let capivaraSurfista;
let capivaraSurfistaPulando;
let velocidadeBonus = 0;
let fundoBaleia, fundoMalibu;
let capivaraPai, capivaraPaiPulando;
let capivaraMae, capivaraMaePulando;
let modoAvancado = false;
let marco150Ativado = false;
let marco250Ativado = false;
let marco350Ativado = false;

function preload() {
  fundo = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/fundo.png"
  );
  fundoCancun = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/fundo-cancun.png"
  );
  capivara = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara.png"
  );
  capivaraStanding = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara-standing.png"
  );
  capivaraSurfista = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara-surfista.svg"
  );
  capivaraSurfistaPulando = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara-surfista-pulando.png"
  );
  pedraImg = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/gelo.png"
  );
  boiaLaranja = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/boia_laranja.png"
  );
  boiaAzul = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/boia_azul.png"
  );
  gameOverImg = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/game-over.png"
  );
  tryAgainIcon = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/try-again.svg"
  );
  fundoBaleia = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/fundo-baleia.png"
  );
  fundoMalibu = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/fundo-malibu.png"
  );
  capivaraPai = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara-pai.png"
  );
  capivaraPaiPulando = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara-pai-pulando.png"
  );
  capivaraMae = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara-mae.png"
  );
  capivaraMaePulando = loadImage(
    "https://aquaticaamericanpark.com.br/wp-content/uploads/2025/08/capivara-mae-pulando.png"
  );
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

  let fundoAtual = fundo;
  if (pontos >= 350) {
    fundoAtual = fundoMalibu;
  } else if (pontos >= 250) {
    fundoAtual = fundoBaleia;
  } else if (pontos >= 150) {
    fundoAtual = fundoCancun;
  }
  image(fundoAtual, offsetX, offsetY, drawWidth, drawHeight);

  if (pontos >= 100 && velocidadeBonus < 1) velocidadeBonus = 1;
  if (pontos >= 150 && velocidadeBonus < 2) velocidadeBonus = 2;
  if (pontos >= 200 && velocidadeBonus < 3) velocidadeBonus = 3;
  if (pontos >= 250 && velocidadeBonus < 4) velocidadeBonus = 4;
  if (pontos >= 300 && velocidadeBonus < 5) velocidadeBonus = 5;

  if (!marco150Ativado && pontos >= 150) {
    tempo = 40;
    vidas = 3;
    marco150Ativado = true;
    modoAvancado = true;
  }

  if (!marco250Ativado && pontos >= 250) {
    tempo = 40;
    vidas = 3;
    marco250Ativado = true;
  }

  if (!marco350Ativado && pontos >= 350) {
    tempo = 20;
    vidas = 3;
    marco350Ativado = true;
  }

  let escalaCapivara = height * 0.16;
  let escalaItens = height * 0.12;
  let itemSize = escalaItens * 0.6;

  let imagemCapivaraFinal;

  if (pontos >= 350) {
    imagemCapivaraFinal = arrastando ? capivaraMaePulando : capivaraMae;
  } else if (pontos >= 250) {
    imagemCapivaraFinal = arrastando ? capivaraPaiPulando : capivaraPai;
  } else if (modoAvancado) {
    imagemCapivaraFinal = arrastando
      ? capivaraSurfistaPulando
      : capivaraSurfista;
  } else {
    imagemCapivaraFinal = capivaraAtual;
  }

  image(
    imagemCapivaraFinal,
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

  let baseVelocidade = isMobile ? 12 : 6;
  let velocidade = baseVelocidade * (1 + 0.2 * velocidadeBonus);

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
  if (random() < 0.4) {
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
  tempo = 50;
  pontos = 0;
  frameContador = 0;
  pedras = [];
  boias = [];
  modoAvancado = false;
  velocidadeBonus = 0;
  marco150Ativado = false;
  marco250Ativado = false;
  marco350Ativado = false;

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
