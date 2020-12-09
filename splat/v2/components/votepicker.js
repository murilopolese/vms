const html = require('choo/html')

function VotePicker(state, emit) {
  return state.elements.slice(1).map((el) => {
    let selectedClass = el.name.toLowerCase() === state.stampingRule ? 'selected' : ''
    let onclick = () => emit('selectStampingRule', el.name.toLowerCase())
    return html`
      <button
        class=${selectedClass}
        onclick=${onclick}
        >
        ${el.name.toLowerCase()}
      </button>`
  })
}

module.exports = VotePicker
