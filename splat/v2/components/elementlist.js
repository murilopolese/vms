const html = require('choo/html')

function ElementList(state, emit) {
  return state.elements.map((el) => {
    let selectedClass = el.name === state.editingElement ? 'selected' : ''
    let onclick = () => emit('selectEditingElement', el.name)
    return html`
      <button
        class=${selectedClass}
        onclick=${onclick}
        >
        ${el.name}
      </button>
    `
  })
}

module.exports = ElementList
