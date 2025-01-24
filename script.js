// Variables to store the current brush size and color
let brushSize = 5;
let brushColor = 0;

// Variable to store the current eraser size
let eraserSize = 20;

// Variable to store whether the eraser is currently being used
let isEraser = false;

// Array to store the lines
let lines = [];

// Three.js scene, camera, and renderer
let scene, camera, renderer;
let cube;

function setup() {
  // Create the p5.js canvas
  const p5CanvasContainer = document.getElementById("p5-canvas-container");
  const p5Canvas = createCanvas(
    p5CanvasContainer.offsetWidth,
    p5CanvasContainer.offsetHeight
  );
  p5Canvas.parent(p5CanvasContainer);
  background(255);

  // Create the Three.js scene, camera, and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("three-canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth / 2, window.innerHeight);

  // Create a rotating cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Position the camera
  camera.position.z = 5;
}

function draw() {
  // Draw on the p5.js canvas
  if (mouseIsPressed) {
    if (isEraser) {
      // Use the eraser
      noStroke();
      fill(255);
      ellipse(mouseX, mouseY, eraserSize);
      // Store the eraser stroke
      lines.push({
        x1: mouseX,
        y1: mouseY,
        x2: mouseX,
        y2: mouseY,
        size: eraserSize,
        isEraser: true,
      });
    } else {
      // Draw with the selected brush size and color
      strokeWeight(brushSize);
      stroke(brushColor);
      line(mouseX, mouseY, pmouseX, pmouseY);
      // Store the line
      lines.push({
        x1: pmouseX,
        y1: pmouseY,
        x2: mouseX,
        y2: mouseY,
        size: brushSize,
        color: brushColor,
        isEraser: false,
      });
    }
  }

  // Animate the Three.js scene
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the Three.js scene
  renderer.render(scene, camera);
}

// Function to change the brush size
function changeBrushSize(size) {
  brushSize = size;
}

// Function to change the brush color
function changeBrushColor(color) {
  brushColor = color;
  // Change the cube's color based on user input
  cube.material.color.setHex(parseInt(color.substring(1), 16));
}

// Function to toggle the eraser
function toggleEraser() {
  isEraser = !isEraser;
}

// Function to change the eraser size
function changeEraserSize(size) {
  eraserSize = size;
}

function windowResized() {
  // Resize the p5.js canvas
  const p5CanvasContainer = document.getElementById("p5-canvas-container");
  resizeCanvas(p5CanvasContainer.offsetWidth, p5CanvasContainer.offsetHeight);
  background(255);

  // Redraw all the lines
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].isEraser) {
      noStroke();
      fill(255);
      ellipse(lines[i].x1, lines[i].y1, lines[i].size);
    } else {
      strokeWeight(lines[i].size);
      stroke(lines[i].color);
      line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
    }
  }

  // Resize the Three.js renderer
  renderer.setSize(window.innerWidth / 2, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Add event listeners for the brush size, color, and eraser
document.addEventListener("DOMContentLoaded", function () {
  const brushSizeInput = document.getElementById("brush-size");
  const brushColorInput = document.getElementById("brush-color");
  const eraserToggle = document.getElementById("eraser-toggle");
  const eraserSizeInput = document.getElementById("eraser-size");

  brushSizeInput.addEventListener("input", function () {
    changeBrushSize(parseInt(this.value));
  });

  brushColorInput.addEventListener("input", function () {
    changeBrushColor(this.value);
  });

  eraserToggle.addEventListener("click", function () {
    toggleEraser();
  });

  eraserSizeInput.addEventListener("input", function () {
    changeEraserSize(parseInt(this.value));
  });
});
