let swirls = [];
let drips = [];
let toppings = [];
let flavor = "vanilla"; // 
let angleOffset = 0;
let tiltAmount = 0;
let backgroundColor = [245, 235, 200]; // vanilla background
let speed = 1.2;
let waveOffset = 0;
let swirlFrequency = 0.05;
let swirlAmplitude = 40;
let sprinkleColors;
let mode = "iceCream"; // Ice cream mode

function setup() {
  createCanvas(500, 500);
  frameRate(60);
  sprinkleColors = [
    color(255, 100, 150),
    color(255, 200, 50),
    color(100, 255, 200),
    color(150, 100, 255),
    color(255, 255, 255),
  ];
}

function draw() {
  background(lerpColor(color(backgroundColor), color(255, 255, 255), 0.03));

  angleOffset = sin(frameCount * swirlFrequency) * 15 + tiltAmount;

  let centerX = width / 2;
  let baseY = height / 2 + 80;

  // Don't draw anything until user interaction
  if (mode === "iceCream" && swirls.length < 1 && frameCount < 30) return;

  if (mode === "iceCream") {
    drawCone(centerX, baseY + 20);

    // This puts a new swirls 
    if (frameCount % 8 === 0) {
      let variation = sin(waveOffset) * swirlAmplitude;
      let widthVariation = random(30, 50);
      swirls.push({
        x: centerX + variation,
        y: baseY - swirls.length * 18,
        width: widthVariation,
        angle: angleOffset,
        bounce: sin(frameCount * 0.1) * 3
      });
      waveOffset += 0.1;
    }

    for (let i = 0; i < swirls.length; i++) {
      let s = swirls[i];
      s.y += speed * 0.3;
      push();
      translate(s.x, s.y + s.bounce);
      rotate(radians(s.angle));
      drawGlow(0, 0, s.width);
      drawSwirl(0, 0, s.width);
      drawSprinkles(0, 0, s.width);
      pop();
    }

    swirls = swirls.filter(s => s.y < height + 80);
  } 
  else if (mode === "popsicle") {
    drawPopsicle(centerX, baseY);
  }

  // This is the toppings
  for (let t of toppings) {
    fill(t.color);
    noStroke();
    ellipse(t.x, t.y, 6, 6);
  }

  // Drips
  if (frameCount % 15 === 0) {
    let dripX = centerX + sin(waveOffset) * swirlAmplitude + random(-10, 10);
    let dripY = baseY - swirls.length * 18;
    drips.push({ x: dripX, y: dripY, speed: random(0.5, 1.2) });
  }

  for (let i = drips.length - 1; i >= 0; i--) {
    let d = drips[i];
    setColor(flavor, 150);
    strokeWeight(3);
    point(d.x, d.y);
    d.y += d.speed;
    if (d.y > height) drips.splice(i, 1);
  }
}

// Ice cream cone
function drawCone(cx, cy) {
  fill(245, 200, 150);
  noStroke();
  triangle(cx - 40, cy, cx + 40, cy, cx, cy + 100);

  stroke(210, 140, 80);
  strokeWeight(1);
  for (let i = 0; i < 10; i++) {
    line(cx - 40 + i * 8, cy, cx - 10 + i * 8, cy + 100);
    line(cx + 40 - i * 8, cy, cx + 10 - i * 8, cy + 100);
  }
}

// Popsicle shape
function drawPopsicle(cx, cy) {
  push();
  translate(cx, cy);
  rotate(radians(tiltAmount));

  // This is the popsicle stick
  fill(200, 170, 120);
  noStroke();
  rect(-10, 50, 20, 40, 10);

  // The ice cream itself
  setColor(flavor, 255);
  strokeWeight(4);
  stroke(0, 50);
  fill(getFlavorFill(flavor));
  rect(-40, -100, 80, 150, 20);

  // Toppings
  for (let i = 0; i < 10; i++) {
    let sx = random(-30, 30);
    let sy = random(-80, 40);
    fill(random(sprinkleColors));
    noStroke();
    ellipse(sx, sy, 5, 5);
  }

  pop();
}

// Swirl visuals
function drawGlow(x, y, w) {
  setColor(flavor, 80);
  strokeWeight(w * 1.5);
  beginShape();
  vertex(x, y);
  bezierVertex(x + w, y - 50, x - w, y - 100, x, y - 150);
  endShape();
}

function drawSwirl(x, y, w) {
  setColor(flavor, 255);
  strokeWeight(5);
  beginShape();
  vertex(x, y);
  bezierVertex(x + w, y - 50, x - w, y - 100, x, y - 150);
  endShape();
}

function drawSprinkles(x, y, w) {
  for (let i = 0; i < 3; i++) {
    let sx = x + random(-w / 2, w / 2);
    let sy = y - random(20, 140);
    let c = random(sprinkleColors);
    stroke(c);
    strokeWeight(3);
    point(sx, sy);
  }
}

// Keyboard controls
function keyPressed() {
  if (key === "1") {
    flavor = "vanilla";
    backgroundColor = [245, 235, 200];
  } else if (key === "2") {
    flavor = "chocolate";
    backgroundColor = [230, 210, 180];
  } else if (key === "3") {
    flavor = "strawberry";
    backgroundColor = [255, 220, 230];
  } else if (key === "4") {
    flavor = "vanilla-chocolate";
    backgroundColor = [240, 225, 200];
  } else if (key === "5") {
    flavor = "caramel";
    backgroundColor = [250, 225, 190];
  } else if (key === "M" || key === "m") {
    mode = (mode === "iceCream") ? "popsicle" : "iceCream";
    swirls = []; // reset swirls when switching mode
  }
}

function mouseDragged() {
  tiltAmount = map(mouseX, 0, width, -10, 10);
}

function mousePressed() {
  toppings.push({
    x: mouseX,
    y: mouseY,
    color: random(sprinkleColors)
  });
}

// Flavor colors
function setColor(flavor, alpha) {
  if (flavor === "vanilla") stroke(255, 255, 220, alpha);
  else if (flavor === "chocolate") stroke(90, 50, 20, alpha);
  else if (flavor === "strawberry") stroke(255, 150, 200, alpha);
  else if (flavor === "caramel") stroke(200, 130, 50, alpha);
  else if (flavor === "vanilla-chocolate") {
    if (frameCount % 20 < 10) stroke(255, 255, 220, alpha);
    else stroke(90, 50, 20, alpha);
  }
}

function getFlavorFill(flavor) {
  if (flavor === "vanilla") return color(255, 255, 220);
  else if (flavor === "chocolate") return color(90, 50, 20);
  else if (flavor === "strawberry") return color(255, 150, 200);
  else if (flavor === "caramel") return color(200, 130, 50);
  else return color(240, 200, 180);
}

//Overall I am experimenting between soft ice cream and popsicles back to back in order to symbolize Yummy
//Here is the inspiration I got in order to design this midterm project: https://www.youtube.com/watch?v=EaMed9sUPVo

