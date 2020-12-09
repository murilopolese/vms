const html = require('choo/html')
const Component = require('choo/component')
const colors = require('./colors.js')

function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class Canvas extends Component {
  constructor(id, state, emit) {
    super(id)
    this.n = 30
    this.size = 800
    this.res = this.size/this.n
    this.cursor = { x: 0, y: 0 }
    // this.dragging =
  }

  update(state) {
    let context = this.element.getContext('2d')
    context.clearRect(0, 0, this.element.width, this.element.height)
    let hoveringX = parseInt(
      map(this.cursor.x, 0, this.size, 0, this.n)
    )
    let hoveringY = parseInt(
      map(this.cursor.y, 0, this.size, 0, this.n)
    )
    for (let y = 0; y < this.n; y++) {
      for (let x = 0; x < this.n; x++) {
        if (hoveringX === x && hoveringY === y) {
          let index = state.elements.findIndex(e => e.name === state.stampingGrid)
          if (index !== -1) {
            context.fillStyle = colors[index]
          } else {
            context.fillStyle = '#000000'
          }
          context.fillRect(
            x*this.res,
            y*this.res,
            this.res,
            this.res
          )
          context.fillStyle = '#FFFFFF'
          context.fillText(
            state.grid[y][x].name,
            (this.res/4) + x*this.res,
            (this.res/4) + y*this.res
          )
        } else {
          let el = state.grid[y][x]
          let index = state.elements.findIndex(e => e.name === el.name)
          if (index === -1) {
            context.fillStyle = '#FFF'
          } else {
            context.fillStyle = colors[index]
          }

          context.fillRect(
            x*this.res,
            y*this.res,
            this.res,
            this.res
          )
          context.fillStyle = '#FFF'
          context.fillText(
            state.grid[y][x].name,
            (this.res/4) + x*this.res,
            (this.res/4) + y*this.res
          )
        }
      }
    }
    return false // never/don't upate DOM
  }

  stamp(emit) {
    let hoveringX = parseInt(
      map(this.cursor.x, 0, this.size, 0, this.n)
    )
    let hoveringY = parseInt(
      map(this.cursor.y, 0, this.size, 0, this.n)
    )
    emit('stampGrid', hoveringX, hoveringY)
  }

  createElement(state, emit) {
    let canvas = html`<canvas width=${this.size} height=${this.size}></canvas>`
    let context = canvas.getContext('2d')
    context.font = `${this.res}px monospace`;
    context.textAlign = 'left';
    context.textBaseline = "hanging";
    context.clearRect(0, 0, canvas.width, canvas.height)

    canvas.addEventListener('mousemove', (e) => {
      let layerX = e.layerX
      let layerY = e.layerY
      let canvasOriginalWidth = canvas.width
      let canvasOriginalHeight = canvas.height
      let canvasBounds = canvas.getBoundingClientRect()

      let relativeX = map(layerX, 0, canvasBounds.width, 0, canvasOriginalWidth)
      let relativeY = map(layerY, 0, canvasBounds.height, 0, canvasOriginalHeight)
      this.cursor = { x: relativeX, y: relativeY }

      if (e.buttons == 1) {
        this.stamp(emit)
      }
    })

    canvas.addEventListener('mousedown', (e) => {
      this.stamp(emit)
    })

    for (let y = 0; y < this.n; y++) {
      for (let x = 0; x < this.n; x++) {
        context.fillText(
          state.grid[y][x].name,
          (this.res/4) + x*this.res,
          (this.res/4) + y*this.res
        )
      }
    }
    return canvas
  }
}

module.exports = Canvas
