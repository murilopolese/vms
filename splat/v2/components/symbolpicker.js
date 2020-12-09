const html = require('choo/html')

function SymbolPicker(state, emit) {
  let symbols = ['@', '.', '?', '_']
  return symbols.map((symbol) => {
    let selectedClass = symbol === state.stampingRule ? 'selected' : ''
    let onclick = () => emit('selectStampingRule', symbol)
    return html`
      <button
        class=${selectedClass}
        onclick=${onclick}
        >
        ${symbol}
      </button>`
  })
}

module.exports = SymbolPicker
