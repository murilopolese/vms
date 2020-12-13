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
  function CanvasStage() {
    return state.cache(Canvas, 'canvas').render(state, emit)
  }
  return html`
  <div id="grid">
    <div class="element-picker">
      ${GameControls()}
      ${ElementPicker()}
      <button onclick=${() => emit('save')}>•</button>
      <button onclick=${() => emit('openFileDialog')}>º</button>
    </div>
    <div class="grid">
      ${CanvasStage()}
    </div>
  </div>
  `
}

module.exports = Grid
