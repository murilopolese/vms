let canvas
let gl
let theShader
let buffer
let grid
let rules

function preload(){
  theShader = loadShader('shader.vert', 'shader.frag');
  rules = loadImage('rules.png')
}

function setup() {
  canvas = createCanvas( 480, 480, WEBGL )
  grid = createGraphics(width, height, WEBGL)
  buffer = createGraphics(width, height, WEBGL)

  grid.clear()
  grid.background(0)
  grid.noStroke()
  grid.fill(255)
  grid.circle(0, 0, 10)

  grid.copy(buffer, 0, 0, 480, 480, 0, 0, 480, 480)
}

function draw() {
  background(0)

  theShader.setUniform('u_time', millis()/1000.0);
  theShader.setUniform('width', width*pixelDensity());
  theShader.setUniform('height', height*pixelDensity());
  theShader.setUniform('mouseX', mouseX*pixelDensity());
  theShader.setUniform('mouseY', mouseY*pixelDensity());
  theShader.setUniform('rules', rules)
  theShader.setUniform('grid', grid)

  buffer.clear()
  buffer.background(0)
  buffer.push()
  buffer.shader(theShader)
  buffer.quad(-1, -1, 1, -1, 1, 1, -1, 1)
  buffer.pop()
  image(buffer, -width/2, -height/2, width, height)

  // let temp
  // temp = grid
  // grid = buffer
  // buffer = temp

  // grid.copy(buffer, -50, 0, 480, 480, 0, 0, 480, 480)
}

function mousePressed() {
  grid.clear()
  grid.image(buffer, -width/2, -height/2, width, height)
}
