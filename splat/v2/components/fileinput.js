const html = require('choo/html')

function Input(state, emit) {
  return html`
    <input type="file"
      id="file-input"
      accept=".json"
      onchange=${(e) => emit('loadState', e.target.files[0])}
    />
  `
}

module.exports = Input
