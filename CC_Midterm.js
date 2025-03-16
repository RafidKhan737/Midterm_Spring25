let swirls = [];
let drips = [];
let flavor = "strawberry";
let angleOffset = 0;
let tiltAmount = 0;
let backgroundColor = [255, 220, 230]; // Default pastel pink
let speed = 1.2;
let waveOffset = 0; // Controls the left-right oscillation
let swirlFrequency = 0.05; // Controls the speed of the left-right motion
let swirlAmplitude = 40; // Controls the strength of the left-right movement

function setup() {
  createCanvas(500, 500);
  frameRate(60);
}

function draw() {
  background(lerpColor(color(backgroundColor), color(255, 255, 255), 0.05)); // Smooth background fade

  // Apply smooth oscillation effect
  angleOffset = sin(frameCount * swirlFrequency) * 15 + tiltAmount;

  // Add a new swirl segment continuously
  if (frameCount % 8 === 0) {
    let variation = sin(waveOffset) * swirlAmplitude; // Smooth left-right motion
    let widthVariation = random(30, 50); // Ensure smoother variation in width
    swirls.push({
      x: width / 2 + variation,
      y: height - 120 + swirls.length * 15,
      width: widthVariation,
      angle: angleOffset,
    });
    waveOffset += 0.1; // Adjust speed of the left-right motion
  }

  // Draw all swirl segments
  for (let i = 0; i < swirls.length; i++) {
    let s = swirls[i];

    // Move the swirls downward smoothly
    s.y += speed;

    push();
    translate(s.x, s.y);
    rotate(radians(s.angle));
    drawGlow(0, 0, s.width);
    drawSwirl(0, 0, s.width);
    pop();
  }

  // Remove old swirls that move off-screen
  swirls = swirls.filter(s => s.y < height + 80);

  // Add new drip particles randomly
  if (frameCount % 15 === 0) {
    let dripX = width / 2 + sin(waveOffset) * swirlAmplitude + random(-15, 15); // Follow left-right motion
    let dripY = height - 110;
    drips.push({ x: dripX, y: dripY, speed: random(1, 2) });
  }

  // Draw and update drips
  for (let i = drips.length - 1; i >= 0; i--) {
    let d = drips[i];
    setColor(flavor, 150);
    strokeWeight(3);
    point(d.x, d.y);
    d.y += d.speed;

    if (d.y > height) {
      drips.splice(i, 1);
    }
  }
}

// Function to draw glow behind the swirl
function drawGlow(x, y, w) {
  setColor(flavor, 80);
  strokeWeight(w * 1.5);
  beginShape();
  vertex(x, y);
  bezierVertex(x + w, y - 50, x - w, y - 100, x, y - 150);
  bezierVertex(x + w * 0.8, y - 180, x - w * 0.8, y - 230, x, y - 260);
  bezierVertex(x + w * 0.6, y - 290, x - w * 0.6, y - 320, x, y - 340);
  endShape();
}

// Function to draw the swirl using bezier curves
function drawSwirl(x, y, w) {
  setColor(flavor, 255);
  strokeWeight(5);
  beginShape();
  vertex(x, y);
  bezierVertex(x + w, y - 50, x - w, y - 100, x, y - 150);
  bezierVertex(x + w * 0.8, y - 180, x - w * 0.8, y - 230, x, y - 260);
  bezierVertex(x + w * 0.6, y - 290, x - w * 0.6, y - 320, x, y - 340);
  endShape();
}

// Handle keyboard presses for flavor change + smooth pastel background transition
function keyPressed() {
  if (key === "1") {
    flavor = "vanilla";
    backgroundColor = [245, 235, 200]; // Darker beige
  } else if (key === "2") {
    flavor = "chocolate";
    backgroundColor = [230, 210, 180]; // Soft cocoa
  } else if (key === "3") {
    flavor = "strawberry";
    backgroundColor = [255, 220, 230]; // Pastel pink
  } else if (key === "4") {
    flavor = "vanilla-chocolate";
    backgroundColor = [240, 225, 200]; // Soft latte
  } else if (key === "5") {
    flavor = "caramel";
    backgroundColor = [250, 225, 190]; // Golden pastel
  }
}

// Handle mouse drag for slight tilt effect
function mouseDragged() {
  tiltAmount = map(mouseX, 0, width, -10, 10);
}

// Function to set color based on flavor with opacity control
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
