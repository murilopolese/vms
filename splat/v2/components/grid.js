const html = require('choo/html')
const Canvas = require('./canvas.js')
const colors = require('./colors.js')

function Grid(state, emit) {
  function ElementPicker() {
    return state.elements.map((el, i) => {
      let selectedClass = el.name === state.stampingGrid ? 'selected' : ''
      let onclick = () => emit('selectStampingGrid', el.name)
      return html`
        <button
          style="background: ${colors[i%colors.length]}"
          class=${selectedClass}
          onclick=${onclick}
          >
          ${el.name}
        </button>
      `
    })
  }
  function GameControls() {
    return html`
      <button onclick=${() => emit('play')}>${`>`}</button>
      <button onclick=${() => emit('stop')}>${`||`}</button>
      <button onclick=${() => emit('resetGrid')}>${`<`}</button>
    `
  }
  function ButtonStage() {
    let buttons = []
    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 30; x++) {
        let el = state.grid[y][x]
        let i = state.elements.findIndex(e => e.name === el.name)
        let onclick = () => emit('stampGrid', x, y)
        buttons.push(html`
          <button
            style="background: ${colors[i%colors.length]}"
            onclick=${onclick}
            >
          ${el.name}
          </button>
        `)
      }
    }
    return buttons
  }
  function CanvasStage() {
    return state.cache(Canvas, 'canvas').render(state, emit)
  }
  return html`
  <div id="grid">
    <div class="element-picker">
      ${GameControls()}
      ${ElementPicker()}
    </div>
    <div class="grid">
      ${CanvasStage()}
    </div>
  </div>
  `
}

module.exports = Grid
