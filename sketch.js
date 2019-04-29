var placing_dots = true;
var rect_coords;
var rect_wid = 100;
var rect_height = 40;
var pts = [];

function setup() {
  createCanvas(800,500);
  rect_coords = new createVector(width/2, height/2);
  rectMode(CENTER);
}

function draw() {
  background("skyblue");
  if (mouseIsPressed && overlappingRect(mouseX, mouseY) && !placing_dots) {
    rect_coords = new createVector(mouseX, mouseY);
  }
  for (var pt = 0; pt < pts.length; pt++) {
    if (placing_dots) {
      fill("black")
    } else if (overlappingRect(pts[pt].x, pts[pt].y)) {
      fill("green");
    } else {
      fill("red");
    }
    ellipse(pts[pt].x, pts[pt].y,5,5);
  }
  // draw rect
  if (!placing_dots) {
    noFill();
    rect(rect_coords.x, rect_coords.y, rect_wid, rect_height);
  }
}

function overlappingRect(x, y) {
  if(x < rect_coords.x + rect_wid/2 && x > rect_coords.x - rect_wid/2) {
    if (y < rect_coords.y + rect_height/2 && y > rect_coords.y - rect_height/2) {
      return true;
    }
  }
  return false;
}

function mouseClicked() {
  if (placing_dots) {
    pts.push(new createVector(mouseX, mouseY));
  }
}

function keyPressed() {
  placing_dots = !placing_dots;
  rect_coords = new createVector(width/2, height/2);
}
