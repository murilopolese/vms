let getTile = Module.cwrap('getTile', 'number', ['number', 'number'])
let setTile = Module.cwrap('setTile', null, ['number', 'number'])
let getCursorX = Module.cwrap('getCursorX', 'number', null)
let getCursorY = Module.cwrap('getCursorY', 'number', null)
let getSelectedColor = Module.cwrap('getSelectedColor', 'number', null)
let getSelectedEvent = Module.cwrap('getSelectedEvent', 'number', null)
let getSelectedSlot = Module.cwrap('getSelectedSlot', 'number', null)
let getView = Module.cwrap('getView', 'number', null)
let getRule = Module.cwrap('getRule', 'number', ['number', 'number', 'number', 'number', 'number'])
let eraseTile = Module.cwrap('eraseTile', null, ['number', 'number'])
let setMode = Module.cwrap('setMode', null, ['number'])
let selectColor = Module.cwrap('selectColor', null, ['number'])
let selectEvent = Module.cwrap('selectEvent', null, ['number'])
let selectSlot = Module.cwrap('selectSlot', null, ['number'])
let setRule = Module.cwrap('setRule', null, ['number', 'number', 'number'])
let eraseRule = Module.cwrap('eraseRule', null, ['number', 'number', 'number'])
let setCursor = Module.cwrap('setCursor', null, ['number', 'number'])
let applyRules = Module.cwrap('applyRules', null, ['number'])
let eraseMemory = Module.cwrap('eraseMemory', null, null)
let eraseRules = Module.cwrap('eraseRules', null, null)

const e = new EventTarget()

let res = 1;
const colors = [
  '#000000', '#2b335f', '#7e2072', '#19959c',
  '#8b4852', '#395c98', '#a9c1ff', '#eeeeee',
  '#d4186c', '#d38441', '#e9c35b', '#70c6a9',
  '#7696de', '#a3a3a3', '#ff9798', '#edc7b0',
]

let colorButtons = []

function setup() {
  createCanvas(500, 500)
  res = width/16
  noSmooth()
  noStroke()

  for (let i = 0; i < 16; i++) {
    let button = createButton(i)
    button.elt.classList.add('color-button')
    button.elt.style.background = colors[i]
    button.mousePressed(() => {
      selectColor(i)
    })
    colorButtons.push(button)
  }
}

setTimeout(() => {

  selectColor(2)
  setRule(1, 1, 0)
  selectColor(3)
  setRule(1, 1, 1)
  selectColor(2)

  window.draw = function() {
    background(0)
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        push()
        translate(x*res, y*res)
        let value = getTile(x, y)
        let color = colors[value]
        fill(color)
        square(0, 0, res)
        pop()
      }
    }
    applyRules(0)
  }
  window.mouseClicked = function() {
    let x = parseInt(mouseX / res)
    let y = parseInt(mouseY / res)
    setTile(x, y)
  }
}, 1000)
