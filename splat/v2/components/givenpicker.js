const html = require('choo/html')

function GivenPicker(state, emit) {
  return state.elements.slice(1).map((el) => {
    let selectedClass = el.name === state.stampingRule ? 'selected' : ''
    let onclick = () => emit('selectStampingRule', el.name.toUpperCase())
    return html`
      <button
        class=${selectedClass}
        onclick=${onclick}
        >
        ${el.name}
      </button>`
  })
}

module.exports = GivenPicker
